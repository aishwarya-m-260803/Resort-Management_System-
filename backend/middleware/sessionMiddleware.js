const sessionMiddleware = (req, res, next) => {
    // Check if user session exists
    if (!req.session || !req.session.user) {
        return res.status(401).json({ 
            message: "Authentication required. Please login to access this resource." 
        });
    }

    // Attach session user to req.user for consistency with JWT middleware
    req.user = req.session.user;
    next();
};

module.exports = sessionMiddleware;
