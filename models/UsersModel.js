import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.PGSQL_URL);
export const createConnection = async () => {
    return await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            mobile VARCHAR(15) DEFAULT 'xxxxxxxxxxxxxxx',
            password VARCHAR(255) NOT NULL,
            isMailVerified INT DEFAULT 0,
            role INT DEFAULT 1
        ) 
    `;
};

const Create = async (user) => {
    try {
        const { name, email, mobile, password } = user;
        return await sql`
        INSERT INTO users(name,email,mobile,password)
        VALUES(${name},${email},${mobile},${password})  
        RETURNING *;
        `
    } catch (error) {
        console.log("Error - ", "UsersModel - ", "Create - ", error)
    }
}
const getUserByEmail = async (email) => {
    try {
        return await sql`SELECT * FROM users WHERE email=${email}`;
    } catch (error) {
        console.log("Error - getUserByEmail - ", error);
    }
}
const verifyUser = async (id) => {
    try {
        return await sql`UPDATE users SET ismailverified = 1 WHERE id = ${id}`;
    } catch (error) {
        console.log("Error - usersModel - verifyUser - ", error)
    }
}
export default {
    Create,
    getUserByEmail,
    verifyUser
}