const pool = require("../db/pool")
const {v4} = require("uuid")
const Response = require("../responses/response")
const logic = require("../utils/logic")

class ClassroomService {
    async createClassroom(level, prefix, title) {
        const classroom = await pool.query("INSERT INTO classroom(level, prefix, title, id) VALUES($1, $2, $3, $4) RETURNING *", [level, prefix, title, v4()]).then(data => data.rows[0])
        return Response.OK({
            ...classroom, 
            participants: []
        })
    }   

    async getClassroom(id) {
        const classroom = await pool.query("SELECT * FROM classroom WHERE id = $1", [id]).then(data => data.rows[0])
        return Response.OK(classroom)
    }

    async getClassrooms(offset, limit) {
        const classrooms = await pool.query("SELECT * FROM classroom ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]).then(data => data.rows)
        return Response.OK(classrooms)
    }

    async removeClassroom(id) {
        const classroom = await pool.query("DELETE FROM classroom WHERE id = $1 RETURNING *", [id]).then(data => data.rows[0])
        await pool.query("DELETE FROM schedulesubject WHERE classroom = $1", [id]) 
        await pool.query("DELETE FROM mark WHERE classroom = $1", [id])
        return Response.OK(classroom)
    }
    
    async updateClassroom(OKVs, id) {
        const {script, vars} = logic.generateSQLUpdateScript("classroom", OKVs, id)
        const classroom = await pool.query(script, vars).then(data => data.rows[0])
        return Response.OK(classroom)
    }

    async getParticipants(id) {
        const participants = await pool.query("SELECT * FROM student").then(data => data.rows)
        return participants
    }
}

module.exports = new ClassroomService()