import freelancerModel from "../models/freelancerSchema.js";
import clientModel from "../models/clientSchema.js";

const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Check if user exists and is an admin in either collection
        const user = await freelancerModel.findById(userId) || await clientModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admin only." });
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export default adminMiddleware;
