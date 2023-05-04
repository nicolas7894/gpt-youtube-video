interface Props {
  message: string
}
const UserBubble = ({ message }: Props) => {
  return (
    <div className="flex flex-row items-center">
      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl bg">
        <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
      </div>
    </div>
  )
}

export default UserBubble
