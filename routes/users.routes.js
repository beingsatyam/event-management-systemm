const express = require('express');
const  { uniqueUserCheck, validateRegistrationInput, validateUser , adminCheck } = require("../middlewares/validate.middleware")
const router = express.Router();

const { createUser, getUsers , loginUser  } = require("../controllers/users.controller");


router.post("/register",validateRegistrationInput, uniqueUserCheck, createUser);

router.post("/login", loginUser);

router.get("/" , validateUser , adminCheck , getUsers);


module.exports = router;