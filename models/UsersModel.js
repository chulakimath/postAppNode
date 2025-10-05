import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.PGSQL_URL);
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
const getUserByEmail=async (email)=>{
    try {
        return await sql `SELECT * FROM users WHERE email=${email}`;
    } catch (error) {
        console.log("Error - getUserByEmail - ",error);
    }
}
export default {
    Create,
    getUserByEmail
}