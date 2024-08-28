import express from 'express';
import cors from 'cors';
import connectDB from './connectDB.js'
import dotenv from 'dotenv'
// const projectRoutes = require('./routes/projectRoutes')
// const taskRoutes = require('./routes/taskRoutes')
// const sprintRoutes = require('./routes/sprintRoutes')
// const teamRoutes = require('./routes/teamRoutes')
// const commentRoutes = require('./routes/commentRoutes')
// const userRoutes = require('./routes/userRoutes')


const app = express();
dotenv.config();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

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
