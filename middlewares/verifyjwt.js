
import { verifyToken } from "../utils/jwt.js";
export default function verifyJwt(req,res,next){
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = verifyToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}