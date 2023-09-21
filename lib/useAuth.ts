import {useState, useEffect} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";

import {firebaseApp} from "../firebase";

const useAuth = () => {
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
            email: authUser.email || "",
            bio: userData.bio,
            avatar: userData.avatar,
          });
        } else {
          setUser({
            userId: authUser.uid,
            name: "",
            username: "",
            email: authUser.email || "",
            bio: "",
            avatar: "",
          });
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
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
};

export default useAuth;
