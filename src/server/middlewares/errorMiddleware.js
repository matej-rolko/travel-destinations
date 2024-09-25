
export const errorMiddleware = async (err, _req, res, _next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`Error: ${message}, Status: ${statusCode}`);

    res.status(statusCode).json({
        success: false,
        message: message,
        error: err.stack // should display stack only if in dev env
    });

}