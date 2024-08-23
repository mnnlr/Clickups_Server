const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


mongoose.connect(process.env.mongoDb).then(() => {
    console.log("MongoDB connected.");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
