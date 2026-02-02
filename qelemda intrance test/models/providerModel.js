const db = require("../config/db");

const createProvider = async ({name, email, phone, password, companyName, licenseNumber}) => {
  const [result] = await db.execute(
      `INSERT INTO providers (full_name, email, phone, password, company_name, license_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, password, companyName, licenseNumber]
    );
  return result;
};

const createSlug = async ({ id, email, name }) => {
  // Generate slug
  const slug = name + "-" + id;

  const [result] = await db.execute(
    `UPDATE providers 
     SET slug = ? 
     WHERE email = ?`,
    [slug, email]
  );

  return slug;
};


const emailExists = async (email) => {
  const [result] = await db.execute(
    `SELECT * FROM providers WHERE email = ?`,
    [email]
  );
  return result.length > 0;
};

const phoneExists = async (phone) => {
  const [result] = await db.execute(
    `SELECT * FROM providers WHERE phone = ?`,
    [phone]
  );
  return result.length > 0;
};

const licenseExists = async (licenseNumber) => {
  const [result] = await db.execute(
    `SELECT * FROM providers WHERE license_number = ?`,
    [licenseNumber]
  );
  return result.length > 0;
};

const getProviderByEmail = async (email) => {
  const [result] = await db.execute(
    `SELECT * FROM providers WHERE email = ?`,
    [email]
  );
  return result[0];
};

const createCatagoryModel = async ({providerId, title, description, status, fileBuffer}) => {
  const [result] = await db.execute(
    `INSERT INTO catagories (provider_id, title, description, status, icon)
    VALUES (?, ?, ?, ?, ?)`,
    [providerId, title, description, status, fileBuffer]
  );
  return result;
};

const updateCatagoryModel = async ({id, title, description, status}) => {
  const [result] = await db.execute(
    `UPDATE catagories
    SET title = ?, description = ?, status = ?
    WHERE id = ?`,
    [title, description, status, id]
  );
  return result;
};

const deleteCatagoryModel = async ({id}) => {
  const [result] = await db.execute(
    `DELETE FROM catagories
    WHERE id = ?`,
    [id]
  );
  return result;
};

const getCatagoryModel = async (providerId) => {
  const [result] = await db.execute(
    `SELECT * FROM catagories WHERE provider_id = ?`,
    [providerId]
  );
  return result;
};

const searchCatagoryModel = async (providerId, title) => {
  const likeTerm = `%${title}%`;
  const [result] = await db.execute(
    `SELECT title, description FROM catagories WHERE title LIKE ? OR description LIKE ? AND provider_id = ?`,
    [likeTerm, likeTerm, providerId]
  );
  return result;
};

const createServiceModel = async ({providerId, catagoryId, serviceName, price, vat, discount}) => {
  const [result] = await db.execute(
    `INSERT INTO services (provider_id, catagory_id, service_name, price, vat, discount)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [providerId, catagoryId, serviceName, price, vat, discount]
  );
  return result;
};

const updateServiceModel = async ({id, serviceName, price, vat, discount}) => { 
  const [result] = await db.execute(
    `UPDATE services
    SET service_name = ?, price = ?, vat = ?, discount = ?
    WHERE id = ?`,
    [ serviceName, price, vat, discount, id]
  );
  return result;
};

const deleteServiceModel = async ({id}) => {
  const [result] = await db.execute(
    `DELETE FROM services
    WHERE id = ?`,
    [id]
  );
  return result;
};

const getServiceModel = async (providerId, catagoryId) => {
  const [result] = await db.execute(
    `SELECT * FROM services WHERE provider_id = ? AND catagory_id = ?`,
    [providerId, catagoryId]
  );
  return result;
};

const searchServiceModel = async (providerId, serviceName) => {
  const likeTerm = `%${serviceName}%`;
  const [result] = await db.execute(
    `SELECT service_name, price, vat, discount FROM services WHERE service_name LIKE ? AND provider_id = ?`,
    [likeTerm, providerId]
  );
  return result;
};


module.exports = {
  createProvider,
  createSlug,
  emailExists,
  phoneExists,
  licenseExists,
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
}