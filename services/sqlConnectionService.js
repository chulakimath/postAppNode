import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.PGSQL_URL);

export const createConnection = async () => {
    return await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            mobile VARCHAR(15) DEFAULT 'xxxxxxxxxxxxxxx',
            password VARCHAR(255) NOT NULL,
            role INT DEFAULT 1
        )
    `;
};
