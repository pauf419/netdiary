const jwt = require('jsonwebtoken');
const pool = require("../db/pool")
const { v4 } = require('uuid');
const Response = require('../responses/response');
 
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await pool.query("SELECT * FROM jwt WHERE uid = $1", [userId]).then(data => data.rows[0])
        if (tokenData) {
            return await pool.query("UPDATE jwt SET refreshToken = $1 WHERE id = $2 RETURNING *", [refreshToken, tokenData.id]).then(data => data.rows[0])
        }
        const token = await pool.query("INSERT INTO jwt(uid, refreshToken, id) VALUES($1, $2, $3) RETURNING *", [userId, refreshToken, v4()])
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await pool.query("DELETE FROM jwt WHERE refreshToken = $1 RETURNING *", [refreshToken]).then(data => data.rows[0])
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await pool.query("SELECT * FROM jwt WHERE refreshToken = $1", [refreshToken]).then(data => data.rows[0])
        return tokenData;
    }
} 
 
module.exports = new TokenService();
