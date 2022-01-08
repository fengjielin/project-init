const fs = require('fs');

const { getStudent } = require('../models/studentModel');

// 渲染学生信息首页
let renderStudent = async (req, res) => {
  let student = await getStudent();
  res.render('./student/student.html', { students: student });
};

let addStudent = async (req, res) => {
  res.render('./student/studentAdd.html');
}

let editStudent = async (req, res) => {
  res.render('./student/studentEdit.html');
}

let delStudent = async (req, res) => {
  res.send('删除学生')
}

module.exports = {
  renderStudent,
  addStudent,
  editStudent,
  delStudent
};
