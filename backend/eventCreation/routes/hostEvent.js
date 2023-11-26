const express = require('express')
const router = express.Router()
const hostController = require('../controllers/hostEventController')


router.route('/getVenues')
    .post(hostController.getAllVenues)

router.route('/getSports')
    .get(hostController.getSports)
    // .post(eventController.createNewNote)
    // .patch(eventController.updateNote)
    // .delete(eventController.deleteNote)
    
router.route('/createEvent')
    .post(hostController.createEvent)


module.exports = router