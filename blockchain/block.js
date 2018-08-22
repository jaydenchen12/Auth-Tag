/**
 * Created by Dhruv on 8/21/2018.
 */
"use strict";
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(ind, prevHash, data) {
        this.index = ind;
        this.previousHash = prevHash;
        this.tagData = data;
        this.timestamp = Date.now().toString();
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + JSON.stringify(this.tagData) + this.timestamp).toString();
    }

    // function makeHash() {
    //     return SHA256(index + previousHash + JSON.stringify(tagData) + timestamp).toString();
    // }
}

module.exports = Block;