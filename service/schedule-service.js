const logic = require("../utils/logic") 
const Response = require("../responses/response")
const pool = require("../db/pool")
const { v4 } = require("uuid")
const subjectService = require("./subject-service")
const classroomService = require("./classroom-service")

class ScheduleService {
    async createScheduleSubject(classroom, subject, index, day, time, description) {
        const scheduleSubject = await pool.query("INSERT INTO schedulesubject(classroom, subject, index, day, time, description, id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
            classroom,
            subject, 
            index, 
            day,
            time, 
            description, 
            v4()
        ]).then(data => data.rows[0])
        const response = {
            ...scheduleSubject,
            subject: await subjectService.getSubject(scheduleSubject.subject)
        }
        return Response.OK(response)
    }

    async deleteScheduleSubject(id) {
        const scheduleSubject = await pool.query("DELETE FROM schedulesubject WHERE id = $1 RETURNING *", [id]).then(data => data.rows[0])
        return Response.OK(scheduleSubject)
    }

    async updateScheduleSubject(OKVs, id) {
        const {script, vars} = logic.generateSQLUpdateScript("schedulesubject", OKVs, id)
        const subject = await pool.query(script, [vars]).then(data => data.rows[0])
        return Response.OK(subject)
    }

    async getScheduleSubjectsByDay(day, classroom) {
        const scheduleSubject = await pool.query("SELECT * FROM schedulesubject WHERE day = $1 AND classroom = $2", [
            day,
            classroom
        ]).then(data => data.rows[0])
        return Response.OK(scheduleSubject)
    }

    async getScheduleSubjects(classroom) {
        const scheduleSubjects = await pool.query("SELECT * FROM schedulesubject WHERE classroom = $1", [
            classroom  
        ]).then(data => data.rows)
        const sorted = [[], [], [], [], [], [], []]
        for(var i=0; i < scheduleSubjects.length;i++) {
            switch(scheduleSubjects[i].day) {
                case "Mon":
                    sorted[0].push(scheduleSubjects[i])
                    break;
                case "Tue": 
                    sorted[1].push(scheduleSubjects[i])
                    break
                case "Wed": 
                    sorted[2].push(scheduleSubjects[i])
                    break;
                case "Thu": 
                    sorted[3].push(scheduleSubjects[i])
                    break;
                case "Fri": 
                    sorted[4].push(scheduleSubjects[i])
                    break;
                case "Sat":
                    sorted[5].push(scheduleSubjects[i])
                    break
                case "Sun":
                    sorted[6].push(scheduleSubjects[i])
                    break;
                default:  
                    break 
            }
        } 

        for(var i=0;i < sorted.length;i++) {
            const parsed = []
            for(var j=0;j < sorted[i].length;j++) {
                const subject = await subjectService.getSubject(sorted[i][j].subject)
                parsed.push({
                    ...sorted[i][j],
                    subject,
                    index: Number(sorted[i][j].index)
                })
            }
            parsed.sort((a, b) => a.index - b.index)
            sorted[i] = parsed
        }

        //RECONSTRUCT MODEL FOR CLIENT INTERFACE 
        const reconstructed = {
            mon: sorted[0],
            tue: sorted[1],
            wed: sorted[2],
            thu: sorted[3],
            fri: sorted[4],
            sat: sorted[5],
            sun: sorted[6]
        }

        return Response.OK({
            classroom, 
            ...reconstructed, 
            participants: await classroomService.getParticipants(classroom)
        })

    }
}

module.exports = new ScheduleService()