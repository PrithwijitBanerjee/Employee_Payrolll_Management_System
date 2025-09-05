const StatusCode = require("../responsecode/response").StatusCode;
const jwt = require("jsonwebtoken");

const verifyToken  = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            res.status(StatusCode.AUTH_ERROR).json({
                status: false,
                message: "Credential Not Found!",
            });
        } else {
            try {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decode;
                next();
            } catch (error) {
                console.log(error)
                res.status(StatusCode.TOKEN_EXPIRE).json({
                    status: false,
                    message: "Token Expired!",
                    error
                });
            }
        }

    } catch (error) {
        res.status(StatusCode.SERVER_ERROR).json({
            status: false,
            message: "Server Error!",
            error
        });
    }
};
module.exports = verifyToken;