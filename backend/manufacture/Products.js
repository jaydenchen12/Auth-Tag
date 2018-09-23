const assert = require('assert');
const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');
const dbName = 'AuthMongo';
const url = 'mongodb://localhost:27017/';
const Block = require('../../blockchain/block');
const TagChain = require('../../blockchain/blockchain');
let blockchain = new TagChain();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/product',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let products = db.db(dbName).collection('products')
    try {
        blockchain.addBlock({tagID: req.body.tagId});
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

router.post('/verify',function(req,res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    let products = db.db(dbName).collection('products')
    try {
      if(blockchain.query(req.body.tagId)){
          products.findOne({tagId: req.body.tagId},
            (err, product) => {
              if (product){
                res.status(200).send(product);
              } else {
                res.status(201).send("Not Real")
              }
          });
      } else {
            res.status(201).send("Product not in blockchain")
      }
    } catch (error) {
       console.log(error);
    };
    db.close();
  });
});

module.exports = router;
