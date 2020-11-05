const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

//Register
router.post('/register', async (req, res, next) => {
    console.log('Body', req.body);
    let newUserEmail = req.body.email;
    let newUserPassword = req.body.password;

    //Check if email and password have been passed
    if(!newUserIsValid.email(newUserEmail) || !newUserIsValid.password(newUserPassword)){
        return res.json({ success: false, message: "Invalid parameters" });
    }

    //Check if the email address is already registered
    let userRegistered = await userModel.getUserByEmail(newUserEmail);
    if(userRegistered){
        return res.json({ success: false, message: "This email is already registered"})
    }

    //Create the new user and insert it in the Db
    let newUser = new userModel({
        email: req.body.email,
        password: req.body.password,
        registrationDate: new Date(),
        lastConnection: undefined,
        trackers: []
    });

    let insertion = await userModel.insertUser(newUser);
    if(!insertion.success){
        res.json({ success: false, message: "Failed to register user"});
    }else{
        res.json({ success: true, message: "User registered"});
    }
});

// Define the home page route
router.get('/', function(req, res) {
  res.send('Users home page');
});

// Define the about route
router.get('/about', async function(req, res) {
    console.log(userModel);
    let nbUsers = await userModel.getNumberUsers();
    res.send(`About users ${nbUsers}`);
});

const newUserIsValid = {
    email: function(newUserEmail){
        const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailValidator.test(String(newUserEmail).toLowerCase());
    },
    password: function(newUserPassword){
        return typeof newUserPassword === "string" && newUserPassword.length > 6;
    }
};

module.exports = router;