export default function message({message}) {
  if(!message) return null;
  return (
    <div className={`message message-${message.type}`}>{message.text}</div>
  )
}
