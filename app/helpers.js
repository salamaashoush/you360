const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_OWNER = require('./constants').ROLE_OWNER;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;
const fs=require('fs')
// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
    const getUserInfo = {
        _id: request._id,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        role: request.role,
        image:request.image
    };

    return getUserInfo;
};

exports.getRole = function getRole(checkRole) {
    let role;

    switch (checkRole) {
        case ROLE_ADMIN:
            role = 4;
            break;
        case ROLE_OWNER:
            role = 3;
            break;
        case ROLE_CLIENT:
            role = 2;
            break;
        case ROLE_MEMBER:
            role = 1;
            break;
        default:
            role = 1;
    }

    return role;
};
exports.saveFile=function saveFile(file){
    let name= Math.round(Math.random()*10000000) +""+ +new Date();
    let path=process.cwd()+"/public/uploads/"+name;
    let matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    let imbuffer = new Buffer(matches[2], 'base64')
    fs.writeFileSync(path, imbuffer);
    return name;
}
exports.removeFile=function removeFile(file){
    let path=process.cwd()+"/public/uploads/"+file;
    if (fs.existsSync(path)) {
        fs.unlink(path);
    }

}

/** 
 * @function mergeArrayUnique
 * Convert array to uniqe array items
 * @param {Array} array - array to convert 
 * @returns {Array} a - array with uniqe items
 */

exports.mergeArrayUnique = function mergeArrayUnique(array) {
    var newArray = array.concat();
    for(var i=0; i<newArray.length; ++i) {
        for(var j=i+1; j<newArray.length; ++j) {
            if(newArray[i] === newArray[j])
                newArray.splice(j--, 1);
        }
    }

    return newArray;
};

let url = require('url');

exports.fullUrl=function fullUrl(req,path) {
    let protocol = req.protocol
    if(req.headers.host==="you360.herokuapp.com"){
        protocol="https"
    }
    return url.format({
        protocol: protocol,
        host: req.headers.host,
        pathname: path
    });
};

exports.defaulter = function defaulter(value,returnValue,defaultValue) {
    if(value === "" || typeof value === "undefined"){
        return defaultValue;
    }
    return returnValue;
}

/** 
 * @function isuserinarray
 * Check if id in array or not
 * @param {Array} array - array to search in
 * @param {Number} userid - id that check for
 * @returns {Boolean} flag 
 */
exports.isuserinarray = function isuserinarray(array,userid){
    let flag= false
    // get if user liked this video or not
    if (array.toString().includes(String(userid))) {
        flag = true;
    }
    return flag
}
