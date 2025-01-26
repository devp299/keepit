'use server';

import { ID, Models, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
// import { handleError } from "./users.actions";
import {InputFile} from "node-appwrite/file";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./users.actions";

// import { UploadFileProps } from "@/types";
const handleError = (error: unknown, message: string) => {
    console.error(error, message);
    throw error;
};

export const uploadFile = async({ file, ownerId, accountId, path} : UploadFileProps) => {
    const { storage,databases} = await createAdminClient();

    try {
        const inputFile = InputFile.fromBuffer(file,file.name);

        const bucketFile = await storage.createFile(appwriteConfig.bucketId,ID.unique(),inputFile);

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        }

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument,
        )
            .catch(async (error: unknown) => {
                await storage.deleteFile(appwriteConfig.bucketId,bucketFile.$id);
                handleError(error,"Failed to create file document")
            });

        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        handleError(error,"Failed to uplaod files")
    }
}

const createQueries = (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal('owner',[currentUser.$id]),
            Query.contains('users',[currentUser.email]),
        ]),
    ]

    return queries;
}

export const getFiles = async () => {
    const { databases } = await createAdminClient();
    
    try {
        const currentUser = await getCurrentUser();

        if(!currentUser) throw new Error("User not Found")

        const queries = createQueries(currentUser);

        // console.log({ currentUser,queries});

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        // console.log({ files });
        return parseStringify(files);

    } catch (error) {
        handleError(error, "Failed to get files");
    }
}

export const renameFile = async ({ fileId, name, extension, path } : RenameFileProps) => {
    const { databases } = await createAdminClient();
    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName,
            },
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error,"Failed to rename file")
    }
}