// const uuidv4 = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class Util {
    constructor(){};

    encryptPassword(password) {
        return bcrypt.hash(password, 10);
    }

    checkPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    sanitizeAttributes(attr){
        if(attr.startsWith(',')){
            attr = attr.substr(1);
        }

        if(attr.endsWith(',')){
            attr = attr.substr(0,attr.length-1);
        }

        return attr;
    }

    generateGuid(){
        return uuidv4();
    }

    generateEmailsToSearchInDB(prefix){
        if(config.sufixEmails && config.sufixEmails.length && prefix){
            return config.sufixEmails.map((sufix)=>{
                return `${prefix}@${sufix}`
            })
        }
        return null
    }
}

module.exports = Util;