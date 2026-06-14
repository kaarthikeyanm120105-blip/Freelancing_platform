import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import http from 'http';
import { initializeSocket } from './socket/socketServer.js';
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";


const app = express();
const port = process.env.PORT || 4000;

app.use(cors(
    {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/submissions", submissionRoutes);


