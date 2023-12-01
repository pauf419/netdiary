const logic = require("../utils/logic") 
const Response = require("../responses/response")
const scheduleService = require("../service/schedule-service")

class ScheduleContoller {
    async createScheduleSubject(req, _, next) {
        try {
            const {classroom, subject, index, day, time, description} = req.body
            if(logic.regexobject({classroom, subject, index, day, time, description})) throw Response.BadRequest()
            const scheduleSubject = await scheduleService.createScheduleSubject(classroom, subject, index, day, time, description)
            return next(scheduleSubject)
        } catch(e) {
            console.error(e)
            return next(e)
        }
    }

    async removeScheduleSubject(req, _, next) { 
        try {
            const {id} = req.body
            if(!id || id.trim() === "") throw Response.BadRequest()
            const scheduleSubject = await scheduleService.deleteScheduleSubject(id)
            return next(scheduleSubject)
        } catch(e) {
            console.error(e)
            return next(e)
        }
    }

    async getScheduleSubjects(req, _, next) {
        try {
            const {classroom} = req.query 
            if(!classroom || classroom.trim() === "") throw Response.BadRequest()
            const scheduleSubjects = await scheduleService.getScheduleSubjects(classroom)
            return next(scheduleSubjects)
        } catch(e) {
            console.error(e)
            return next(e)
        }
    }
}

module.exports = new ScheduleContoller()