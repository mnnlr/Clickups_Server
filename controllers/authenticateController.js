import UserModel from "../models/UserModel.js";

const authenticate = async (req, res) => {
    try {
        const { id } = req.user;
        const existingUser = await UserModel.findOne({ _id: id });
        console.log('this is user', existingUser)
        return res.status(200).json({ sucess: true, Data: existingUser })
    } catch (err) {
        console.log('eer', err)
        return res.status(500).json({
            sucess: false, message: err.message
        })
    }
}

export default authenticate;