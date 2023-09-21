import {useState} from "react";
import {collection, addDoc} from "firebase/firestore";

import {db} from "../firebase";

const MessageInput = ({currentUser}) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        senderId: currentUser.uid,
        timestamp: new Date(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
