import Message from "./Message";

interface ChatMessageType {
  message: any[];
  currentUser: string;
  chatUserAvatar: any;
  currentUserAvatar: string;
  chat: string;
}

const ChatMessage = ({
  message,
  currentUser,
  chatUserAvatar,
  chat,
  currentUserAvatar,
}: ChatMessageType) => {
  return (
    <div className="no-scrollbar mt-4 h-64 overflow-y-scroll">
      {message.map((message, i) => (
        <Message
          key={i}
          type={message.type}
          user={message.user}
          message={message.message}
          timestamp={message.timestamp}
          currentUser={currentUser}
          chatUserAvatar={chatUserAvatar}
          currentUserAvatar={currentUserAvatar}
          chat={chat}
        />
      ))}
    </div>
  );
};

export default ChatMessage;
