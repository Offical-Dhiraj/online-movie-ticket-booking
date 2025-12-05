import { Inngest } from "inngest";
import User from "../models/User.js";
// Create a client to send and receive events

export const inngest = new Inngest({ id: "movie-ticket-booking" });

//inngest function to save user data to a database.

const syncUserCreation = inngest.createFunction(
  { id: "syn-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    //Store the user data in mongoDB database.
    await User.create(userData);
  }
);

//inngest functionm to delete the user data from database when user is deleted from clerk.

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findById(id);
  }
);


//inngest function to update user data in database.

const syncUserUpdate = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            image: image_url,
        };
        await User.findByIdAndUpdate(id, userData)
    }
)

export const functions = [syncUserCreation, syncUserDeletion,syncUserUpdate];
