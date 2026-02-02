const {
  phoneExists,
} = require("../models/providerModel");

//phone regular expression validation
const phoneFormatValidator = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phone);
};

//phone uniqueness validation
const phoneUniqueValidator = async (phone) => {
    const exists = await phoneExists(phone);
    return !exists;
}

const phoneValidator = async (phone) => {

    if (!phoneFormatValidator(phone)) {
      return false;
    }   

    if (!await phoneUniqueValidator(phone)) {
        return false;
    }

    return true;
}

module.exports =
{
    phoneValidator
}