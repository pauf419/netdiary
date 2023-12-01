const Router = require('express').Router;
const userController = require('../controllers/auth-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const classroomRouter = require('./classroom-router')
const authRouter = require("./auth-router")
const subjectRouter = require("./subject-router")
const studentRouter = require("./student-router")
const scheduleRouter = require("./schedule-router")
const markRouter = require("./mark-router")


router.use("/auth", authRouter)
router.use("/crud/schedule", scheduleRouter) 
router.use("/crud/classroom", classroomRouter)
router.use("/crud/subject", subjectRouter)
router.use("/crud/student", studentRouter)
router.use("/crud/mark", markRouter)


module.exports = router
