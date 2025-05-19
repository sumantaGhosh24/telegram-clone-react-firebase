import {signOut} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import Link from "next/link";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

import {auth, db} from "../firebase";

function Navbar({id}: {id: string}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        online: false,
      });
      await signOut(auth);
      toast.success("Logout Successful!", {toastId: "logout-success"});
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message, {toastId: "logout-error"});
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-white">My App</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <p className="text-white">Chat</p>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <p className="text-white">Profile</p>
            </Link>
          </li>
          <li>
            <button className="text-white" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
