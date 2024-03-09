import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, re, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, "joiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwOTYzNjMwNCwiaWF0IjoxNzA5NjM2MzA0fQ");

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
