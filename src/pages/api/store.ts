import type { NextApiRequest, NextApiResponse } from 'next'
import { YoutubeTranscript, TranscriptResponse } from 'youtube-transcript'
import { OpenAI } from 'langchain/llms/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { pinecone } from '@/utils/pinecone-client'
import { PINECONE_INDEX_NAME } from '@/config/pinecone'
import { OPENAI_API_KEY } from '@/config/openAi'
import { Document } from 'langchain/document'

const makeDoc = (transcript: TranscriptResponse[]): Document[] => {
  let docs = []
  const chunk = 10
  const chunkOverlap = 1
  for (let i = 0; i < transcript.length; i += chunk) {
    let doc = { metadata: { offset: 0 }, pageContent: '' }
    doc.metadata = { offset: transcript[i].offset }
    const sliceStart = i - chunkOverlap < 0 ? 0 : i - chunkOverlap
    const sliceEnd =
      i + chunk > transcript.length ? transcript.length : i + chunk
    doc.pageContent = transcript
      .slice(sliceStart, sliceEnd)
      .map((t) => t.text?.trim())
      .join(' ')
    docs.push(new Document(doc))
  }
  return docs
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const videoId = req.query.videoId as string | undefined

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' })
    return
  }


  try {
    const transcriptResponse: TranscriptResponse[] =
      await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' })

    if (!transcriptResponse || transcriptResponse.length === 0) {
      res.status(404).json({ error: 'No captions found for this video' })
      return
    }



    const index = pinecone.Index(PINECONE_INDEX_NAME)

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    })

    const docs = makeDoc(transcriptResponse)

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: videoId,
      textKey: 'text',
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching captions' })
  }
}
