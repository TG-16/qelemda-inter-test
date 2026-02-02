const {
  emailExists,
} = require("../models/providerModel");

//email regular expression validation
const emailFormatValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//email uniqueness validation
const emailUniqueValidator = async (email) => {
    const exists = await emailExists(email);
    return !exists;
};

const emailValidator = (email) => {
    if (!emailFormatValidator(email)) {
      return false;
    }

    if (!emailUniqueValidator(email)) {
      return false;
    }

    return true;
}

module.exports = 
{
    emailValidator
}

