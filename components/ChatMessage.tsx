import {useEffect, useState} from "react";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import Message from "./Message";
import {firebaseApp} from "../firebase";

interface ChatMessageType {
  messageId: string;
  currentUser: string;
  currentUserAvatar: string;
  chatId: string;
}

interface ChatUserType {
  avatar: string;
  username: string;
  name: string;
  bio: string;
  lastLogin: any;
  online: boolean;
}

const ChatMessage = ({
  messageId,
  currentUser,
  currentUserAvatar,
  chatId,
}: ChatMessageType) => {
  const [message, setMessage] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<ChatUserType>();

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = async () => {
      const docSnap = await getDoc(doc(db, "chats", `${messageId}`));
      const users = await docSnap.data()?.users;
      if (users) {
        const chatUser = users?.filter((el: string) => el !== currentUser);
        const docSnap = await getDoc(doc(db, "users", `${chatUser}`));
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
      }
    };
    return () => {
      unsubscribe();
    };
  }, [db, messageId, currentUser]);

  useEffect(() => {
    const unsubscribe = () => {
      const messageRef = collection(db, "chats", `${messageId}`, "messages");
      const messageQuery = query(messageRef, orderBy("timestamp", "asc"));
      onSnapshot(messageQuery, (snapshot) => {
        setMessage(snapshot.docs.map((doc) => doc.data()));
      });
    };
    return () => {
      unsubscribe();
    };
  }, [db, messageId]);

  if (typeof chatUser === "undefined") return <p>Loading...</p>;

  return (
    <div className="no-scrollbar mt-4 h-[550px] overflow-y-scroll p-5">
      {message.map((message, i) => (
        <Message
          key={i}
          currentUser={currentUser}
          currentUserAvatar={currentUserAvatar}
          chat={chatId}
          chatUserAvatar={chatUser?.avatar}
          type={message.type}
          user={message.user}
          message={message.message}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  );
};

export default ChatMessage;
