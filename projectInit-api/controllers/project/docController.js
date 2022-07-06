const fs = require("fs");
const { docModel } = require("../../models/project/docModel");
let upload = require("../../utils/upload");

const path = require("path");
let uploadDir = path.join(__dirname, "../../public/uploadDir/");

let uploadAttach = async (req, res, next) => {
  try {
    let attachInfo = await upload(req, res, uploadDir);
    let data = {
      code: 200,
      msg: "上传成功",
      url: attachInfo.attachUrl,
    };
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
let downloadAttachById = async (req, res, next) => {
  try {
    const id = req.query.id;
    let result = await docModel.findAttachById(id);
    if (result) {
      let fileName = result[0].attachName;
      let fileUrl = uploadDir + result[0].attachUrl;
      console.log("文件下载:" + fileName);
      if (fs.existsSync(fileUrl)) {
        res.download(fileUrl, fileName, (err) => {
          next(err);
        });
      } else {
      }
    } else {
      res.end();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
let getDoc = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log({ id });

    let result = await docModel.findAttachById(id);
    if (result.length > 0) {
      // // 假设我们的word文档文件就存放在这个doc目录里面
      let docxUrl = uploadDir + result[0].attachUrl;
      console.log({ docxUrl });
      // 允许跨域
      res.header("Access-Control-Allow-Origin", "*");
      // 设置请求头
      res.writeHead(200, {
        // 指定文件类型为docx
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      //创建可读流
      let readStream = fs.createReadStream(docxUrl);
      // 将读取的结果以管道pipe流的方式返回给前端
      readStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

let getDocInfoByPage = async (req, res, next) => {
  try {
    let { pageNum, pageSize, projectId, keyword } = req.body;
    let bugInfo = await docModel.getDocInfoByPage(
      parseInt((pageNum - 1) * pageSize),
      parseInt(pageSize),
      projectId,
      keyword
    );
    let dataCount = await docModel.findCount(projectId, keyword);
    let data = {
      code: 200,
      msg: "请求成功",
      data: bugInfo,
      dataCount: dataCount[0].count,
    };
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
let addOrUpdateDocInfo = async (req, res, next) => {
  try {
    let { id, projectId, creatorId, uploadList } = req.body;
    let attach = JSON.parse(uploadList);
    let attachInfo = {
      attachName: attach[0].attachName,
      attachUrl: attach[0].attachUrl,
      uploadTime: new Date(),
      size: attach[0].size,
    };
    if (!id) {
      // 新增
      let result = await docModel.addUploadInfo(attachInfo);
      let attachId = result.insertId;
      await docModel.insertDoc(projectId, attachId, creatorId);
      res.json({
        code: 200,
        msg: "操作成功",
      });
    } else {
      // 修改
      let info = await docModel.findDocById(id);
      if (info.length === 1) {
        await docModel.delAttachById(info[0].attachId);
        let result = await docModel.addUploadInfo(attachInfo);
        let attachId = result.insertId;
        await docModel.updateDoc(id, projectId, attachId);
        res.json({
          code: 200,
          msg: "操作成功",
        });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
let deleteDocInfoById = async (req, res, next) => {
  try {
    let { id } = req.body;
    let info = await docModel.findDocById(id);
    if (info.length === 1) {
      let code = await docModel.deleteDoc(id);
      console.log(code);
      if (code && code.changedRows === 1) {
        res.json({
          code: 200,
          msg: "操作成功",
        });
      } else {
        res.json({
          code: 200,
          msg: "操作成功",
        });
      }
    } else {
      res.json({
        code: 400,
        msg: "数据库中无该数据",
      });
    }
  } catch (err) {
    console.log("err" + err);
    next(err);
  }
};

module.exports = {
  uploadAttach,
  downloadAttachById,
  getDoc,
  getDocInfoByPage,
  addOrUpdateDocInfo,
  deleteDocInfoById,
};
