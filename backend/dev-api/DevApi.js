const assert = require('assert');
const bodyParser = require("body-parser");
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const config = require('../config');
const util = require('../util');
const dbName = 'AuthMongo';
const url = 'mongodb://localhost:27017/';

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/devDbProducts',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let products = db.db(dbName).collection('products')
    try {
      products.find({}).toArray(function(err, result) {
        res.status(200).send(result);
        db.close();
      });
    } catch (error) {
       console.log(error);
    };
  });
});

router.get('/devDbAccounts',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let accounts = db.db(dbName).collection('accounts')
    try {
      accounts.find({}).toArray(function(err, result) {
        res.status(200).send(result);
        db.close();
      });
    } catch (error) {
       console.log(error);
    };
  });
});

module.exports = router;
