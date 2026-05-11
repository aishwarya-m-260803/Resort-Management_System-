const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.warn("Admin access denied: No Authorization header provided.");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract token handling both "Bearer <token>" and raw token formats
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log decoded user for debugging as requested by the user
        console.log("DEBUG - Admin Middleware Decoded User:", decoded);

        if (decoded.role !== "admin") {
            console.warn(`Admin access denied: User ID ${decoded.id} has role ${decoded.role}`);
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Admin middleware token verification failed:", error.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = adminMiddleware;
