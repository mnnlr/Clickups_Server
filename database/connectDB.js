import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected with server : ${data.connection.host}`);
    } catch (err) {
        console.log(`Error while connecting with database`, err.message);
    }
};

export default connectDB;