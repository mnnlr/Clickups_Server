import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    console.log('this is authHeader---->', authHeader);
    if(!authHeader) return res.status(401).json({success: false, message: 'Please Login to access'});

    const token = authHeader.split(' ')[1];

    console.log('token is----->', token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please Login to access" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log('this is decoded', decoded);
    const {_id} = decoded;
    req.user = { _id };
    // console.log("User is authenticated.");
    next();
  } catch (err) {
    console.log('this is errror from isauthenticate', err);
    return res.status(403).json({ message: "Token is not valid" });
  }
};

export default isAuthenticated;
