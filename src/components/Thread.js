import React, {useState} from "react";
import {Avatar, IconButton} from "@material-ui/core";
import {
  MicNoneOutlined,
  MoreVert,
  SendRounded,
  TimerOutlined,
} from "@material-ui/icons";

import "./Thread.css";
import db from "../firebase";

const Thread = () => {
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("threads").doc(threadId).collection("messages");
    setInput("");
  };

  return (
    <div className="thread">
      <div className="thread__header">
        <div className="thread__header__contents">
          <Avatar />
          <div className="thread__header__contents__info">
            <h4>thread name</h4>
            <h5>last name</h5>
          </div>
        </div>
        <IconButton>
          <MoreVert className="thread__header__details" />
        </IconButton>
      </div>
      <div className="thread__messages"></div>
      <div className="thread__input">
        <form>
          <input
            placeholder="write your message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton color="primary">
            <TimerOutlined />
          </IconButton>
          <IconButton onClick={sendMessage} color="primary">
            <SendRounded />
          </IconButton>
          <IconButton color="primary">
            <MicNoneOutlined />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default Thread;
