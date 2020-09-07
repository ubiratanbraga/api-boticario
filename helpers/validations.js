// Validate date on following format: 'YYYY/mm/dd';
function isValidDate(str) {
    let pattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

    if (!str || !str.match(pattern)) {
        return false;
    }

    let year, month, days;
    [year, month, days] = str.split('/');

    if (month < 1 || month > 12) {
        return false;
    }

    let monthsWith30days = [4, 6, 9, 11];
    let monthsWith31days = [1, 3, 5, 7, 8, 10, 12];

    if (days < 1 || (month == 2 && days > 29) || (monthsWith30days.includes(month) && days > 30) || (monthsWith31days.includes(month) && days > 31)) {
        return false;
    }

    return true;
}

//Validate time on following format: 'HH:mm:ss';
function isValidTime(str) {
    let pattern = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;

    if (!str || !str.match(pattern)) {
        return false;
    }

    let hours, minutes, seconds;
    [hours, minutes, seconds] = str.split(':');

    if (hours < 0 || hours > 23) {
        return false;
    }

    if (minutes < 0 || minutes > 59) {
        return false;
    }

    if (seconds < 0 || seconds > 59) {
        return false;
    }

    return true;
}

//Validate datetime on following format: 'YYYY/mm/dd HH:mm:ss';
function isValidDatetime(str) {
    let date, time;

    if(!str){
        return false;
    }

    [date, time] = str.split(' ');
    if (!isValidDate(date)) {
        return false;
    }
    if (!isValidTime(time)) {
        return false;
    }
    return true;
}

//Validate format email;
function isValidEmail(email) {
    if(!email){
        return false;
    }

    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)) {
        return true;
    } else {
        return false;
    }
}

//Validate format phone;
function isValidPhone(phone) {
    //TODO:Create validation function to phone number;
    if(!phone){
        return false;
    }
    return true;
}

//Validate format ipv4;
function isValidIpv4(ip) {
    //TODO:Create validation function to ip version 4;
    if(!ip){
        return false;
    }
    return true;
}

//Validate format ipv6;
function isValidIpv6(ip) {
    //TODO:Create validation function to ip version 6;
    if(!ip){
        return false;
    }
    return true;
}

//Validate format ip;
function isValidIp(ip) {
    if(!ip){
        return false;
    }
    return isValidIpv4(ip) || isValidIpv6(ip);
}

//Validate mac address;
function isValidMacAddress(macAddress) {
    //TODO:Create validation function to mac address;
    if(!macAddress){
        return false;
    }
    return true;
}

//Validate password;
function isValidPassword(password) {
    if(!password){
        return false;
    }

    //Test if password contains one number;
    let hasNumeric = password.match(/[0-9]/ig);

    //Test if password contains one special character;
    let hasSpecialCharacter = password.match(/\W/ig);

    //Test if password contains one upper case character;
    let hasCharacterUpperCase = password.match(/[A-Z]/g);
    
    //Test if password contains one lower case character;
    let hasCharacterLowerCase = password.match(/[a-z]/g);

    if(password.length >= 8 && hasNumeric && hasSpecialCharacter && hasCharacterUpperCase && hasCharacterLowerCase){
        return true;
    }else{
        return false;
    }
}

//Validate cpf;
function isValidCpf(cpf){
    let mod;
    let sum = 0;

    if (!cpf){
        return false;
    }

    cpf = cpf.replace(/(.|-)/ig,'');

    if (cpf == "00000000000"){
        return false;
    } 

    for (i = 1; i <= 9; i++){
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    mod = (sum * 10) % 11;

    if ((mod == 10) || (mod == 11)){
        mod = 0;
    }

    if (mod != parseInt(cpf.substring(9, 10))){
        return false;
    }

    sum = 0;
    for (i = 1; i <= 10; i++){
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    mod = (sum * 10) % 11;

    if ((mod == 10) || (mod == 11)){
        mod = 0;
    }

    if (mod != parseInt(strCPF.substring(10, 11))){
        return false;
    }

    return true;
}

//Validate link;
function isValidLink(link){
    //TODO:Create validation function to link;
    if(!link){
        return false;
    }
    return true;
}

module.exports = {
    isValidDate,
    isValidTime,
    isValidDatetime,
    isValidEmail,
    isValidPassword,
    isValidCpf
}