const express = require('express')();
const Block = require('./block');


//express.listen(80,() => {console.log('hello world!')});

const block = new Block(0,'sss', 'test');
console.log(block.index);
console.log(block.getIndex());