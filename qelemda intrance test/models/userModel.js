const db = require("../config/db");

const getCatagoryUserModel = async (page) => {
  const limit = 6; 
  const offset = page === 1 ? 0 : page;

  const sql = 
    `SELECT title, description, icon, status
       FROM catagories 
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`;

  const [rows] = await db.execute(sql);


  return rows; 
};

const getTotalCatagory = async () => {
  const sql = `SELECT COUNT(*) as total FROM catagories`;
  const [rows] = await db.execute(sql);
  return rows[0].total;
};

const searchServiceUserModel = async (serviceName) => {
  const likeTerm = `%${serviceName}%`;
  const [result] = await db.execute(
    `SELECT service_name, price, vat, discount FROM services WHERE service_name LIKE ?`,
    [likeTerm]
  );
  return result;
};



module.exports = {
    getCatagoryUserModel,
    getTotalCatagory,
    searchServiceUserModel
}