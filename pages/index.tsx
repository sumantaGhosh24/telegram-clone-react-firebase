import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/router";
import Head from "next/head";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {auth, db} from "../firebase";
import Navbar from "../components/Navbar";
import AddChat from "../components/AddChat";
import Chat from "../components/Chat";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState({
    userId: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [chats, setChats] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

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
    const userQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", user.userId)
    );
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const foundChats: any[] = [];
      querySnapshot.forEach((doc) => {
        foundChats.push({id: doc.id, ...doc.data()});
      });
      setChats(foundChats);
    });
    return () => {
      unsubscribe();
    };
  }, [db, user.userId]);

  return (
    <>
      <Head>
        <title>Chats | Telegram Clone</title>
      </Head>
      <Navbar id={user.userId} />
      <div className="h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl p-4">
          <AddChat
            open={open}
            setOpen={setOpen}
            user={user.userId}
            username={user.username}
          />
          <div className="">
            {chats.length === 0 ? (
              <p className="text-center font-bold text-red-800">
                No chat found.
              </p>
            ) : (
              chats.map((chat) => (
                <Chat key={chat.id} chat={chat} currentUser={user.userId} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
