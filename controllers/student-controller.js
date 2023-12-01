const logic = require("../utils/logic") 
const Response = require("../responses/response")
const studentService = require("../service/student-service")

class StudentController {
    async createStudent(req, _, next) {
        try { 
            const {userid, firstname, lastname, classroom} = req.body
            if(logic.regexobject({userid, firstname, lastname, classroom})) throw Response.BadRequest()

            const student = await studentService.createStudent(userid, firstname, lastname, classroom)
            return next(student)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async removeStudent(req, _, next) {
        try { 
            const {id} = req.body
            if(!id || id.trim() === "") throw Response.BadRequest()

            const student = await studentService.removeStudent(id)
            return next(student)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async updateStudent(req, _, next) {
        try {
            const values = logic.generateSQLUpdateValues(req.body, [
                "classroom",
                "userid",
                "firstname",
                "lastname"
            ])
            if(!req.body.id || req.body.id.trim() === "") throw Response.BadRequest()
            const student = await studentService.updateStudent(values, req.body.id)
            return next(student)
        } catch(e) {
            console.error(e) 
            return next(e)
        }

    }

    async getStudents(req, _, next) {
        try {
            const {offset, limit} = req.query
            if(logic.regexobject({offset, limit})) throw Response.BadRequest()

            const students = await studentService.getStudents(offset, limit)
            return next(students)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }
}

module.exports = new StudentController()