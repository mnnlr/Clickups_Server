const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mnnlrceo:5FQMYdj5qbHeTA2r@cluster0.cl0gjkq.mongodb.net/mnnlr-clickups');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;