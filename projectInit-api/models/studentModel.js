const db = require('../utils/dbconfig');

let getStudent = async () => {
  let sql = `SELECT * FROM students_info`;
  let result  = await db(sql);
  return result;
};

module.exports = {
  getStudent
}