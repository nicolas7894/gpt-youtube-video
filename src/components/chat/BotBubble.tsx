import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

interface Props {
  message: any
  youtubeId: string
}
const BotBubble = ({ message, youtubeId }: Props) => {
  const getOffsetInSeconde = (doc: any) => {
    if (!doc.metadata.offset) return 0
    return doc.metadata.offset / 1000
  }
  return (
    <>
      <div className="flex flex-row items-center">
        <div className="bg-indigo-100 relative ml-3 text-sm bg-gray-200 py-2 px-4 shadow rounded-xl">
          <article className="prose prose-slate">{message.text}</article>
        </div>
      </div>
      {message.sourceDocs && message.sourceDocs.length > 0 && (
        <div className="mt-1 flex flex-row items-center px-8">
          <div className="grid grid-cols-4 gap-4 px-8">
            {message.sourceDocs.map((doc: any, index: number) => {
              return (
                <a
                  key={index}
                  href={`https://www.youtube.com/watch?v=${youtubeId}&t=${getOffsetInSeconde(
                    doc
                  )}s`}
                  target="_blank"
                  className="flex hover:gray-800 items-center bg-gray-100 relative ml-3 text-xs bg-gray-200 py-2 px-2 shadow rounded-xl"
                >
                  Source {index + 1}
                  <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default BotBubble
