import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
// import nodemailer from 'nodemailer'
import { transporter } from '../utils/nodedemailer.js';
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
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
      { email },
      { refreshToken: RefreshToken },
      { new: true }
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

const HandleForgotPassword=async(req,res)=>{
          const {email}=req.body
          

          if(!email){
           return  res.status(401).json({success:false, message:"Email is Required"})
          }
          const user=await UserModel.findOne({email});
          if(!user){
            return res.status(401).json({success:false, message:"User Not Found"})
          }
           
          const token= jwt.sign({id:user._id},process.env.ACCESS_TOKEN,{expiresIn:'5m'});
          const resetLink = `${process.env.CLIENT_URI}/reset-password/${token}`;
         await transporter.sendMail(
            {
              to:email,
              subject:"Password Reset",
              text:`Click here to reset password ${resetLink}`
            }
          )
          // res.send("Password reset link sent to your email");

          return res.status(200).json({success:true,message:"Reset Link Send Successfully"})
          
          

        }

        const handleUpdatePassword = async (req, res) => {
          try {
            const { token } = req.params;
            const { Password, ConfirmPassword } = req.body;
        
            if (!Password || !ConfirmPassword) {
              return res.status(400).json({ success: false, message: "Both password fields are required." });
            }
        
            if (Password !== ConfirmPassword) {
              return res.status(400).json({ success: false, message: "Passwords do not match." });
            }
        
            let decoded;
            try {
              decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            } catch (err) {
              return res.status(401).json({ success: false, message: "Invalid or expired token." });
            }
        
            // Find the user by ID from the token payload
            const user = await UserModel.findById(decoded.id);
            if (!user) {
              return res.status(404).json({ success: false, message: "User not found." });
            }
        
            user.password = Password;
            await user.save();
        
            return res.status(200).json({ success: true, message: "Password updated successfully." });
          } catch (error) {
            console.error("Error updating password:", error);
        
            return res.status(500).json({ success: false, message: "An error occurred while updating the password. Please try again." });
          }
        };
        

        

export {
  handleUserLogin,
  handleUserSignUp,
  getAllUsers, LogoutUser,
  HandleForgotPassword,
  handleUpdatePassword,
}
