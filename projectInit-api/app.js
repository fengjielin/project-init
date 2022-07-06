const path = require("path");

const express = require("express");
const app = express();
const port = 3000;

// 模板引擎
app.engine("html", require("express-art-template"));

// 引入cors，处理跨域请求
const cors = require("cors");
app.use(cors());
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OP0TIONS");
  res.header("X-Powered-By", "3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 静态目录
app.use("/static", express.static(path.join(__dirname, "public")));

// 解析POST请求体数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Welcome to Express!");
});

app.post("/post", (req, res) => {
  console.log(req.body);
  res.send("Got a POST request");
});

// 捕获未知错误
process.on("uncaughtException", (err) => {
  console.error(err && err.stack);
});

let docRouter = require("./routes/project/docRouter");
app.use(docRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    code: 500,
    msg: err.message,
  });
});

let studentRouter = require("./routes/studentRouter");
app.use(studentRouter);

const host = "127.0.0.1";
// const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
