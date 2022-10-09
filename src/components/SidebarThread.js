import React from "react";
import {Avatar} from "@material-ui/core";

import "./SidebarThread.css";

const SidebarThread = (props) => {
  console.log(props);
  return (
    <div>
      <div className="sidebarThread">
        <Avatar />
        <div className="sidebarThread__details">
          <h3>thread name</h3>
          <p>this is the message</p>
          <small className="sidebarThread__timestamp">timestamp</small>
        </div>
      </div>
    </div>
  );
};

export default SidebarThread;
