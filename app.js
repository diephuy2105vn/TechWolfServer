import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import appRouter from "./src/routes/index";
import connectMongodb from "./src/config/db/mongodb";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import firebase from "./src/config/db/firebase";
dotenv.config();
//Kết nối mongodb
connectMongodb();
firebase.firestore();

const app = express();

app.use(cookieParser());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        origin: [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "http://localhost:8081",
            "http://192.168.1.72:8081",
            "http://192.168.0.115:3000",
            "http://172.20.10.3:8081",
            "http://10.13.130.154:8081",
        ], // chỉ cho phép truy cập từ domain này []
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // chỉ cho phép sử dụng các phương thức này
        // allowedHeaders: ["Content-Type"], // chỉ cho phép sử dụng các header này
    })
);
appRouter(app);
export default app;
