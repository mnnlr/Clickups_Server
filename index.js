import express from 'express';
import cors from 'cors';
import connectDB from './database/connectDB.js'
import dotenv from 'dotenv';

const app = express();
dotenv.config({ path: './config/.env' });


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// -------------------import Routes-------------------------------

import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
//test