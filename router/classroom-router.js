const Router = require('express').Router;
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');
const classroomController = require('../controllers/classroom-controller');

router.post('/', classroomController.createClassroom);
router.post('/u', classroomController.updateClassroom)
router.post('/d', classroomController.removeClassroom)
router.get("/", classroomController.getClassrooms)
router.get("/id", classroomController.getClassroom)

module.exports = router
