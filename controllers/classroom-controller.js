const classroomService = require("../service/classroom-service")
const logic = require("../utils/logic")
const Response = require("../responses/response")

class ClassroomController { 
    async createClassroom(req, _, next) {
        try { 
            const payload =  {
                level: req.body.level,
                prefix: req.body.prefix,
                title: req.body.title
            }
            if(logic.regexobject(payload)) throw Response.BadRequest("All fields must be completed")

            const classroom = await classroomService.createClassroom(payload.level, payload.prefix, payload.title)
            return next(classroom)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }
    
    async getClassroom(req, res, next) {
        try { 
            const {id} = req.query
            if(!id||id.trim()==="") throw Response.BadRequest()

            const classroom = await classroomService.getClassroom(id)
            return next(classroom)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async getClassroomParticipants(req, res, next) {
        const {id} = req.query 
        if(!id||id.trim() === "") throw Response.BadRequest()

        const participants = await classroomService.getClassroomParticipants(id)
        return next(participants)
    }

    async getClassrooms(req, res, next) {
        try {
            const classrooms = await classroomService.getClassrooms(0, 100000)
            return next(classrooms)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async removeClassroom(req, _, next) {
        try {
            const {id} = req.body 
            if(!id || id.trim() === "") throw Response.BadRequest("Id is required")
            const classroom = await classroomService.removeClassroom(id)
            return next(classroom)
        } catch(e) {
            console.error(e)
            return next(e)
        }
    }

    async updateClassroom(req, res, next) {
        try { 
            const {title, prefix, level, id} = req.body
            if(logic.regexobject({title, prefix, level, id})) throw Response.BadRequest("All fields must be completed")
            const values = logic.generateSQLUpdateValues(req.body, [
                "level",
                "prefix",
                "title"
            ])
            if(!req.body.id || req.body.id.trim() === "") throw Response.BadRequest()
            const classroom = await classroomService.updateClassroom(values, req.body.id)
            return next(classroom)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }
}

module.exports = new ClassroomController()