const Router = require('express').Router;
const router = new Router();
const studentController = require("../controllers/student-controller")

router.post('/', studentController.createStudent);
router.post('/u', studentController.updateStudent)
router.get("/", studentController.getStudents)

module.exports = router
