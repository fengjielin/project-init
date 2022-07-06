const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
// https://www.npmjs.com/package/formidable
// https://github.com/node-formidable/formidable

function upload(req, res, uploadDir) {
  return new Promise((resolve, reject) => {
    if (!isFormData(req)) {
      // res.statusCode = 400;
      // res.end("错误的请求, 请用multipart/form-data格式");
      return reject({ message: "错误的请求, 请用multipart/form-data格式" });
    }
    // 创建目录
    let dir = req.url.split("/")[1];
    if (!fs.existsSync(uploadDir + dir)) {
      fs.mkdirSync(uploadDir + dir);
    }

    let newUploadDir = `${uploadDir}${dir}\\`;
    let options = {
      uploadDir: newUploadDir,
      keepExtensions: true,
      multiples: true,
    };
    const form = formidable(options);
    // Parses an incoming Node.js request containing form data. If callback is provided, all fields and files are collected and passed to the callback.
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      console.log(files);
      // 重命名文件
      let file = files.file;
      let types = file.originalFilename.split(".");
      let suffix = types[types.length - 1];
      let newFileName = new Date().getTime() + "." + suffix;
      fs.renameSync(file.filepath, newUploadDir + newFileName);
      let attachInfo = {
        attachName: file.originalFilename,
        attachUrl: `${dir}/${newFileName}`,
        uploadTime: file.lastModifiedDate,
        size: file.size,
      };
      resolve(attachInfo);
    });

    // Emitted after each incoming chunk of data that has been parsed. Can be used to roll your own progress bar.
    form.on("progress", (bytesReceived, bytesExpected) => {
      var percent = Math.floor((bytesReceived / bytesExpected) * 100);
      console.log(`上传进度 --> ${percent}`);
    });

    // Emitted whenever a new file is detected in the upload stream. Use this event if you want to stream the file to somewhere else while buffering the upload on the file system.
    form.on("fileBegin", (formName, file) => {});

    // Emitted whenever a field / file pair has been received. file is an instance of File.
    form.on("file", (name, file) => {});

    // Emitted whenever a field / value pair has been received.
    form.on("field", (field, value) => {
      console.log("field");
      console.log(field);
      console.log(value);
    });

    // Emitted when the request was aborted by the user. Right now this can be due to a 'timeout' or 'close' event on the socket. After this event is emitted, an error event will follow. In the future there will be a separate 'timeout' event (needs a change in the node core).
    form.on("aborted", () => {});

    // Emitted when there is an error processing the incoming form. A request that experiences an error is automatically paused, you will have to manually call request.resume() if you want the request to continue firing 'data' events. May have error.httpCode and error.code attached.
    form.on("error", (err) => {
      return reject(err);
    });

    // Emitted when the entire request has been received, and all contained files have finished flushing to disk. This is a great place for you to send your response.
    form.on("end", () => {
      console.log("上传完成!");
    });
  });
}
function isFormData(req) {
  let type = req.headers["content-type"] || "";
  return type.includes("multipart/form-data");
}

module.exports = upload;
