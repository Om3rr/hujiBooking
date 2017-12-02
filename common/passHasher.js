let md5 = require('md5');

function hash(w){
    let a = "makorayagevermelechal";
    let b = "dontgotothehalal";
    return md5(a+w+b);
}

module.exports = {hash : hash};