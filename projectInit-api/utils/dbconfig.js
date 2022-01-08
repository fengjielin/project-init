const mysql = require('mysql');
// 数据库配置
let pool = mysql.createPool({
  host: '119.23.50.91', // 主机地址(默认:localhost)
  port: '3306', // 端口号(默认:3306)
  user: 'root', // 用户名
  password: 'P@ssword', // 密码
  database: 'test' // 数据库名
})

function query(sql, sqlArr) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      conn.query(sql, sqlArr, function (error, res) {
        if (error) {
          return reject(error);
        }
        console.log(sql);
        resolve(JSON.parse(JSON.stringify(res)));
      });
      conn.release();
    })
  })
}

module.exports = query

/**
 * 使用方式
 * sql: mysql语句
 * sqlArr: 参数列表, 一一对应与sql语句中的？
 * callBack: 回调函数
 * dbConfig.sqlConnect(sql, sqlArr, callBack);
 */
// module.exports = {
//   // 连接数据库，使用mysql的连接池方式
//   // 连接池对象
//   sqlConnect: function (sql, sqlArr, callBack) {
//     let pool = mysql.createPool(this.config);
//     // 获取连接
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log('连接失败');
//         return;
//       }
//       // 事件驱动回调
//       conn.query(sql, sqlArr, callBack);
//       // 释放连接
//       conn.release();
//     })
//   }
// }