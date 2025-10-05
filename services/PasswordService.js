import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export const createPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }
    catch (error) {
        console.log("Error - PasswordService - CreatePassword", error);
    }
};
export const matchPassword = async(userPassword,dbPassword)=>{
    try {
        return await bcrypt.compare(userPassword,dbPassword)
    } catch (error) {
        console.log("Error - PasswordService - matchPassword",error);
    }
}