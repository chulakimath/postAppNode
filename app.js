import express, { json } from "express";
import {establishConnection} from "./services/sqlConnectionService.js";
import { usersRouter } from "./routes/usersRoute.js";
const app = express();
const PORT=process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:"false"}));
app.use("/api/users",usersRouter)
app.get('/',(req,res)=>{
    return res.status(200).json({"status":"success"}); 
})
establishConnection().then(()=>{
    console.log("PGSQL Connection success")
    app.listen(PORT,()=>{
        console.log(`http://127.0.0.1:${PORT}`);
    });
})