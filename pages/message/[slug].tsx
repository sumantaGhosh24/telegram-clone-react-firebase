import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import Head from "next/head";
import {useRouter} from "next/router";
import Link from "next/link";

import {firebaseApp} from "../../firebase";
import ChatHeader from "../../components/ChatHeader";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";

interface ChatType {
  id: string;
  timestamp: any;
  lastMessage: any;
  users: string[];
}

interface ChatUserType {
  avatar: string;
  username: string;
  name: string;
  bio: string;
  lastLogin: any;
  online: boolean;
}

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState({
    userId: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [chatUser, setChatUser] = useState<ChatUserType>({
    avatar: "",
    username: "",
    name: "",
    bio: "",
    lastLogin: "",
    online: false,
  });
  const [chat, setChat] = useState<ChatType>();

  const auth = getAuth();
  const db = getFirestore(firebaseApp);
  const messageId = router.query.slug;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docSnap = await getDoc(doc(db, "users", authUser.uid));

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            userId: authUser.uid,
            name: userData.name,
            username: userData.username,
            email: authUser.email || "",
            bio: userData.bio,
            avatar: userData.avatar,
          });
        } else {
          setUser({
            userId: authUser.uid,
            name: "",
            username: "",
            email: "",
            bio: "",
            avatar: "",
          });
          router.push("/profile");
        }
      } else {
        setUser({
          userId: "",
          name: "",
          username: "",
          email: "",
          bio: "",
          avatar: "",
        });
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const docSnap = await getDoc(doc(db, "chats", `${messageId}`));
      setChat({
        id: docSnap.id,
        timestamp: docSnap.data()?.timestamp,
        lastMessage: docSnap.data()?.lastMessage,
        users: docSnap.data()?.users,
      });

      const users = await docSnap.data()?.users;
      if (users) {
        const chatUser = users.filter((el: string) => el !== user.userId);
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
  }, [db, messageId, router, user.userId]);

  if (typeof chat?.users === "undefined") {
    return "Loading...";
  }
  if (typeof messageId === "undefined") {
    return "Loading...";
  }
  if (chat.users[0] !== user.userId && chat.users[1] !== user.userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-4/6 rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">
            Invalid Authentication!
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Only participants of this chat can access this page.
          </p>
          <Link href="/">
            <p className="text-blue-500 hover:underline">
              Go back to the homepage
            </p>
          </Link>
        </div>
      </div>
    );
  }

  console.log(chatUser);

  return (
    <>
      <Head>
        <title>Chat | Telegram Clone</title>
      </Head>
      <div className="bg-gray-100 p-5">
        <div className="mx-auto max-w-5xl bg-white">
          <ChatHeader messageId={String(messageId)} currentUser={user.userId} />
          <ChatMessage
            messageId={String(messageId)}
            currentUser={user.userId}
            currentUserAvatar={user.avatar}
            chatId={chat.id}
          />
          <ChatInput chat={String(messageId)} user={user.userId} />
        </div>
      </div>
    </>
  );
}
