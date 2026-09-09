import {} from "express";
import {} from "../types/user.js";
export function assertAuthenticated(req) {
    if (!req.auth) {
        throw new Error("Authentication middleware missing");
    }
}
//# sourceMappingURL=assertAuthenticated.js.map