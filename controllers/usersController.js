import UserModel from "../models/UsersModel.js";
import { createPassword, matchPassword } from "../services/PasswordService.js";
import { CreateToken, checkToken } from "../services/AuthService.js";

export const createUser = async (req, res) => {
    let { name, email, mobile, password } = req.body || {};
    name = (name || '').trim();
    email = (email || '').trim();
    mobile = (mobile || '').trim();
    password = (password || '').trim();
    if (!email || !name || !mobile || !password) {
        return res.status(200).json({ "Error": "All Fields Are required - Missing Info" });
    }
    try {
        const hashPassword = await createPassword(password);
        const createdUser = await UserModel.Create({ name, email, mobile, "password": hashPassword });
        if (createUser) {
            return res.status(201).json({ "message": "User Created", "data": createdUser });
        }
    } catch (error) {
        console.log("Error - usersController - createUser", error)
        return res.status(500).json({ "error": "Something Went Wrong" })
    }
}
export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body || {};
        if (!email, !password) {
            return res.status(401).json({ "error": "Missing Info - Email/Password Missing" });
        }
        const user = await UserModel.getUserByEmail(email);
        if (!user.length) {
            res.status(400).json({ "error": "Invalid Email - User Dosen't Exists " });
        }
        const userPassword = user[0]['password'];
        const isPasswordMatch = matchPassword(password, userPassword)
        if (isPasswordMatch) {
            const token = await CreateToken(user);
            return res.status(200).json({ "message": "Login successful", "_token": token });
        }
        return res.status(400).json({ "error": "Password Not matching" })
    } catch (error) {
        console.log("Error - usersController - loginUser - ", error);
        return res.status(500).json({ "error": "Something Went Wrong" })
    }
}
export const checkTokenSoft = async (req, res, next) => {
    const requestHeader = req.headers['authorization'] || "";
    if (requestHeader) {
        try {
            const token = requestHeader.split(' ')[1]
            const decodedToken = await checkToken(token);
            req.user = decodedToken;
        } catch (error) {
            console.log("Warnig - usersController - checkSoftToken", error);
        }
    }
    next();
}
export const checkTokenHard = async (req, res, next) => {
    const requestHeader = req.headers['authorization'] || "";
    if (!requestHeader) {
        return res.status(401).json({ "error": "Please Login - Missing Token" });
    }
    try {
        const token = requestHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: "Token not provided properly" });
        }
        const decodedToken = await checkToken(token);
        if (!decodedToken) {
            return res.status(401).json({ "error": "Invalid Token" });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log("Warnig - usersController - checkHardToken", error);
        return res.status(401).json({ "error": "Invalid Token" });
    }
}