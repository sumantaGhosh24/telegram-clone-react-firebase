import React, {useEffect, useState} from "react";
import {db} from "../firebase"; // Import your Firebase configuration
import {addUserToGroup, removeUserFromGroup} from "./groupFunctions"; // Import your group management functions

function GroupAdmin({user, groupId}) {
  const [groupInfo, setGroupInfo] = useState(null);
  const [newMemberId, setNewMemberId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch group information
    const unsubscribe = db
      .collection("groups")
      .doc(groupId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setGroupInfo(doc.data());
        }
      });

    return () => {
      unsubscribe();
    };
  }, [groupId]);

  const addMember = async () => {
    try {
      await addUserToGroup(groupId, newMemberId, isAdmin);
      setNewMemberId("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const removeMember = async (userId) => {
    try {
      await removeUserFromGroup(groupId, userId);
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div>
      {groupInfo && (
        <div>
          <h2>Group Admin: {groupInfo.name}</h2>
          <p>Admin: {groupInfo.adminId}</p>
          <h3>Members:</h3>
          <ul>
            {Object.entries(groupInfo.members).map(([userId, isAdmin]) => (
              <li key={userId}>
                {userId} (Admin: {isAdmin ? "Yes" : "No"}){" "}
                {user.uid === groupInfo.adminId && userId !== user.uid && (
                  <button onClick={() => removeMember(userId)}>Remove</button>
                )}
              </li>
            ))}
          </ul>
          {user.uid === groupInfo.adminId && (
            <div>
              <h3>Add Member:</h3>
              <input
                type="text"
                placeholder="User ID"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
              />
              <label>
                Admin:
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                />
              </label>
              <button onClick={addMember}>Add Member</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupAdmin;
