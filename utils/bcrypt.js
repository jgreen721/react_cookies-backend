const bcrypt = require("bcrypt");


async function hashPW(pw){
    let salt = await bcrypt.genSalt(10);

    let hashedPW = await bcrypt.hash(pw,salt);
    console.log("Hashed",hashedPW);
    return hashedPW
}



async function comparePW(pw,hash){

    let result =  await bcrypt.compare(pw,hash)
    console.log("PW_RESULT",result);
    return result;
}


module.exports = {
    hashPW,comparePW
}