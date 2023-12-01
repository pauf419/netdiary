
const Router = require('express').Router;
const router = new Router();
const scheduleController = require('../controllers/schedule-controller');

router.post('/', scheduleController.createScheduleSubject);
router.post('/d', scheduleController.removeScheduleSubject)
router.get('/', scheduleController.getScheduleSubjects) 


module.exports = router
