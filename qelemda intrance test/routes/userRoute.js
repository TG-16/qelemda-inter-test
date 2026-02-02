const express = require("express");
const router = express.Router();
const {
    getCatagoryUser,
    searchServiceUser,
} = require("../controller/userController");
const { getCatagory } = require("../controller/providerController");


router.get("/getCatagory", getCatagoryUser);
router.get("/serachService", searchServiceUser);

module.exports = router;