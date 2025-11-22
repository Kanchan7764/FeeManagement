import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectToDB from "./db/db.js";
import authRouter from "./routes/auth.js";
import classRoute from "./routes/class.js";
import studentRoute from "./routes/student.js";
import feeRoute from "./routes/fee.js";
import paymentRoute from "./routes/payment.js";
import settingRoute from "./routes/setting.js";
import dashboardRoute from "./routes/dashboard.js";
import teacherRoute from './routes/teacher.js'
import subjectRoute from'./routes/subject.js'
import examRoute from'./routes/exam.js'
import marksRoutes from "./routes/mark.js";


dotenv.config();
connectToDB();

const app = express();

// ✅ CORS setup (important for cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true, // allow sending cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ Parse JWT cookies
app.use(express.static("public/uploads"));

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", dashboardRoute);
app.use("/api/class", classRoute);
app.use("/api/setting", settingRoute);
app.use("/api/student", studentRoute);
app.use("/api/fee", feeRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/subject", subjectRoute);

app.use("/api/teacher", teacherRoute);
app.use("/api/exam", examRoute);
app.use("/api/marks", marksRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
