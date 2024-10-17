import UserModel from "../models/UserModel.js";

const authenticate = async (req, res) => {
    try {
        const { _id } = req.user;
        console.log('this is userid', req.user);
        const existingUser = await UserModel.findOne({ _id: _id });
        console.log('this is user', existingUser)
        if(!existingUser)return res.status(404).json({success: false, message: 'Invalid Username and Password'})
        return res.status(200).json({ sucess: true, Data: existingUser })
    } catch (err) {
        console.log('eer', err)
        return res.status(500).json({
            success: false, message: err.message
        })
    }
}

export default authenticate;