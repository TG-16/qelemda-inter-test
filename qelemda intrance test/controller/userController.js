const { 
    getCatagoryUserModel, 
    getTotalCatagory ,
    searchServiceUserModel
} = require("../models/userModel");


const getCatagoryUser = async (req, res) => {
    
    const page = parseInt(req.query.page) || 1;
    try {
        const catagories = await getCatagoryUserModel(page);
        const totalCatagories = await getTotalCatagory();
        const pageCount = Math.ceil(totalCatagories / 6);
        return res.status(200).json({success: true, catagories, totalCatagories, pageCount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const searchServiceUser = async (req, res) => {
    const { serviceName } = req.query;
    try {
        const services = await searchServiceUserModel(serviceName);
        return res.status(200).json({ success: true, services });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

module.exports = {
    getCatagoryUser,
    searchServiceUser,
};