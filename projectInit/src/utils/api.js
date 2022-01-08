import axios from 'axios';

function request(config) {
  // 1. 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://jsonplaceholder.typicode.com/',
    timeout: 5000
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    // console.log(config);
    return config;
  }, err => {
    console.log(err);
  })

  // 响应拦截器
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res;
  }, err => {
    console.log(err);
  })

  // 2. 发送真正的网络请求
  return instance(config)
}

// 传送json格式的post请求
const postRequest = (url, params) => {
  return request({
    method: 'post',
    url: `${url}`,
    data: params
  })
}

// 传送json格式的get请求
const getRequest = (url, params) => {
  return request({
    method: 'get',
    url: `${url}`,
    data: params
  })
}

// 传送json格式的put请求
const putRequest = (url, params) => {
  return request({
    method: 'put',
    url: `${url}`,
    data: params
  })
}

// 传送json格式的delete请求
const deleteRequest = (url, params) => {
  return request({
    method: 'delete',
    url: `${url}`,
    data: params
  })
}

export default {
  postRequest, getRequest, putRequest, deleteRequest
}