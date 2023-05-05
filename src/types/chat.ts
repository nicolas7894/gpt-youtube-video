import { Document } from 'langchain/document'

export type Message = {
  type: 'apiMessage' | 'userMessage'
  text: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}
