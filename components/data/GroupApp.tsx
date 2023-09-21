import React, {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import firebaseApp from "../firebase";
import GroupList from "./GroupList";
import GroupChat from "./GroupChat";

function App() {
  const [user, setUser] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Group Messaging App</h1>
      {user ? (
        <div>
          <button onClick={() => auth.signOut()}>Sign Out</button>
          <GroupList user={user} />
          {selectedGroupId && (
            <GroupChat user={user} groupId={selectedGroupId} />
          )}
        </div>
      ) : (
        <p>Please sign in to use the app.</p>
      )}
    </div>
  );
}

export default App;
