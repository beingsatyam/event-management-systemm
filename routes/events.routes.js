const express = require('express');
const  { validateUser , requireAdmin } = require("../middlewares/validate.middleware")
const router = express.Router();

const { createEvent, updateEvent , registerEvent , deleteEvent , getEvents  } = require("../controllers/events.controller");



router.post("/", validateUser , requireAdmin, createEvent);
router.post("/:event_id/register",validateUser ,registerEvent);
router.delete("/:event_id/",validateUser , requireAdmin, deleteEvent);
router.put("/:event_id/",validateUser , requireAdmin, updateEvent);
router.get("/",validateUser , getEvents);




module.exports = router;