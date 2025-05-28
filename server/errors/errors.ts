
/**
 * Server error is an error which will be thrown be the middleware in case of an error.
 */
export class ServerError extends Error {
    status: number;
    errors?: Record<string, unknown>; // Strict type for errors

    constructor(message: string, status = 500, errors?: Record<string, unknown>) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ServerError.prototype); // Ensures instanceof works
    }
}