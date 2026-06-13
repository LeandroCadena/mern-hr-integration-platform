const errorHandler = (error, req, res, next) => {
    console.error(error);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: error.message || "Internal Server Error",
    });
};

module.exports = {
    errorHandler,
};