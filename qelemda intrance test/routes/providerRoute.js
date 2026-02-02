const {
    register,
    login,

    createCatagory,
    updateCatagory,
    deleteCatagory,
    getCatagory,
    searchCatagory,

    createService,
    updateService,
    deleteService,
    getService,
    searchService
} = require("../controller/providerController");
const {
    registerValidator,
    loginValidator,
} = require("../middlewares/providorValidator");
const upload = require("../config/multer");
const { protectRoute } = require("../utils/tokenUtil");

const express = require("express");
const router = express.Router();


router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

router.post("/createCatagory", protectRoute, upload.single("image"), createCatagory);
router.patch("/updateCatagory", updateCatagory);
router.delete("/deleteCatagory", deleteCatagory);
router.get("/getCatagory", getCatagory);
router.get("/searchCatagory", searchCatagory);

router.post("/createService", createService);
router.patch("/updateService", updateService);
router.delete("/deleteService", deleteService);
router.get("/getService", getService);
router.get("/searchService", searchService);


module.exports = router;
