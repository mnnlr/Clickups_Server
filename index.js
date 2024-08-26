const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
require('dotenv').config();
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const sprintRoutes = require('./routes/sprintRoutes')
const teamRoutes = require('./routes/teamRoutes')
const commentRoutes = require('./routes/commentRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow credentials
}));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
