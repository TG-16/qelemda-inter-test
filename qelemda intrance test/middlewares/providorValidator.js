const inputValidator = require("../utils/inputValidator");
const {emailValidator} = require("../utils/emailValidator");
const {phoneValidator} = require("../utils/phoneValidator");
const {licenseValidator} = require("../utils/licenseValidator");

const registerValidator = (req, res, next) => {
    const { name, email, phone, password, licenseNumber, companyName,} = req.body || {};
    const inputs = [ name, email, phone, password, licenseNumber, companyName];
    if(!inputValidator(inputs)) 
        return res.status(401).json({success: false, message: "filds can't be empty" });

    //i have to implement these valitations
    //email uniqueness and format
    if (!emailValidator(email))
        return res.status(401).json({ success: false, message: "This email is already registered or invalid format" });

    //phone uniqueness
    if (!phoneValidator(phone))
        return res.status(401).json({ success: false, message: "This phone is already registered" });

    //license uniqueness
    if (!licenseValidator(licenseNumber))
        return res.status(401).json({ success: false, message: "This license is already registered" });


    next();
};

const loginValidator = (req, res, next) => {
    const emailFormatValidator = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const { email, password } = req.body || {};
    const inputs = [email, password];
    if(!inputValidator(inputs))
        return res.status(401).json({success: false, message: "filds can't be empty" });
    
    if (!emailFormatValidator(email))
        return res.status(401).json({ success: false, message: "This email is invalid format" });

    next();
};

module.exports = {
    registerValidator,
    loginValidator,
};