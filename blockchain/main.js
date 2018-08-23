const Block = require('./block');
const TagChain = require('./blockchain');


//let's create a blank blockchain
let blockchain = new TagChain();

//some dummy data
let dummy = {
    tagID: "g12dd",
}

//let's add the dummy data to the blockchain by adding a new block
blockchain.addBlock(dummy);

//lets print it
console.log(blockchain.chain);

//check to see chain is valid
console.log('valid:', blockchain.isValid());

//let's look for the tagId from the dummy data in the block chain. should be true
console.log('query for "g12dd":', blockchain.query('g12dd'));

//let's look for a tagId thats not there, should be false
console.log('query for "g1a2dd":', blockchain.query('not,existing in chain'));

//we are evil and we want to manipulate the blockchain, we will change the value of the tag data to lolol
blockchain.chain[1].tagData = {tagID: 'lolol'};
//let's print the new and manipulated chain
console.log(blockchain.chain);

//let's see if its still valid, should be false. rest assured, no one will accept this blockchain since it is invalid.
console.log('valid:', blockchain.isValid());




