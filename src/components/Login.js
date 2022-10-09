import React from "react";
import {Button} from "@material-ui/core";

import "./Login.css";
import {auth, provider} from "../firebase";

const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__telegram">
        <img src="/user-placeholder.png" alt="user" />
        <h1>Telegram</h1>
      </div>
      <Button onClick={signIn}>Sign In</Button>
    </div>
  );
};

export default Login;
