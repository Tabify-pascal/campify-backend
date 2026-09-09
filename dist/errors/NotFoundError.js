export class NotFoundError extends Error {
    statusCode = 404;
    constructor(resource) {
        super(`${resource} not found`);
        this.name = "NotFoundError";
    }
}
//# sourceMappingURL=NotFoundError.js.map