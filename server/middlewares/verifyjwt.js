import { verifyToken } from "../utilies/jwt.js";
export default function verifyJwt(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
  }
}
