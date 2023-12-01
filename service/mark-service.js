const { v4 } = require("uuid")
const pool = require("../db/pool")
const Response = require("../responses/response")

class MarkService {
    async getMarks(time, classroom) {
        const marks = await pool.query("SELECT * FROM mark WHERE classroom = $1 AND time = $2", [classroom, time]).then(data => data.rows)
        return Response.OK(marks)
    }

    async createMark(time, classroom, subject, refer, value, index) {
        const similar = await pool.query("SELECT * FROM mark WHERE classroom = $1 AND refer = $2 AND time = $3 AND index = $4", [classroom, refer, time, index]).then(data => data.rows[0])
        if(!similar) {
            const mark = await pool.query(
                "INSERT INTO mark(id, refer, classroom, subject, time, value, index) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [
                    v4(),
                    refer, 
                    classroom,
                    subject, 
                    time, 
                    value,
                    index
                ]
            ).then(data => data.rows[0])
            return Response.OK(mark)
        }
        const mark = await pool.query("UPDATE mark SET value = $1 WHERE id = $2 RETURNING *", [value, similar.id]).then(data => data.rows[0])
        return Response.OK(mark)
    }
}

module.exports = new MarkService()