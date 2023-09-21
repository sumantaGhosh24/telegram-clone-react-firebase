import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import Head from "next/head";
import {useRouter} from "next/router";

import Navbar from "../components/Navbar";
import {firebaseApp} from "../firebase";

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

  const auth = getAuth();
  const db = getFirestore(firebaseApp);

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

  return (
    <>
      <Head>
        <title>Groups | Telegram Clone</title>
      </Head>
      <Navbar id={user.userId} />
      <p>Groups!</p>
    </>
  );
}
