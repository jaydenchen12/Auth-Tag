const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Block = require('../blockchain/block');
const fs = require('fs')
const TagChain = require('../blockchain/blockchain');
const express = require('express');
const bodyParser = require("body-parser");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const https = require('https');
const config = require('./config');
const util = require('./util');
const app = express();
// Connection URL
const url = 'mongodb://localhost:27017/';
const port =  3000
const AuthController = require('./auth/AuthController');
const Products = require('./manufacture/Products');
const Dev = require('./dev-api/DevApi')
const dbName = 'AuthMongo';
const privateKey = fs.readFileSync( './keys/MyKey.key' );
const certificate = fs.readFileSync( './keys/MyCertificate.crt' );
let blockchain = new TagChain();

app.use('/auth', AuthController);
app.use('/manufacture', Products);
app.use('/dev', Dev)
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

app.post('/transferOwnership',function(req,res){
  if (!req.headers['authorization']) return res.status(401).send({ authorized: false, message: 'No token provided.' });
  let token = util.getToken(req.headers['authorization']);
  jwt.verify(token, config.secret, function(err, decoded){
    if (err) return res.status(401).send({ authorized: false, message: 'Failed to authenticate token.' });
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      let products = db.db(dbName).collection('products')
      let accounts = db.db(dbName).collection('accounts')
      try {
          //push the transaction onto the product history
          let transaction = {
            owner: req.body.userId,
            receiver: req.body.receiverId,
            timestamp: new Date()
          }
          //add ownership to product chain
          products.updateOne({tagId: req.body.tagId}, {$push: {ownerships: transaction}});
          // remove ownership from owner
          accounts.updateOne({userId: req.body.userId}, {$pull: {ownerships: req.body.tagId}});
          //add ownership to receiver
          accounts.updateOne({userId: req.body.receiverId}, {$push: {ownerships: req.body.tagId}});
          res.status(200).send("transfer ownership completed");
      } catch (error) {
         return res.status(500).send("Error has occured")
         console.log (error);
      };
      db.close();
    });
  });
});
app.post('/releaseOwnership',function(req,res){
  if (!req.headers['authorization']) return res.status(401).send({ authorized: false, message: 'No token provided.' });
  let token = util.getToken(req.headers['authorization']);
  jwt.verify(token, config.secret, function(err, decoded){
    if (err) return res.status(401).send({ authorized: false, message: 'Failed to authenticate token.' });
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      let products = db.db(dbName).collection('products')
      let accounts = db.db(dbName).collection('accounts')
      try {
          let transaction = {
            owner: req.body.userId,
            receiver: null,
            timestamp: new Date()
          }
          products.updateOne({tagId: req.body.tagId}, {$push: {ownerships: transaction}});
          //take ownership away from owner
          accounts.updateOne({userId: req.body.userId}, {$pull: {ownership: req.body.tagId}});
          res.status(200).send("release ownership completed");
      } catch (error) {
         return res.status(500).send("Error has occured")
         console.log (error);
      };
      db.close();
    });
  });
});
app.post('/claimOwnership',function(req,res){
  if (!req.headers['authorization']) return res.status(401).send({ authorized: false, message: 'No token provided.' });
  let token = util.getToken(req.headers['authorization']);
  jwt.verify(token, config.secret, function(err, decoded){
    if (err) return res.status(401).send({ authorized: false, message: 'Failed to authenticate token.' });
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      let products = db.db(dbName).collection('products')
      let accounts = db.db(dbName).collection('accounts')
      try {
          let transaction = {
            owner: null,
            receiver: req.body.userId,
            timestamp: new Date()
          }
          products.updateOne({tagId: req.body.tagId}, {$push: {ownerships: transaction}});
          //take give ownership away to user
          accounts.updateOne({userId: req.body.userId}, {$push: {ownership: req.body.tagId}});
          res.status(200).send("You claimed ownership");
      } catch (error) {
        return res.status(500).send("Error has occured")
         console.log (error);
      };
      db.close();
    });
  });
});

app.get('/', function(req, res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    res.send("Hello World, database connection success");
    db.close();
  });
});

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, function() {
  console.log('listening on ', port)
});
