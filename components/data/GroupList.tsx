import React, {useEffect, useState} from "react";
import {db} from "../firebase"; // Import your Firebase configuration

function GroupList({user}) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Fetch a list of groups where the user is a member
    const unsubscribe = db
      .collection("groups")
      .where(`members.${user.uid}`, "==", true)
      .onSnapshot((snapshot) => {
        const groupData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupData);
      });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div>
      <h2>Your Groups:</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;
