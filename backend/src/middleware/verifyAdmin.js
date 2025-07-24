import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  let token = req.cookies.admin_token;
  // Check Authorization header if cookie not found
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "No admin token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
