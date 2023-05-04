interface Props {
  message: string
}
const BotBubble = ({ message }: Props) => {
  return (
    <div className="flex flex-row items-center">
      <div className="bg-indigo-100 relative ml-3 text-sm bg-gray-200 py-2 px-4 shadow rounded-xl">
        <article className="prose prose-slate">{message}</article>
      </div>
    </div>
  )
}

export default BotBubble
