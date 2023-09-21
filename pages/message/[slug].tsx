import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import {useRouter} from "next/router";
import Link from "next/link";

import Navbar from "../../components/Navbar";
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
  const [chatUser, setChatUser] = useState({});
  const [chat, setChat] = useState<ChatType>({
    id: "",
    timestamp: "",
    lastMessage: "",
    users: [],
  });
  const [message, setMessage] = useState<any[]>([]);

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
            email: userData.email,
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
        const userId =
          users[0] === user.userId
            ? users[1]
            : users[1] === user.userId
            ? users[0]
            : users[1];
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
      }
    };
    return () => {
      unsubscribe();
    };
  }, [db, messageId, router, user.userId]);

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
  }, [db, messageId, router, user.userId]);

  if (typeof chat.users === "undefined") {
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

  return (
    <>
      <Head>
        <title>Chat | Telegram Clone</title>
      </Head>
      <Navbar id={user.userId} />
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl bg-white p-4">
          <ChatHeader chatUser={chatUser} chat={chat} />
          <ChatMessage
            chat={chat.id}
            message={message}
            currentUser={user.userId}
            chatUserAvatar={chatUser}
            currentUserAvatar={user.avatar}
          />
          <ChatInput chat={chat.id} user={user.userId} />
        </div>
      </div>
    </>
  );
}
