import express from "express";
import {createUser,loginUser,verifyUserMail} from "../controllers/usersController.js"
export const usersRouter = express.Router();
usersRouter.post("/",createUser)
usersRouter.post("/login",loginUser)
usersRouter.get("/verify/:token",verifyUserMail)