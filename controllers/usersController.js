import UserModel from "../models/UsersModel.js";
import { createPassword, matchPassword } from "../services/PasswordService.js";
import { CreateToken, checkToken,CreateTokenTemp } from "../services/AuthService.js";
import { sendMail } from "../services/MailService.js";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

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

        if (createdUser) {
            await sendVserficationLink(createdUser[0]);
            return res.status(201).json({ "message": "User Created", "data": createdUser });
        }
    } catch (error) {
        console.log("Error - usersController - createUser", error)
        return res.status(500).json({ "error": "Something Went Wrong" })
    }
}
export const sendVserficationLink = async (user) => {
    const token = await CreateTokenTemp(user);
    const body = `<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Account Verification</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST0XLlx4Nnx5_tLnQshaJ9WtmMhEasXVWkJbBPaxW3r2GrqXdOyLvkGeT-Y07D0wOImn4&usqp=CAU" 
                                alt="Company Logo" 
                                height="100px" 
                                width="100px"
                                style="border-radius: 10px;">
                        </div>
                        <h1 style="text-align: center; color: #4CAF50;">Welcome!</h1>
                        <p>Dear User,</p>
                        <p>Thank you for creating an account with us. To complete your registration, please verify your email address by clicking the button below:</p>

                        <!-- Verify Button -->
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${SERVER_ADDRESS}/${token}" 
                            style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
                            Verify Your Account
                            </a>
                        </div>
                        <p>If you did not create this account, please disregard this message.</p>

                        <p>Best regards,<br>
                        The Santosh Company</p>

                    </body>
                    </html>
                `;
    return await sendMail(user.email, "Account Created successfully", body)
}
export const verifyUserMail = async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const decodedToken = await checkToken(token);
    if (decodedToken) {
        const userId = decodedToken.id;
        const isEmailVerified = await UserModel.verifyUser(userId)
        if(isEmailVerified){
            return res.status(200).json({"message":"User verified"});
        }
        return res.status(400).json({"error":"Something Went Wrong"});
    }
    return res.status(200).json({ decodedToken })
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
