const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleUserLogin = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await UserModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
    } else {
        try {
            const payload = {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            }
            jwt.sign(payload, process.env.KEY, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ message: "Something went wrong when logging in" })
                } else {
                    return res.status(200).json({
                        message: "User logged in successfully",
                        token: token
                    });
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Something went wrong when logging in" })
        }
    }
}

const handleUserSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, Email and password are required" })
    }
    try {
        const newUser = await UserModel.create({ name, email, password });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something went wrong when signing up" })
    }
}

module.exports = {
    handleUserLogin,
    handleUserSignUp
}
