import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({success: false, message: "Email and password are required" });
    }
  
    const user = await UserModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    
      if (!user || !isMatch) {
        return res.status(401).json({success: false, message: "Invalid email or password" });
      }

      const { password: _, refreshToken, ...rest } = user._doc;

      const payload = {
          _id: user._id,
      };
      const AccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });

      console.log('this is accessToken ', AccessToken);
      const RefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
        expiresIn: "15d",
      })
      console.log(RefreshToken);
       
      await UserModel.findOneAndUpdate(
        {email},
        {refreshToken: RefreshToken},
        {new: true}
      )

      const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        httpOnly: true,
        secure: true,
      };
      return res.cookie("Token", RefreshToken, cookieOptions).status(200).json({
        success: true,
        message: `${user?.name} Logged In Successful`,
        Data: {
          ...rest,
          accessToken: AccessToken,
        },
      });
    } catch (err) {
      console.log("this is err", err);
      res.status(500).json({ success: "false", message: `Error on login user ${err}` });
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

  const LogoutUser = (req, res) => {
    return res
      .clearCookie("Token").status(200).json
      ({ success: true, message: "Logout Successfully" });
  };

const getAllUsers = async (req, res) => {
    const users = await UserModel.find();
    return res.status(200).json({ users });
}


export {
    handleUserLogin,
    handleUserSignUp,
    getAllUsers, LogoutUser,
}
