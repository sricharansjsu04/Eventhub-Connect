const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')



router.route('/myHostedEvents')
    .post(eventController.getCreatedEvents)

router.route('/getAllEvents/:username')
    .get(eventController.getAllNotes)

router.route('/MyEvents')
    .post(eventController.getMyEvents)


router.route('/joinEvent')
    .post(eventController.joinEvent)

    
router.route('/getWaitlist/:id')
    .get(eventController.getWaitList)

router.route('/acceptReq')
    .post(eventController.acceptReq)

router.route('/rejectReq')
    .post(eventController.rejectReq)

router.route('/leaveEvent')
    .post(eventController.leaveEvent) 


module.exports = router