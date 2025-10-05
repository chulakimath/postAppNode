import express from "express";
import {createUser,loginUser} from "../controllers/usersController.js"
export const usersRouter = express.Router();
usersRouter.post("/",createUser)
usersRouter.post("/login",loginUser)
