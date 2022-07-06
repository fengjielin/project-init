const db = require("../../utils/dbconfig");
const { transaction } = require("../../utils/dbtrconfig");

let docModel = {
  addUploadInfo: async (attachInfo) => {
    let { attachName, attachUrl, uploadTime, size } = attachInfo;
    let sql = `
      INSERT INTO base_attach 
        (attach_name, attach_url, upload_time,size) 
      VALUES (?,?,?,?)`;
    let result = await db(sql, [attachName, attachUrl, uploadTime, size]);
    return result;
  },
  findAttachById: async (id) => {
    let sql = `
      SELECT
        ba.id,
        ba.attach_name AS attachName,
        ba.attach_url AS attachUrl,
        ba.upload_time AS uploadTime
      FROM
        base_attach ba
      WHERE
        ba.id = ?
      AND ba.status_cd = "S01";`;
    let result = await db(sql, [id]);
    return result;
  },
  delAttachById: async (id) => {
    let sql = `delete from base_attach where id = ?`;
    let result = await db(sql, [id]);
    return result;
  },
  updateStatusAttach: async (id) => {
    let sql = `UPDATE base_attach SET status_cd = 'S02' WHERE id = ?`;
    let result = await db(sql, [id]);
    return result;
  },

  getDocInfoByPage: async (pageNum, pageSize, projectId, keyword = null) => {
    // 包含模糊查询
    let sql = `
        SELECT
          pd.id,
          pd.create_time AS createTime,
          pd.update_time AS updateTime,
          pd.project_id AS projectId,
          pd.attach_id AS attachId,
          pd.creator_id AS creatorId,
          pp.project_name AS projectName,
          su. NAME AS creatorName,
          ba.attach_name AS attachName,
          ba.attach_url AS attachUrl,
          ba.size AS attachSize
        FROM
          pm_doc_info pd
        LEFT JOIN pm_project_info pp ON pp.id = pd.project_id
        LEFT JOIN sys_user_info su ON su.id = pd.creator_id
        LEFT JOIN base_attach ba ON ba.id = pd.attach_id
        WHERE
          pd.project_id = ?
        AND pd.status_cd = 'S01'
        AND ba.status_cd = 'S01'
        AND pp.is_del = 0
        AND su.is_del = 0 ${
          keyword
            ? "AND ba.attach_name LIKE CONCAT(CONCAT('%','" + keyword + "'),'%')"
            : ""
        } LIMIT ?,?`;
    let result = await db(sql, [projectId, pageNum, pageSize]);
    return result;
  },
  findCount: async (projectId, keyword = null) => {
    // 包含模糊查询
    let sql = `SELECT count(pd.id) AS count 
      FROM 
        pm_doc_info pd 
      LEFT JOIN base_attach ba ON ba.id = pd.attach_id
      WHERE
        pd.project_id = ? AND pd.status_cd = 'S01' ${
          keyword
            ? "AND ba.attach_name LIKE CONCAT(CONCAT('%','" + keyword + "'),'%')"
            : ""
        } `;
    let result = await db(sql, [projectId]);
    return result;
  },
  findDocById: async (id) => {
    let sql = `
      select 
        pd.id,
        pd.create_time AS createTime,
        pd.update_time AS updateTime,
        pd.project_id AS projectId,
        pd.attach_id AS attachId,
        pd.creator_id AS creatorId
      from pm_doc_info pd
      where id = ? AND status_cd = 'S01'`;
    let result = await db(sql, [id]);
    return result;
  },
  insertDoc: async (projectId, attachId, creatorId) => {
    let createTime = new Date();
    let sql = `INSERT INTO pm_doc_info 
        ( project_id, attach_id, creator_id, create_time, update_time) 
      VALUES (?,?,?,?,?)`;
    let paramsArr = [projectId, attachId, creatorId, createTime, createTime];
    let result = await db(sql, paramsArr);
    return result;
  },
  updateDoc: async (id, projectId, attachId) => {
    let updateTime = new Date();
    let sql = `UPDATE pm_doc_info 
      SET 
        project_id = ?, attach_id = ?, update_time = ?
      WHERE id = ?`;
    let paramsArr = [projectId, attachId, updateTime, id];
    let result = await db(sql, paramsArr);
    return result;
  },
  deleteDoc: async (id) => {
    let sql = `UPDATE pm_doc_info SET status_cd = 'S02' WHERE id = ?`;
    let result = await db(sql, [id]);
    return result;
  },
  dealBug: async (id, dealType, dealDate, dealRemark) => {
    let switchDealDate = new Date(dealDate);
    let sql = `UPDATE pm_bug_info SET 
        bug_status = 'S02',deal_type = ?,deal_date = ?,deal_remark = ?  
      WHERE id = ?`;
    let result = await db(sql, [
      dealType,
      switchDealDate,
      dealRemark ? dealRemark : null,
      id,
    ]);
    return result;
  },
};

module.exports = { docModel };
