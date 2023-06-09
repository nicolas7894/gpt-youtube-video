import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { pinecone } from '@/utils/pinecone-client'
import { PINECONE_INDEX_NAME } from '@/config/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { makeChain } from '@/utils/makechain'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { question, history, youtubeId } = req.body

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!question || !youtubeId) {
    return res.status(400).json({ message: 'Request error' })
  }

  const sanitizedQuestion = question.trim().replaceAll('\n', ' ')

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME)

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: youtubeId,
      }
    )

    const chain = makeChain(vectorStore)

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    })

    res.status(200).json(response)
  } catch (error: any) {
    console.log('error', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}
