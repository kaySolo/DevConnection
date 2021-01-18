const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// register input validator
const registerInputValidator = require('../../validation/register');

// login input validator
const loginInputValidator = require('../../validation/login');

// @route   api/user/test
// @desc    Tests user route
// @access  public 
router.get('/test', (req, res) => res.json({msg : "user works fine"}));

// @route   api/user/register
// @desc    Register user route
// @access  public 
router.post('/register', (req, res) => {

    // Register input validation
    const { errors, isValid } = registerInputValidator(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }


    User.findOne({email : req.body.email}).then(user => {
            if(user){
                errors.email = "User already exists";
                return res.status(400).json(errors);
            }else{
                const avatar = gravatar.url(req.body.email,{
                    s : '200', // size
                    r : 'pg', // rating
                    d : 'mm' // default
                });

                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    avatar,
                    password : req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.log(err);
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    
                    });
                })
            }
        })    
});

// @route   api/user/login
// @desc    Login user route
// @access  public 
router.post('/login', (req, res) => {

    // Login input validation
    const { errors, isValid } = loginInputValidator(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // console.log(req.body);

    User.findOne({email})
        .then(user => {
            if(!user){
                errors.email = "user not found";
                return res.status(404).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // res.json({msg: "success"});
                        // User Match
                        const payload = {id: user.id, email: user.email, name: user.name, avatar: user.avatar};

                        // sign payload
                        jwt.sign(payload, keys.secretKey, {expiresIn: 3600}, (err, token) => {
                            if(err) return console.log(err);
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                    }else{
                        errors.password = "password incorrect";
                        return res.status(400).json(errors);
                    }
                })
        })
})

// @route   api/user/current
// @desc    Get current user
// @access  private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})


module.exports = router;