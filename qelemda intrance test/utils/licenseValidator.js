const {
  licenseExists,
} = require("../models/providerModel");

//license uniqueness validation
const licenseUniqueValidator = async (licenseNumber) => {
    const exists = await licenseExists(licenseNumber);
    return !exists;
};

const licenseValidator = async (licenseNumber) => {

    if (!await licenseUniqueValidator(licenseNumber)) {
        return false;
    }

    return true;
    
};

module.exports =
{
    licenseValidator
}