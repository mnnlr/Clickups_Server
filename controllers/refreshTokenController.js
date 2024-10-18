import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const getRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.Token)
      return res
        .status(401)
        .json({ success: false, message: "Please Login to access" });

    const refreshToken = cookies.Token;
    console.log("this is refresh Token", refreshToken);
    const findUser = await UserModel.findOne({ refreshToken: refreshToken }).lean();
    console.log('this is user from regresh token', findUser);
    if (!findUser)
      return res
        .status(401)
        .json({ success: false, message: "please login to access" });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decodedUser) => {
      console.log('this is id from decode user in refrsh toioken controller', decodedUser);
      if (err || findUser?._id.toString() !== decodedUser?._id) {
        return res
          .status(401)
          .json({ success: false, message: "Please login to access" });
      }

      const accessToken = jwt.sign(
        { _id: findUser._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ ...findUser, accessToken });
    });
  } catch (err) {
    console.log("this is error", err);
    return res
      .status(500)
      .json({ message: "Error on Refresh Token", cause: err.message });
  }
};

export default getRefreshToken;
