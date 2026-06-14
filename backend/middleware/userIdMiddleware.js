import jwt from "jsonwebtoken";

const userIdMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

export default userIdMiddleware;

