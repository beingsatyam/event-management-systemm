const express = require('express');
const USERS = require('../db/users.db');
const  { uniqueUserCheck, validateRegistrationInput, validateUser } = require("../middlewares/validate.middleware")
const router = express.Router();

const { createUser, getUsers , loginUser  } = require("../controllers/users.controller");


// router.post("/login", loginUser);

router.post("/register",validateRegistrationInput, uniqueUserCheck, createUser);

router.post("/login", loginUser);

router.get("/" , getUsers);


module.exports = router;