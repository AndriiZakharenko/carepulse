"use server";

import { ID, Query } from "node-appwrite";

import {
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newuser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("Error occurred while creating user:", error);
    throw error;
  }
};