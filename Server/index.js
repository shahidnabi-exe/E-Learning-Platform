import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./database/db.js";
import path from 'path';


const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use("/uploads", express.static("uploads")); // to serve static files from the uploads directory


// importing routes 
import userRoutes from "./routes/user.js";
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import cors from 'cors'
//middleware
app.use(express.json()); // to parse JSON bodies
app.use(cors()); // used for cross request, helps in frontend to fetch backend api

// using routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
})
