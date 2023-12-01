const Response = require("../responses/response")
const logic = require("../utils/logic")
const markService = require("../service/mark-service")

class MarkController {
    async getMarks(req, _, next) {
        try {
            const {
                time, 
                classroom
            } = req.query
            if(logic.regexobject({time, classroom})) throw Response.BadRequest("All fields must be completed")
            const response = await markService.getMarks(time, classroom) 
            return next(response)
        } catch(e) {
            console.error(e)
            return next(e)
        }
    }

    async createMark(req, _, next) {
        try {
            const {time, subject, classroom, refer, value, index} = req.body
            if(logic.regexobject({time, subject, classroom, refer, value})) throw Response.BadRequest("All fields must be completed")
            const response = await markService.createMark(time, classroom, subject, refer, value, index)
            return next(response)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }
}

module.exports = new MarkController()