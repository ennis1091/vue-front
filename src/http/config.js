/**
 * 默认配置
 */
let BASE_URL = "";
//区分环境的变量
let env =
  process.env.NODE_ENV === "development"
    ? "development"
    : process.env.VUE_APP_TITLE === "alpha"
    ? "alpha"
    : "production";
//根据不同环境配置接口请求地址
if (env === "development") {
  BASE_URL = "";
} else if (env === "alpha") {
  BASE_URL = "";
} else if (env === "production") {
  BASE_URL = "";
}
export default {
  // 基础url前缀
  baseURL: BASE_URL,
  // 请求头信息
  // headers: {
  //     'Content-Type': 'application/json;charset=UTF-8',
  //     'Accept': 'application/json'
  // },
  // 设置超时时间
  timeout: 20000,
  // 携带凭证
  //
  withCredentials: false,
  // 返回数据类型
  responseType: "json"
  // headers: { retry: 4, retryDelay: 1000 }  //请求超时重新请求  使用
};
