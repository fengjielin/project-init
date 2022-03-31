// 格式化数组形成树形结构  递归
function formatTree(data) {
  let parents = data.filter((p) => p.pid === 0),
    children = data.filter((c) => c.pid !== 0);
  /* 遍历 判断谁是谁的父亲，谁是谁的儿子 */
  dataToTree(parents, children);
  function dataToTree(parents, children) {
    parents.map((p) => {
      children.map((c, i) => {
        if (c.pid === p.id) {
          let _c = JSON.parse(JSON.stringify(children));
          // 因为自身要成为父亲，所有需要把自身给排除出去
          _c.splice(i, 1);
          dataToTree([c], _c);
          // 往 p.children 里面 push c, 因为判断了c.pid === p.id, 说明c 是 p 的而在
          if (p.children) {
            p.children.push(c);
          } else {
            p.children = [c];
          }
        }
      });
    });
  }
  return parents;
}
// 树型结构数组扁平化
function flattenTree(arr) {
  if (!arr || !Array.isArray(arr)) return false;
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].children)) {
      result.push(arr[i]);
      result = result.concat(this.flattenTree(arr[i].children));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
// 判断页码位置，当删除表格的一个元素后，页面数据刚好等于分页尺寸的倍数时，页码才进行减一
function setPageNum(page) {
  if (page.pageNum !== 1 && (page.totalNum - 1) % page.pageSize === 0) {
    page.pageNum -= 1;
  }
}
// 格式化日期 暂时没有对format的判断
function formatDate(timeStamp, format) {
  let time = new Date(timeStamp),
    y = time.getFullYear(),
    m = time.getMonth() + 1,
    d = time.getDate(),
    h = time.getHours(),
    mm = time.getMinutes(),
    s = time.getSeconds(),
    w = time.getDay();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  h = h < 10 ? "0" + h : h;
  mm = mm < 10 ? "0" + mm : mm;
  s = s < 10 ? "0" + s : s;
  let weekMap = {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
  };
  w = weekMap[w];

  return y + "-" + m + "-" + d;
}
// 实现深拷贝
function deepClone(origin, target) {
  let newTarget = target || [];
  // 1.遍历对象
  for (let prop in origin) {
    // 2.判断是否为引用值
    if (origin[prop] !== "null" && typeof origin[prop] == "object") {
      // 3.判断引用值是数组还是对象
      // 4.建立新的数组或对象
      newTarget[prop] =
        Object.prototype.toString.call(origin[prop]) == "[object Array]"
          ? []
          : {};
      // 5.递归调用，实现多层拷贝
      this.deepClone(origin[prop], newTarget[prop]);
    } else {
      newTarget[prop] = origin[prop];
    }
  }
  return newTarget;
}
// Blob转ArrayBuffer
async function readBlobToBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => resolve(loadEvent.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(blob);
  });
}
// ArrayBuffer转Blob
async function readBufferToBlob(buffer) {
  return new Promise((resolve, reject) => {
    try {
      let blob = new Blob([buffer]);
      resolve(blob);
    } catch (error) {
      reject();
    }
  });
}
// 单位转换
function unitChange(limit) {
  let size = "";
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  let sizeStr = size + ""; //转成字符串
  let index = sizeStr.indexOf("."); //获取小数点处的索引
  let dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
  if (dou == "00") {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
}
// 根据文件名获取文档类型
function judgeDocType(filename) {
  let imgExt = [".png", ".jpg", ".jpeg", ".bmp", ".gif"]; //图片文件的后缀名
  let docExt = [".doc", ".docx"]; //word文件的后缀名
  let xlsExt = [".xls", ".xlsx"]; //excel文件的后缀名
  let pdfExt = [".pdf"]; //pdf文件的后缀名
  let isImg = typeMatch(imgExt, filename);
  let isDoc = typeMatch(docExt, filename);
  let isXls = typeMatch(xlsExt, filename);
  let isPdf = typeMatch(pdfExt, filename);
  console.log({ isImg, isDoc, isXls, isPdf });
  let result = { isImg, isDoc, isXls, isPdf };
  return result;
  // 判断类型
  function typeMatch(typeArr, filename) {
    var ext = extension(filename);
    if (contain(typeArr, ext)) {
      return true;
    }
    return false;
  }
  //获取文件名后缀名
  function extension(filename) {
    let suffix = "";
    let name = filename.toLowerCase();
    let i = name.lastIndexOf(".");
    if (i > -1) {
      suffix = name.substring(i);
    }
    return suffix;
  }
  //判断Array中是否包含某个值
  function contain(typeArr, obj) {
    for (let i = 0; i < typeArr.length; i++) {
      if (typeArr[i] === obj) return true;
    }
    return false;
  }
}
// 根据出生日期计算年龄; strBirthday：出生日期，格式为"1996-12-15"
function getAgeByBirthday(strBirthday) {
  var returnAge,
    strBirthdayArr = strBirthday.split("-"),
    birthYear = strBirthdayArr[0],
    birthMonth = strBirthdayArr[1],
    birthDay = strBirthdayArr[2],
    noeDate = new Date(),
    nowYear = noeDate.getFullYear(),
    nowMonth = noeDate.getMonth() + 1,
    nowDay = noeDate.getDate();
  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0周岁
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge; //返回周岁年龄
}
// 获取身份证号码里的信息
function getInfoByCardNum(cardNum) {
  if (cardNum != null) {
    //获取出生日期
    console.log(
      `${cardNum.substring(6, 10)}-${cardNum.substring(
        10,
        12
      )}-${cardNum.substring(12, 14)}`
    );
    //获取性别
    parseInt(cardNum.substr(16, 1)) % 2 == 1
      ? console.log("男")
      : console.log("女");
    //获取年龄
    let myDate = new Date();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let age = myDate.getFullYear() - cardNum.substring(6, 10) - 1;
    if (
      cardNum.substring(10, 12) < month ||
      (cardNum.substring(10, 12) == month && cardNum.substring(12, 14) <= day)
    ) {
      age++;
    }
    console.log(age);
  }
}
// 校验身份证号
function isValidateCard(str) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(str);
}
// 校验电子邮箱
function isValidateMail(value) {
  var isMail =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; //电子邮箱
  if (isMail.test(value)) {
    return true;
  } else {
    return false;
  }
}
// 校验手机号与座机号
function isValidatePhone(val) {
  var isPhone =
    /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //手机号码
  var isMob = /^0\d{2,3}-?\d{7,8}$/; // 座机格式 区号之后用'-'隔开
  if (isMob.test(val) || isPhone.test(val)) {
    return true;
  } else {
    return false;
  }
}
/** 分页数据处理函数
 *
 * @param {*} number 当前页
 * @param {*} pageSize 每页的大小
 * @param {*} data 需要分页的数据
 * @returns
 */
function pageDataFn(number, pageSize, data) {
  let pagedata = []; //保存每页数据的数组
  //pageSize 每页条数
  let start = pageSize * number - pageSize; //设置开始
  let end = pageSize * number; // 设置结束长度
  end = end > data.length ? data.length : end;
  for (let i = start; i < end; i++) {
    //所有分页数据 data
    pagedata.push(data[i]);
  }
  return pagedata;
}

let util = {
  formatTree,
  flattenTree,
  formatDate,
  setPageNum,
  deepClone,
  readBlobToBuffer,
  readBufferToBlob,
  unitChange,
  judgeDocType,
  getAgeByBirthday,
  getInfoByCardNum,
  isValidateCard,
  isValidateMail,
  isValidatePhone,
  pageDataFn,
};

export default util;
