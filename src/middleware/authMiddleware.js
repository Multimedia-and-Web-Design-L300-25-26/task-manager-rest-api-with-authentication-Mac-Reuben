import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header (Format: "Bearer <token>")
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, throw error to trigger catch block
    if (!token) {
      throw new Error();
    }

    // 2. Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user associated with the token's ID
    const user = await User.findOne({ _id: decoded._id });

    // If user doesn't exist (maybe deleted), throw error
    if (!user) {
      throw new Error();
    }

    // 4. Attach user to the request object so routes can access it
    req.user = user;

    // 5. Move to the next middleware/route handler
    next();

  } catch (error) {
    // 6. Handle errors (invalid token, missing token, user not found)
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export default authMiddleware;