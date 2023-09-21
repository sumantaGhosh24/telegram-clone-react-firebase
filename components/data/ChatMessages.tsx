// components/ChatMessages.tsx (Continuing from previous examples)
import {useEffect, useState} from "react";
import {collection, query, orderBy, onSnapshot} from "firebase/firestore";
import firebaseApp from "../firebase";

const ChatMessages = ({currentUser}) => {
  const [messages, setMessages] = useState([]);
  const db = firestore(firebaseApp);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({id: doc.id, ...doc.data()});
      });
      setMessages(newMessages);

      // Check if the message is from another user and trigger a notification
      newMessages.forEach((message) => {
        if (message.senderId !== currentUser.uid) {
          showNotification(message.text); // Implement showNotification function
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [db, currentUser]);

  // Function to show a notification using the Web Push API
  const showNotification = (messageText) => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Message", {
            body: messageText,
          });
        }
      });
    }
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
          <p>{message.sender}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
