/**
 * Created by Dhruv on 8/21/2018.
 */

function TagChain() {
    let chain = [];

    this.addBlock = (data) => {
        let index = chain.length;
        let prevHash = 0;
        if (index > 0){
            prevHash = chain[index-1].getHash();
        }
        let block = new Block(index, prevHash, data);
        chain.push(block);
    };

    this.isValid = () => {
        for (let i = 0; i < chain.length; i++){
            if (chain[i].getHash() !== chain[i].calculateHash())
                return false;
            if (i > 0 && chain[i].getPreviousHash() !== chain[i-1].getHash())
                return false;
        }
        return true;
    }
}