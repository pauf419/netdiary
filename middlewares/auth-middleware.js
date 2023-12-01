const Response = require("../responses/response")
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(Response.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(Response.Unauthorized());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(Response.Unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(Response.Unauthorized());
    }
};
