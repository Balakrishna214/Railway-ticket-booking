const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  //console.log("autMiddle ware ");
    try {
      // Get the token from cookies instead of the Authorization header
      //console.log(req.cookies);
      
      const token = req.cookies.token; // Ensure you have `cookie-parser` installed
       
     //console.log("autMiddle ware ");
      //console.log(token);
      
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, "secretkey");
      const user = await User.findById(decoded.userId);
      console.log(user);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      // Attach the user to the request object
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
const adminMiddleware = async (req, res, next) => {
  try {
   // console.log(req.user);
    
    console.log(req.user.name.role)
    if (req.user.role !== "admin") {w
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    next();
  } catch (err) {
    console.log(err.message);
    
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { authMiddleware, adminMiddleware };