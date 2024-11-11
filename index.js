import express from 'express';
import cors from 'cors';
import connectDB from './database/connectDB.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './config/.env' });

app.use(cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URI],
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());

// -------------------import Routes-------------------------------

import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRouter from './routes/userRoutes.js';
import AthenticateRoute from './routes/AthenticateRoute.js';
import { server, app, } from './Socket/Socket.js';
import notificationRouter from './routes/notificationRoutes.js';
import dashboardRoute from './routes/dashboardRoute.js'
import refreshTokenRoute from './routes/refreshTokenRoute.js';
import logOutRoute from './routes/userRoutes.js';
import IndividualTaskRoute from './routes/IndividualRoute.js';
import workspceRouter from './routes/workspaceRoutes.js';
import documentRouter from './routes/documentRoutes.js';

app.use(refreshTokenRoute);

app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRouter);
app.use("/api/notification", notificationRouter);
app.use('/api/authenticate', AthenticateRoute);
app.use('/api/dashboards', dashboardRoute);
app.use('/api/project/individualTask', IndividualTaskRoute);
app.use('/api/workspce', workspceRouter);
app.use('/api/document', documentRouter);
app.use('/api', logOutRoute);



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
