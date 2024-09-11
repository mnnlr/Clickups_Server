import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // const token =
    //   req.headers.authorization && req.headers.authorization.split(" ")[1];
      const token = req.cookies.tokenData
      console.log('token is----->', token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded.user;
    // console.log("User is authenticated.");
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default isAuthenticated;
