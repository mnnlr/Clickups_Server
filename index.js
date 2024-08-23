const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
