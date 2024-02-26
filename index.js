import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db.js";
import { authRouter } from "./router/user.js";

//ENV configuration
dotenv.config();

//middlewares
let app = express();
let PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

//dbConnection
dbConnection();

app.use("/api/auth", authRouter);

//Server Connection
app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
