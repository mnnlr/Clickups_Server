const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
require('dotenv').config();
const projectRoutes = require('./routes/projectRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/projects',projectRoutes)

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
