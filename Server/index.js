import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('hello world');
})

// importing routes 
import userRoutes from "./routes/user.js";

//middleware
app.use(express.json()); // to parse JSON bodies

// using routes
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
})
