import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await UserModel.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);

  try {
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
    jwt.sign(payload, process.env.KEY, { expiresIn: "7d" }, (err, token) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Spmthing wrong in jwt" });
      } else {
        return res.status(200).json({
          message: "User logged in successfully",
          token: token,
        });
      }
    });
  } catch (err) {
    console.log("this is err", err);
    res.status(500).json({status: 'false', message: err, });
  }
};

const handleUserSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, Email and password are required" });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "true", message: "Email is already registered" });
    }
    const newUser = await UserModel.create({ name, email, password });
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong when signing up" });
  }
};

export { handleUserLogin, handleUserSignUp };
