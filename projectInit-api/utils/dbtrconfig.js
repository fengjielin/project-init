const mysql = require("mysql");
// 数据库配置
let pool = mysql.createPool({
  host: "119.23.50.91", // 主机地址(默认:localhost)
  port: "3306", // 端口号(默认:3306)
  user: "root", // 用户名
  password: "P@ssword", // 密码
  database: "pm_system", // 数据库名
  //设置超时时间解决握手不活动超时问题
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
});

function query(sql, sqlArr, conn) {
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlArr, function (error, res) {
      if (error) {
        return reject(error);
      }
      console.log(`您查询的SQL参数是:${sqlArr ? sqlArr : ""}`);
      console.log(`您查询的SQL语句是:${sql}`);
      console.log("^_^  ^_^");

      resolve(JSON.parse(JSON.stringify(res)));
    });
  });
}

// 使用事务
function transaction(sqlParamsEntities) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, conn) => {
      if (error) {
        return reject(error);
      } else {
        conn.beginTransaction(function (error) {
          if (error) {
            return reject(error);
          }
          let len = sqlParamsEntities.length;
          console.log("开始执行事务, 共执行" + len + "条数据");
          let funArr = [];
          for (let i = 0; i < sqlParamsEntities.length; i++) {
            const item = sqlParamsEntities[i];
            let temp = query(item.sql, item.params, conn);
            funArr.push(temp);
          }
          Promise.all(funArr)
            .then((values) => {
              conn.commit(function (error, res) {
                conn.release();
                if (error) {
                  conn.rollback(() => {
                    console.log("执行事务失败," + JSON.stringify(error));
                  });
                  reject(error);
                }
                console.log("执行事务结束," + JSON.stringify(res));
                resolve(JSON.parse(JSON.stringify(res)));
              });
            })
            .catch((error) => {
              conn.rollback(() => {
                console.log("执行事务失败");
                conn.release();
              });
              reject(error);
            });
        });
      }
    });
  });
}

module.exports = {
  transaction,
};

// 使用
// let sqlParamsEntity = [
//   {
//     sql: "UPDATE pm_bug_info SET is_del = 1 WHERE id = ?",
//     params: [id],
//   },
//   {
//     sql: "UPDATE pm_bug_info SET is_dl = 1 WHERE id = ?",
//     params: [id],
//   },
// ];
// await transaction(sqlParamsEntity);
