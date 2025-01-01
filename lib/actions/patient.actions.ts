"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
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
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: number }).code === 409
    ) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("Error occurred while creating user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  gender,
  ...patient
}: RegisterUserParams) => {
  try {
    let file = null;
    let identificationDocumentUrl = null;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("fileName") as string
      );

      try {
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        console.log("File uploaded successfully:", file);

        if (file?.$id) {
          identificationDocumentUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;
          console.log("Generated identification document URL:", identificationDocumentUrl);
        }
      } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload identification document.");
      }
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: identificationDocumentUrl || "",
        gender,
        ...patient,
      }
    );

    console.log("New patient created successfully:", newPatient);
    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};




// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
