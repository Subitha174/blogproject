// // middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Protect middleware
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } catch (err) {
//       console.error("Auth middleware error:", err);
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Author-only middleware
// const authorOnly = (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: "Not authorized" });

//   if (req.user.role !== "author") {
//     return res.status(403).json({ message: "Author role required" });
//   }

//   next();
// };

// module.exports = { protect, authorOnly };


const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ✅ Protect middleware
const protect = async (req, res, next) => {

  try {

    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      return next(); // ✅ VERY IMPORTANT return

    }

    // No token
    return res.status(401).json({
      message: "No token, authorization denied"
    });

  } catch (error) {

    return res.status(401).json({
      message: "Not authorized, token failed"
    });

  }

};


// ✅ Author only middleware
const authorOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  if (req.user.role !== "author") {
    return res.status(403).json({
      message: "Authors only"
    });
  }

  return next(); // ✅ return added

};


module.exports = {
  protect,
  authorOnly
};