const assert = require('assert');
const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');
const dbName = 'AuthMongo';
const url = 'mongodb://localhost:27017/';

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/product',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let products = db.db(dbName).collection('products')
    try {
        products.insertOne({
          tagId: req.body.tagId,
          productName: req.body.productName,
          productDescription: req.body.productDescription,
          productMSRP: req.body.productMSRP,
          productManufactorDate: new Date(req.body.productManufactorDate),
          ownerships: []
        })
        res.status(200).send("Successfully added to database");
    } catch (e) {
       console.log (e);
    };
    db.close();
  });
});



module.exports = router;
