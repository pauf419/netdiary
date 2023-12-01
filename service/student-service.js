const { v4 } = require("uuid")
const pool = require("../db/pool")
const Response = require("../responses/response")
const logic = require("../utils/logic") 

class StudentService {

    async createStudent(userid, firstname, lastname, classroom) {
        const student = await pool.query("INSERT INTO student(classroom, userid, firstname, lastname, id) VALUES($1, $2, $3, $4, $5) RETURNING *", [
            classroom,
            userid, 
            firstname,
            lastname, 
            v4()
        ]).then(data => data.rows[0])
        return Response.OK(student)
    }

    async removeStudent(id) {
        const student = await pool.query("DELETE FROM student WHERE id = $1 RETURNING *", [id]).then(data => data.rows[0])
        return Response.OK(student)
    }

    async updateStudent(OKVs, id) {
        const {script, vars} = logic.generateSQLUpdateScript("student", OKVs, id)
        const student = await pool.query(script, vars).then(data => data.rows[0])
        return Response.OK(student)
    } 

    async getStudents(offset, limit) {
        const students = await pool.query("SELECT * FROM student OFFSET $1 LIMIT $2", [offset, limit]).then(data => data.rows)
        return Response.OK(students) 
    }
}

module.exports = new StudentService()