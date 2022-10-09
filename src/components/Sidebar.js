import React, {useState, useEffect} from "react";
import {
  BorderColorOutlined,
  PhoneOutlined,
  QuestionAnswerOutlined,
  Search,
  SettingsOutlined,
} from "@material-ui/icons";
import {Avatar, IconButton} from "@material-ui/core";
import {useSelector} from "react-redux";

import "./Sidebar.css";
import SidebarThread from "./SidebarThread";
import db, {auth} from "../firebase";
import {selectUser} from "../features/userSlice";

const Sidebar = () => {
  const [thread, setThread] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    db.collection("threads").onSnapshot((snapshot) =>
      setThread(snapshot.docs.map((doc) => ({id: doc.id, data: doc.data})))
    );
  }, []);

  const addThread = () => {
    const threadName = prompt("enter thread name");
    if (threadName) {
      db.collection("threads").add({
        threadName: threadName,
      });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__search">
          <Search className="sidebar__searchIcon" />
          <input placeholder="search" className="sidebar__input" />
        </div>
        <IconButton id="sidebar__button" variant="outlined" onClick={addThread}>
          <BorderColorOutlined />
        </IconButton>
      </div>
      <div className="sidebar__threads">
        {thread.map(({id, data: {threadName}}) => (
          <SidebarThread key={id} id={id} threadName={threadName} />
        ))}
      </div>
      <div className="sidebar__bottom">
        <Avatar
          className="sidebar__bottom__avatar"
          onClick={() => auth.signOut()}
        />
        <IconButton>
          <PhoneOutlined />
        </IconButton>
        <IconButton>
          <QuestionAnswerOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
      </div>
    </div>
  );
};

export default Sidebar;
