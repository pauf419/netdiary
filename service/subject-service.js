const pool = require("../db/pool")
const Response = require("../responses/response")
const {v4} = require("uuid")
const logic = require("../utils/logic") 
const fileService = require("./file-service")
const jdenticon = require("jdenticon")
const rid = require("random-id")
const SubjectDto = require("../dtos/subject-dto")
const tokenService = require("./token-service")

class SubjectService {
    async createSubject(title, description) {
        const similar = await pool.query("SELECT * FROM subject WHERE title = $1", [title]).then(data => data.rows[0])
        if(similar) throw Response.BadRequest("Subject with similar name already exists.")
        
        const subject = await pool.query("INSERT INTO subject(title, description, id, banner) VALUES($1, $2, $3, $4) RETURNING *", [
            title,
            description,
            v4(),
            fileService.saveFileBuf(jdenticon.toPng(rid(10, 'aA0'), 500, {
                padding: 0
            }))
        ]).then(data => data.rows[0])
        if(!subject) return Response.OK()
        return Response.OK(new SubjectDto(subject))
    }

    async removeSubject(id) {
        const subject = await pool.query("DELETE FROM subject WHERE id = $1 RETURNING *", [id]).then(data => data.rows[0])
        await pool.query("DELETE FROM schedulesubject WHERE subject = $1", [id])
        await pool.query("DELETE FROM mark WHERE subject = $1", [id])
        if(!subject) return Response.OK()
        return Response.OK(new SubjectDto(subject))
    }

    async updateSubject(body, id, banner) {
        
        if(banner)  banner = fileService.saveFile(banner)
        const OKVs = logic.generateSQLUpdateValues({...body, banner}, [
            "title",
            "description",
            "banner"
        ])
        const {script, vars} = logic.generateSQLUpdateScript("subject", OKVs, id)
        const subject = await pool.query(script, vars).then(data => data.rows[0])
        if(!subject) return Response.OK()
        return Response.OK(new SubjectDto(subject))
    }

    async getSubject(id) {
        const subject = await pool.query("SELECT * FROM subject WHERE id = $1", [id]).then(data=>data.rows[0])
        if(!subject) throw Response.BadRequest("Undefined subjectid")
        return new SubjectDto(subject)
    }

    async getSubjects(offset, limit) {
        const subjects = await pool.query("SELECT * FROM subject OFFSET $1 LIMIT $2", [offset, limit]).then(data => data.rows)
        return Response.OK(subjects.map(el => new SubjectDto(el)))
    }
}
 
module.exports = new SubjectService()