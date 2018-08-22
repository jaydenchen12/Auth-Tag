/**
 * Created by Dhruv on 8/21/2018.
 */
"use strict";

const Block = require('./block');
function TagChain() {
     this.chain = [createGenesis()];

    this.addBlock = (data) => {
        let index = this.chain.length;
        let prevHash = 0;
        if (index > 0){
            prevHash = this.chain[index-1].hash;
        }
        let block = new Block(index, prevHash, data);
        this.chain.push(block);
    };



    function createGenesis()  {
        let block =  new Block(0,0,{"tagID" : "-999999"});
        return block;
    }

    this.isValid = () => {
        for (let i = 0; i < this.chain.length; i++) {
            if (this.chain[i].hash !== this.chain[i].calculateHash())
                return false;
            if (i > 0 && this.chain[i].previousHash !== this.chain[i - 1].hash)
                return false;
        }
        return true;
    };

    this.query = (tagID) => {
        try {
            return (this.chain.find((block) => { return block.tagData.tagID === tagID }) != null);
        } catch (e) { return false;}
    }
}

module.exports = TagChain;