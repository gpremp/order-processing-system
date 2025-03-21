class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the parent Error class constructor
        this.statusCode = statusCode; // HTTP status code
        this.data = null; // Additional data (can be used for debugging or additional info)
        this.success = false; // Indicates failure
        this.errors = errors; // Array of errors (useful for validation errors)

        // Capture stack trace if not provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;