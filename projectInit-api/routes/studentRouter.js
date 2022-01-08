const express = require('express');
const router = express.Router();

let Student = require('../controllers/studentController');

router.get('/students', Student.renderStudent);
router.get('/students/add', Student.addStudent);
router.get('/students/edit', Student.editStudent);
router.get('/students/del', Student.delStudent);

module.exports = router;