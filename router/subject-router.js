const Router = require('express').Router;
const router = new Router();
const subjectController = require("../controllers/subject-controller")

router.post("/", subjectController.createSubject)
router.post("/d", subjectController.removeSubject)
router.post("/u", subjectController.updateSubject)
router.get("/", subjectController.getSubjects)

module.exports = router
