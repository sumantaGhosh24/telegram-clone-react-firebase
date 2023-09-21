import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {Send} from "lucide-react";
import {useState} from "react";
import {toast} from "react-toastify";
import {firebaseApp} from "../firebase";
import {encryptWithAES} from "../lib/encrypt-decrypt";

import {Button} from "./ui/button";

interface ChatInputType {
  chat: string;
  user: string;
}

const ChatInput = ({chat, user}: ChatInputType) => {
  const [message, setMessage] = useState("");

  const db = getFirestore(firebaseApp);

  const addChat = async (e: any) => {
    e.preventDefault();
    if (!message) return;
    try {
      await addDoc(collection(db, "chats", chat, "messages"), {
        type: "message",
        message: encryptWithAES(message, chat),
        timestamp: serverTimestamp(),
        user,
      });

      const chatRef = doc(db, "chats", chat);
      await updateDoc(chatRef, {lastMessage: serverTimestamp()});
      setMessage("");
      toast.success("Chat Added!", {toastId: "add-chat-success"});
    } catch (error: any) {
      toast.error(error.message, {toastId: "add-chat-error"});
    }
  };

  return (
    <div className="fixed bottom-10 mt-4 flex w-full">
      <input
        type="text"
        name="message"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mr-5 w-[80%] rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        placeholder="Type your message..."
        required
      />
      <Button type="button" variant="primary" size="icon" onClick={addChat}>
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
