const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const bodyParser = require("body-parser");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const util = require('./util');
const app = express();
// Connection URL
const url = 'mongodb://localhost:27017/';
const AuthController = require('./auth/AuthController');
const Products = require('./manufacture/Products');
const dbName = 'AuthMongo';

app.use('/auth', AuthController);
app.use('/manufacture', Products);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ownership',function(req,res){
  console.log(req.headers)
  var token = util.getToken(req.headers['authorization']);
  if (!token) return res.status(401).send({ authorized: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ authorized: false, message: 'Failed to authenticate token.' });
    return res.status(200).send("Success")
  });
});

app.post('/verify',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let products = db.db(dbName).collection('products')
    try {
          products.findOne({tagId: req.body.tagId},
            (err, product) => {
              if (product){
                res.status(200).send(product);
              } else {
                res.status(201).send("Not Real")
              }
          });
    } catch (error) {
       console.log(error);
    };
    db.close();
  });
});

app.post('/transferOwner',function(req,res){
  let token = util.getToken(req.headers['authorization']);
  if (!token) return res.status(401).send({ authorized: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded){
    if (err) return res.status(500).send({ authorized: false, message: 'Failed to authenticate token.' });
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      let products = db.db(dbName).collection('products')
      let accounts = db.db(dbName).collection('accounts')
      try {
              let transaction = {
                tagId: req.body.tagId,
                sourceOwner: req.body.userId,
                receiver: req.body.receiverId
              }
              //push the transaction onto the product history
              console.log(req.body)
              products.updateOne({tagId: req.body.tagId}, {$push: {ownerships: transaction}});
              //take ownership away from owner
              accounts.updateOne({userId: req.body.userId}, {$pull: {ownerships: req.body.tagId}});
              //add ownership to receiver
              accounts.updateOne({userId: req.body.receiverId}, {$push: {ownerships: req.body.tagId}});
              return res.status(200).send("Success")
      } catch (error) {
         console.log (error);
      };
      db.close();
    });
  });
});

app.listen(3000, function() {
  console.log('listening on 3000')
})
