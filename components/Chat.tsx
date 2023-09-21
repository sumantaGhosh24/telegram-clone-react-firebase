import {useEffect, useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";

import {firebaseApp} from "../firebase";
import Link from "next/link";
import Image from "next/image";
import {Power, PowerOff} from "lucide-react";

interface ChatTypes {
  chat: any;
  currentUser: string;
}

interface ChatUserType {
  avatar: string;
  username: string;
  name: string;
  bio: string;
  lastLogin: any;
  online: boolean;
}

const Chat = ({chat, currentUser}: ChatTypes) => {
  const [chatUser, setChatUser] = useState<ChatUserType>();

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = async () => {
      const userId =
        chat?.users[0] === currentUser
          ? chat?.users[1]
          : chat?.users[1] === currentUser
          ? chat?.users[0]
          : chat?.user[1];
      const docSnap = await getDoc(doc(db, "users", `${userId}`));
      if (docSnap.exists()) {
        setChatUser({
          avatar: docSnap.data().avatar,
          username: docSnap.data().username,
          name: docSnap.data().name,
          bio: docSnap.data().bio,
          lastLogin: docSnap.data().lastLogin,
          online: docSnap.data().online,
        });
      }
    };
    return () => {
      unsubscribe();
    };
  }, [chat, currentUser, db]);

  return (
    <Link
      href={`/message/${chat.id}`}
      className="my-4 flex cursor-pointer items-center justify-start rounded-md bg-white p-4 shadow-md hover:bg-blue-50"
    >
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
        <p className="my-2 text-xs font-extralight">
          {chat?.lastMessage?.toDate().toDateString()}
        </p>
      </div>
      <div className="ml-auto">
        {chatUser?.online ? (
          <Power className="text-green-500" />
        ) : (
          <PowerOff className="text-red-500" />
        )}
        <p className="my-2 text-base">
          {chatUser?.lastLogin?.toDate().toDateString()}
        </p>
      </div>
    </Link>
  );
};

export default Chat;