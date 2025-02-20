const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "Mail exist"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.error("Bcrypt error:", err);
                    return res.status(500).json({ error: err.message || "Error hashing password" });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            console.log("User created:", result);
                            res.status(201).json({ message: "User created successfully", user: result });
                        })
                        .catch(err => {
                            console.error("Mongoose save error:", err);
                            if (err.code === 11000) { // Duplicate email error
                                res.status(409).json({ error: "Email already exists" });
                            } else {
                                res.status(500).json({ error: err.message || "Error saving user" });
                            }
                        });
                }
            });
        }
    })
    
});

router.post("/login", (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if(result) {
               const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY ,
                {
                    expiresIn: "1h"
                }
            );
                return res.status(200).json({
                    message: "Auth Successful!",
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth failed"
            });
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
          error: err
        });
      })
})

router.delete('/:userid', (req, res, next) => {
    User.deleteOne({_id: req.params.userid})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
          error: err
        });
      })
})

module.exports = router;