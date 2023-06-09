import { OpenAI } from 'langchain/llms/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import {
  LLMChain,
  loadQAChain,
  ConversationalRetrievalQAChain,
  ConversationalRetrievalQAChainInput,
} from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`)

const QA_PROMPT =
  PromptTemplate.fromTemplate(`You are a helpful AI assistant. Use the following pieces of context delimited by << >> to answer the question.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer. 
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context. The context is from a video transcript.

<<{context}>>

Question: {question}
Helpful answer in markdown:`)

export const makeChain = (vectorstore: PineconeStore) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  })

  const docChain = loadQAChain(new OpenAI({ temperature: 0 }), {
    prompt: QA_PROMPT,
  })

  const input: ConversationalRetrievalQAChainInput = {
    retriever: vectorstore.asRetriever(),
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
  }

  return new ConversationalRetrievalQAChain(input)
}
