const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createProvider,
  createSlug,
  getProviderByEmail,

  createCatagoryModel,
  updateCatagoryModel,
  deleteCatagoryModel,
  getCatagoryModel,
  searchCatagoryModel,

  createServiceModel,
  updateServiceModel,
  deleteServiceModel,
  getServiceModel,
  searchServiceModel,
} = require("../models/providerModel");
const { decodeToken } = require("../utils/tokenUtil");

const register = async (req, res) => {
  const { name, email, phone, password, licenseNumber, companyName,} = req.body || {};

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createProvider({
      name,
      email,
      phone,
      password: hashedPassword,
      companyName,
      licenseNumber,
    });

    if (!result.insertId)
      return res.status(400).json({ success: false, message: "Registration failed" });

    await createSlug({id: result.insertId, email, name});

    return res.status(201).json({ success: true, message: "Registration successful" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
    const {email,password} = req.body || {};

    try {
    const provider = await getProviderByEmail(email);
    if (!provider) return res.status(404).json({ message: "provider not found" });

    const match = await bcrypt.compare(password, provider.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = await jwt.sign(
      { id: provider.id},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ success: true, token, provider: { name: provider.name, phone: provider.phone }});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const createCatagory = async (req, res) => {
    const { title,  description, status} = req.body || {};
    const providerId = req.providerId;

    const fileBuffer = req.file.buffer;

    try {
        const result = await createCatagoryModel({providerId, title, description, status, fileBuffer});

        if (!result.insertId) return res.status(400).json({ success: false, message: "Catagory creation failed" });

        return res.status(201).json({ success: true, message: "Catagory created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const updateCatagory = async (req, res) => {
    const {id, title, description, status} = req.body || {};

    try {
        const result = await updateCatagoryModel({id, title, description, status});

        if (!result.affectedRows) return res.status(400).json({ success: false, message: "Catagory update failed" });

        return res.status(201).json({ success: true, message: "Catagory updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const deleteCatagory = async (req, res) => {
    const {id} = req.body || {};

    try {
        const result = await deleteCatagoryModel({id});

        if (!result.affectedRows) return res.status(400).json({ success: false, message: "Catagory delete failed" });

        return res.status(201).json({ success: true, message: "Catagory deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const getCatagory = async (req, res) => {
     const { providerId } = req.query;
    try {
        const catagories = await getCatagoryModel(providerId);  

        return res.status(200).json({ success: true, catagories });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const searchCatagory = async (req, res) => {
    const {providerId, title} = req.body || {};
    try {
        const catagories = await searchCatagoryModel(providerId, title);

        return res.status(200).json({ success: true, catagories });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const createService = async (req, res) => {
    const {providerId, catagoryId, serviceName, price, vat, discount} = req.body || {};

    try {
        const result = await createServiceModel({providerId, catagoryId, serviceName, price, vat, discount});

        if (!result.affectedRows) return res.status(400).json({ success: false, message: "Service creation failed" });

        return res.status(201).json({ success: true, message: "Service created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


const updateService = async (req, res) => {
    const {id, serviceName, price, vat, discount} = req.body || {};

    try {
        const result = await updateServiceModel({id, serviceName, price, vat, discount});

        if (!result.affectedRows) return res.status(400).json({ success: false, message: "Service update failed" });

        return res.status(201).json({ success: true, message: "Service updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const deleteService = async (req, res) => {
    const {id} = req.body || {};

    try {
        const result = await deleteServiceModel({id});

        if (!result.affectedRows) return res.status(400).json({ success: false, message: "Service delete failed" });

        return res.status(201).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const getService = async (req, res) => {
    const {providerId, catagoryId} = req.body || {};

    try {
        const services = await getServiceModel(providerId, catagoryId);

        return res.status(200).json({ success: true, services });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const searchService = async (req, res) => {
    const {providerId, serviceName} = req.body || {};

    try {
        const services = await searchServiceModel(providerId, serviceName);

        return res.status(200).json({ success: true, services });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

module.exports = {
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
};