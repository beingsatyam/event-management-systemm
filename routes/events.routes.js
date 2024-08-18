const express = require('express');
const  { validateUser , adminCheck , validateEventInput } = require("../middlewares/validate.middleware")
const router = express.Router();

const { createEvent, updateEvent , registerEvent , deleteEvent , getEvents ,  } = require("../controllers/events.controller");



router.post("/", validateUser , adminCheck, validateEventInput, createEvent);
router.post("/:event_id/register",validateUser ,registerEvent);
router.delete("/:event_id/",validateUser , adminCheck, deleteEvent);
router.put("/:event_id/",validateUser , adminCheck, updateEvent);
router.get("/",validateUser , getEvents);




module.exports = router;