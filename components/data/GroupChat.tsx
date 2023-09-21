import React, {useEffect, useState} from "react";
import {db} from "../firebase";

function GroupChat({user, groupId}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for the selected group
    const unsubscribe = db
      .collection("groups")
      .doc(groupId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);
      });

    return () => {
      unsubscribe();
    };
  }, [groupId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      // Add a new message to the group
      await db.collection("groups").doc(groupId).collection("messages").add({
        text: newMessage,
        senderId: user.uid,
        timestamp: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div>
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default GroupChat;
