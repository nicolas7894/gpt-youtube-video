import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { pinecone } from '@/utils/pinecone-client'
import { PINECONE_INDEX_NAME } from '@/config/pinecone'
import { OPENAI_API_KEY } from '@/config/openAi'
import { OpenAI } from 'langchain/llms/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import {
  LLMChain,
  RetrievalQAChain,
  RefineDocumentsChain,
  SerializedRefineDocumentsChain,
  RetrievalQAChainInput,
  loadQAChain,
} from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'
import { CallbackManagerForChainRun, Callbacks } from 'langchain/dist/callbacks'
import { ChainValues } from 'langchain/dist/schema'
import { Document } from 'langchain/document'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { question, history, youtubeId } = req.query

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME)

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: youtubeId?.toString(),
      }
    )
    const model = new OpenAI({})

    const QA_PROMPT =
      PromptTemplate.fromTemplate(`You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
  If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
  
  {context}
  
  Question: {question}
  Helpful answer in markdown:`)

    const docChain = loadQAChain(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', verbose: true }),
      {
        prompt: QA_PROMPT,
      }
    )

    const input: RetrievalQAChainInput = {
      retriever: vectorStore.asRetriever(),
      combineDocumentsChain: docChain,
    }

    const qa = new RetrievalQAChain(input)

    const resChain = await qa.call({
      query: 'What is the distance between the moon and mars?',
    })

    res.status(200).json({ response: resChain })
  } catch (error: any) {
    console.log('error', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}
