class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code
        this.data = data; // Response data
        this.message = message; // Response message
        this.success = statusCode < 400; // Determine success based on status code
    }
}

module.exports = ApiResponse;