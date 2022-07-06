const path = require("path");
let uploadDir = path.join(__dirname, "../public/uploadDir/");

function download(req, res, next) {
  let dir = req.url.split("/")[1];
  let newUploadDir = `${uploadDir}${dir}\\`;
  const url = req.query.url;
  res.download(newUploadDir + url, (err) => {
    console.log({ err });
  });
}

module.exports = download;
