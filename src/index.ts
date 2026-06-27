import express, { Application } from "express";
import dotenv from "dotenv";
import passport from "passport";
import router from "./routes";
import { ErrorHandlerMiddleware } from "./middlewares";
import path from "path";
import cors from "cors";
import "./config/passport";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

let PORT = process.env.APP_PORT || 9000
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});