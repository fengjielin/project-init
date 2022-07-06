import axiosApi from "../../utils/api";
let { _post, _get } = axiosApi;

// 分页获取信息
export const getDocInfoByPage = (data = {}) => {
  return _post("doc/getDocInfoByPage", data);
};
// 新增 修改
export const addOrUpdateDocInfo = (data = {}) => {
  return _post("doc/addOrUpdateDocInfo", data);
};
// 删除
export const deleteDocInfoById = (data = {}) => {
  return _post("doc/deleteDocInfoById", data);
};