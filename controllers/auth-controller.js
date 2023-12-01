const authService = require('../service/auth-service');
const {validationResult} = require('express-validator');
const Response = require("../responses/response")
const logic = require("../utils/logic")

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw Response.BadRequest("Expected data not validated")
            const {email, password, username} = req.body;
            if(logic.regexobject({email, password, username})) throw Response.BadRequest("Expected data not validated")
            const data = await authService.registration(email, password, username);
            return next(Response.OK(data, "Registration session successfully initialized"))
        } catch (e) { 
            console.error(e)
            return next(e) 
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            if(logic.regexobject({email, password})) throw Response.BadRequest("Expected data not validated")
            const userData = await authService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return next(Response.OK(userData, "Successfully logged in"))
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return next(Response.OK(token, "Successfully logged out"));
        } catch (e) {
            console.error(e)
            return next(e) 
        }
    }

    async verify(req, res, next) {
        try {
            const {
                id, 
                code
            } = req.body 
            if(logic.regexobject({id, code})) throw Response.BadRequest("Expected data not validated")
            const userData = await authService.verify(id, code);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return next(Response.OK(userData, "Email successfully verified. [RegSession] closed"))
        } catch (e) {
            console.error(e)
            return next(e) 
        }
    }

    async destroyRegSession(req, _, next) {
        try {
            const {id} = req.body 
            if(!id || id.trim() === "") throw Response.BadRequest("Expected data not validated")
            const response = await authService.destroyRegsession(id) 
            return next(Response.OK(response, "[RegSession] destroyed successfully"))
        } catch(e) {
            console.error(e) 
            return next(Response.BadRequestPayload({success: false}, "Failed to destroy [RegSession]"))
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            
            
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return next(Response.OK(userData, "Session successfully refreshed"))
        } catch (e) {
            console.error(e)
            return next(e) 
        }
    }
}


module.exports = new AuthController();
