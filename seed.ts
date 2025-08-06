import {doc, setDoc} from "firebase/firestore";
import {faker} from "@faker-js/faker";
import {createUserWithEmailAndPassword} from "firebase/auth";

import {auth, db} from "./firebase";

export const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Seeding users...");
    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const email = faker.internet.email({firstName, lastName}).toLowerCase();

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        `${firstName}${lastName}`
      );

      await setDoc(doc(db, "users", res.user.uid), {
        name: firstName + lastName,
        username: faker.internet.username({firstName, lastName}),
        bio: faker.lorem.sentence(),
        avatar:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
      });
    }
    console.log("Seeded users.");

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};
