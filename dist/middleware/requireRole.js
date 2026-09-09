import {} from "express";
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.auth) {
            res.status(401).json({
                error: "Unauthorized",
            });
            return;
        }
        if (req.auth.role !== role) {
            res.status(403).json({
                error: "Forbidden",
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=requireRole.js.map