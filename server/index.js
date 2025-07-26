import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import resultRouter from "./routes/result.routes.js";
import { facultyRouter } from "./routes/faculty.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { adminRouter } from "./routes/admin.routes.js";


const app = express()


//middlewares
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
console.log(process.env.FRONTEND_URL)
app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
    res.send("API Running");
});


//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/result", resultRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);

//connection to the mongo db and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening at port ${PORT}: http://localhost:${PORT}`);
    })
})

