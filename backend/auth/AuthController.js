const assert = require('assert');
const bodyParser = require("body-parser");
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const util = require('../util');
const dbName = 'AuthMongo';
const url = 'mongodb://localhost:27017/';

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login',function(req,res){
  let username=req.body.user;
  let password=req.body.password;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let accounts = db.db(dbName).collection('accounts')
    let inputPassword = crypto.createHash('md5').update(password).digest('hex');
    try {
        accounts.findOne({ userId: username }, (err, user) => {
          if (err) return res.status(500).send('Error on the server.');
          if (!user) return res.status(404).send('No user found.');
          var passwordIsValid = bcrypt.compareSync(inputPassword, user.password);
          if (!passwordIsValid) return res.status(401).send({ authorized: false, token: null });
          var token = jwt.sign({ id: user._id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          let bearerToken = "Bearer " + token
          res.status(200).send({ authorized: true, token: bearerToken });
        });
    } catch (e) {
       console.log (e);
    };
    db.close();
  });
});

router.post('/signup',function(req,res){
  let username=req.body.user;
  let password=req.body.password;
  console.log("User name = "+username+", password is "+password);
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let accounts = db.db(dbName).collection('accounts')
    let hashed_password = crypto.createHash('md5').update(password).digest('hex');
    try {
       accounts.insertOne( { userId: username, password: hashed_password, ownership:[] },
        (err, user) => {
           if (err) return res.status(500).send("There was a problem registering the user.")
           // create a token
           var token = jwt.sign({ id: user._id }, config.secret, {
             expiresIn: 86400 // expires in 24 hours
           });
           let bearerToken = "Bearer " + token
           res.status(200).send({ authorized: true, token: bearerToken });
       } );
    } catch (e) {
       console.log (e);
    };
    db.close();
  });
});

module.exports = router;
