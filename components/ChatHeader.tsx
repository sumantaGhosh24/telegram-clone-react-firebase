import {Power, PowerOff} from "lucide-react";
import Image from "next/image";

interface ChatHeaderType {
  chatUser: any;
  chat: any;
}

const ChatHeader = ({chatUser, chat}: ChatHeaderType) => {
  return (
    <div className="flex items-center justify-start rounded-t-lg bg-blue-500 px-4 py-2 text-white">
      <Image
        src={chatUser?.avatar || "https://placehold.co/400"}
        alt={chatUser?.username || "placehold"}
        height={100}
        width={100}
        unoptimized
        className="mr-10 h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold capitalize">{chatUser?.name}</h3>
        <h4 className="my-2 text-sm font-bold">{chatUser?.username}</h4>
        <p className="my-2 text-sm font-light">{chatUser?.bio}</p>
      </div>
      <div className="ml-auto">
        {chatUser?.online ? (
          <Power className="text-green-500" />
        ) : (
          <PowerOff className="text-red-500" />
        )}
        <p className="my-2 text-base">
          Last Login:{" "}
          {chatUser?.lastLogin?.toDate().toDateString() || "not login"}
        </p>
        <p className="my-2 text-base">
          Last Message: {chat?.lastMessage?.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
