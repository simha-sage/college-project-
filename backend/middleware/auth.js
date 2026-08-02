import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token = null;

  // 1. Cookie (React Web)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Authorization Header (React Native)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

export default auth;
