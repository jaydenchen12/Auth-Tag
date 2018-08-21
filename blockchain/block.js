/**
 * Created by Dhruv on 8/21/2018.
 */

const SHA256 = require('crypto-js/sha256');

function Block(ind, prevHash, data){
    let index = ind;
    let previousHash = prevHash;
    let tagData = data;
    let timestamp = Date.now().toString();
    let hash = this.calculateHash();

    this.getIndex = () => {
        return index;
    };

    this.getHash = () => {
        return hash;
    };

    this.getPrevHash = () => {
        return previousHash;
    }

    this.calculateHash = () => {
        return SHA256(index + previousHash + JSON.stringify(tagData) + timestamp);
    };
}

module.exports = Block;