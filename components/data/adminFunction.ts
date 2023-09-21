import {db} from "../firebase";

// Add a user to a group
export const addUserToGroup = async (groupId, userId, isAdmin) => {
  try {
    const groupRef = db.collection("groups").doc(groupId);

    // Add the user to the members collection
    await groupRef.collection("members").doc(userId).set({isAdmin});

    // Optionally, update the admin list if the user is an admin
    if (isAdmin) {
      await groupRef.collection("admins").doc(userId).set({isAdmin});
    }
  } catch (error) {
    console.error("Error adding user to group:", error);
    throw error;
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (groupId, userId) => {
  try {
    const groupRef = db.collection("groups").doc(groupId);

    // Remove the user from the members collection
    await groupRef.collection("members").doc(userId).delete();

    // Optionally, remove the user from the admin list
    await groupRef.collection("admins").doc(userId).delete();
  } catch (error) {
    console.error("Error removing user from group:", error);
    throw error;
  }
};
