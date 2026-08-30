import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./database/db.js";
import path from 'path';
import fs from 'fs';


const app = express();

const port = process.env.PORT;

// Multer writes directly into this folder and does NOT create it automatically —
// without this, course/lecture uploads fail with an unhelpful generic error.
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use('/uploads', express.static(uploadsDir));


// importing routes 
import userRoutes from "./routes/user.js";
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import instructorRoutes from './routes/instructor.js';
import commentRoutes from './routes/comment.js';
import noteRoutes from './routes/note.js';
import reviewRoutes from './routes/review.js';
import progressRoutes from './routes/progress.js';
import cors from 'cors'
//middleware
app.use(express.json()); // to parse JSON bodies
app.use(cors()); // used for cross request, helps in frontend to fetch backend api

// using routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);
app.use('/api', instructorRoutes);
app.use('/api', commentRoutes);
app.use('/api', noteRoutes);
app.use('/api', reviewRoutes);
app.use('/api', progressRoutes);

// Catch-all error handler — without this, errors thrown by middleware (e.g. multer)
// never reach a controller's try/catch and the frontend just sees a blank/HTML response.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong on the server" });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
})
