import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.PGSQL_URL);

export const createPostTable = async () => {
    return await sql`
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            subject VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            startDate DATE NOT NULL,
            endDate DATE NOT NULL,
            createdBy INT NOT NULL,
            createdAt Timestamp NOT NULL DEFAULT NOW()
       ) 
    `;
};