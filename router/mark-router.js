const markController = require("../controllers/mark-controller")

const Router = require("express").Router
const router = new Router()

router.post("/", markController.createMark)
router.get("/", markController.getMarks)

module.exports = router