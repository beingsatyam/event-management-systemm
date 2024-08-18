const bcrypt = require("bcrypt");

const { User } = require('../models/associations');

const jwt = require("jsonwebtoken");
require('dotenv').config();


async function createUser(req, res) {
    try {

      const { name , email, password  , role } = req.body;

      const hashedPassword =  await bcrypt.hash(password , 10);


      const user = await User.create({
        name : name,
        password : hashedPassword,
        email : email, 
        role : role
      });

      res.status(201).json({
        message : 'user registered successfully!'
      });
      
    } catch (error) {
      res.status(500).json({
        message: "SOME ERROR OCCURED  " + error.message,
      });
    }
  };
  

async function getUsers(req, res) {
  try {

      const users = await User.findAll({
          attributes: ['user_id', 'name', 'email', 'role'] 
      });

      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
  }
};


async function loginUser(req, res) {
    try {
      const secret = process.env.JWT_SECRET;

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {

        return res.status(401).json({
          message: 'email not found!'
        });
      }
       
      const validatePassword = await bcrypt.compare(
        password,
        user.password
      );
  
      if (user && validatePassword) {
        const payload = { user_id: user.user_id, email: user.email, role: user.role };
  
        const authToken = jwt.sign(payload, secret, { expiresIn: 600000000 });
  
        res.json({
          status: 200,
          message: "Authencation Success",
          token: authToken,
        });
      } else {
        // res.setStatus = 200
        res.status(401).json({
          status: 401,
          message: "Authencation Failed",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  
  module.exports = { createUser , getUsers , loginUser };