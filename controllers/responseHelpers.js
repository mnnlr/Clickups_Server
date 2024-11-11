// Response helper functions
export const sendSuccessResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({ success: true, message, data });
};

export const sendErrorResponse = (res, statusCode, message, error) => {
    res.status(statusCode).json({ success: false, message, error });
};