// errorHandler.js
function errorHandler(err, req, res, next) {
    // Log the error for debugging purposes
    console.error(err);

    // Determine the status code
    const statusCode = err.statusCode || 500; // Defaults to 500 if not set

    // Send a generic message or a specific message if defined
    res.status(statusCode).json({
        error: {
            message: err.message || 'An unexpected error occurred.'
        }
    });
}

module.exports = errorHandler;
