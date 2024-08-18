const jwt = require("jsonwebtoken");
// const USERS = require("../db/users.db");

const { User } = require('../models/associations'); 



async function uniqueUserCheck(req, res, next) {
  const { email } = req.body;
  console.log(email);

  const user = await User.findOne({ where: { email } });

  if (user) {
    res.status(422).json(
      { message: 'username already exists!' })
  }

  else {
    next();
  };
};

function validateRegistrationInput(req, res, next) {

  const mandatoryFields = ['name' , 'email', 'password' ]

  const missingFields = []

  for(field of mandatoryFields){
    if (!req.body[field]){

      missingFields.push(field);

    }
  };

  if (missingFields.length > 0){
    res.status(400).json(
      { message:  `one or more manadatory fields are missing : ${missingFields.join(',')}` })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(req.body['email']);

  if (isValidEmail) {
    next();
  } else {
    res.status(400).json(
      { message:  `Invalid email address!` })
  
  };


};


async function validateUser(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;

  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: "Login Required!!!",
    });
  }
  const token = req.headers.authorization.split(" ")[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
}

try {

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded);
    const user = await User.findByPk(decoded.user_id);

    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

 
    req.user = user;
    next();
} catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Failed to authenticate token' });
}
};

function requireAdmin(req , res, next) {
  // Checking if the user has the admin role
  if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { validateUser,uniqueUserCheck,validateRegistrationInput , requireAdmin };