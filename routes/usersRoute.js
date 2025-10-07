import express from "express";
import {registrationValidation} from "../middlewares/ValidationMiddleware.js"
import {createUser,loginUser,verifyUserMail} from "../controllers/usersController.js"
export const usersRouter = express.Router();
usersRouter.post("/",registrationValidation,createUser);//middleware for validation
usersRouter.post("/login",loginUser);
usersRouter.get("/verify/:token",verifyUserMail);