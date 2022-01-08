const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

// 模板引擎
app.engine('html', require('express-art-template'));

// 静态目录
app.use('/static', express.static(path.join(__dirname, 'public')));

// 解析POST请求体数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log(req.query);
  res.send('Welcome to Express!');
});

app.post('/post', (req, res) => {
  console.log(req.body);
  res.send('Got a POST request');
});

let studentRouter = require('./routes/studentRouter');
app.use(studentRouter);

app.listen(port, () => console.log('Server running at http://127.0.0.1:3000/'));
