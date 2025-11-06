import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(401).json({ success: false, message: "No token provided" })
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.id) {
            req.userId = decoded.id;
            next()
        }
        else {
            return res.json({ success: false, message: "Invalid Token" })
        }
    }
    catch (error) {
        res.status(401).json({ success: true, message: "Invalid or expired token", error: error.message });
    }
}