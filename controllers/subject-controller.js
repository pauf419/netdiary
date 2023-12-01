const subjectService = require("../service/subject-service")
const logic = require("../utils/logic") 
const Response = require("../responses/response")

class SubjectController { 
    async createSubject(req, _, next) {
        try { 
            const payload = {
                title: req.body.title,
                description: req.body.description
            }

            if(logic.regexobject(payload)) throw Response.BadRequest()

            const subject = await subjectService.createSubject(payload.title, payload.description)
            return next(subject)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async removeSubject(req, _, next) {
        try { 
            const {id} = req.body
            if(!id || id.trim() === "") throw Response.BadRequest()
            const subject = await subjectService.removeSubject(id) 
            return next(subject)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async updateSubject(req, _, next) {
        try { 
            const payload = {
                title: req.body.title,
                description: req.body.description
            }
            if(logic.regexobject(payload)) throw Response.BadRequest()
            if(!req.body.id || req.body.id.trim() === "") throw Response.BadRequest()
            const subject = await subjectService.updateSubject(payload, req.body.id, req.files ? req.files.banner : null)
            return next(subject)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async getSubjects(req, _, next) {
        try { 

            const subjects = await subjectService.getSubjects(0, 10000)
            return next(subjects)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }
}

module.exports = new SubjectController()