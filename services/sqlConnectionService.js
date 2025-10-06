import { createConnection } from "../models/UsersModel.js";
import { createPostTable } from "../models/PostsModel.js";

export const establishConnection = async () => {
    try {
        return await Promise.all([
            createConnection(),
            createPostTable()
        ]);

    } catch (err) {
        console.error("Error creating tables:", err);
        throw err;
    }
};
