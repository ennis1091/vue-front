import axios from "axios"; // 注意先安装哦
import qs from "qs"; // 序列化请求数据，视服务端的要求
import config from "./config.js"; // 导入入默认配置
import router from "@/router";
import Cookies from "js-cookie";
// import store from '@/store/'
import Vue from "vue";
import { loginOut } from "@/common/js/dom.js";
let v = new Vue();
let cancel,
  promiseArr = {};
const CancelToken = axios.CancelToken;
//配置全局取消数组
window.__axiosPromiseArr = [];
window.loading = "";

const instance = axios.create(config);
// request 拦截器
instance.interceptors.request.use(
  request => {
    //********1、发起请求时，取消掉当前正在进行的相同请求************
    if (promiseArr[request.url]) {
      promiseArr[request.url]("操作取消");
      promiseArr[request.url] = cancel;
    } else {
      promiseArr[request.url] = cancel;
    }

    //********2、单页应用中在切换页面时应该终止之前的请求！！！！！***********
    // Tip: 1
    // 请求开始的时候可以结合 vuex 开启全屏的 loading 动画
    window.loading = v.$loading();

    // Tip: 2 权限验证
    // 带上 token , 可以结合 vuex 或者重 localStorage
    // if (store.getters.token) {
    // request.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // } else {
    // // 重定向到登录页面
    // }
    request.headers["x-requested-with"] = "XMLHttpRequest";
    if (Cookies.get("token")) {
      request.headers["token"] = Cookies.get("token"); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }

    // Tip: 3
    // 根据请求方法，序列化传来的参数，根据后端需求是否序列化
    if (
      request.method.toLocaleLowerCase() === "post" ||
      request.method.toLocaleLowerCase() === "put" ||
      request.method.toLocaleLowerCase() === "delete"
    ) {
      request.data = qs.stringify(request.data);
    }
    return request;
  },
  error => {
    console.log("request:", error);
    // 请求错误时做些事(接口错误、超时等)
    // Tip: 4
    // 关闭loadding
    setTimeout(() => {
      window.loading.close();
    }, 300);

    // 1.判断请求超时
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      console.log(
        "根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案"
      );
      // return service.request(originalRequest);//例如再重复请求一次
    }
    // 2.需要重定向到错误页面
    const errorInfo = error.response;
    if (errorInfo) {
      // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
      const errorStatus = errorInfo.status; // 404 403 500 ... 等
      router.push({
        path: `/error/${errorStatus}`
      });
    }
    return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
  }
);

// response 响应拦截器
instance.interceptors.response.use(
  response => {
    // 加到时器主要是为了 展示Loading效果 项目中应去除

    window.loading.close();

    let data;
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data == undefined) {
      data = response.request.responseText;
    } else {
      data = response.data;
    }
    // 根据返回的code值来做不同的处理（和后端约定）
    switch (data.errorCode) {
      case 1000:
        v.$message.error("用户名不存在");
        break;
      case 1001:
        v.$message.error("密码错误");
        break;
      case 1005:
        v.$alert("用户超时，请重新登陆", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            loginOut();
          }
        });

        break;
      case 1006:
        v.$alert("token失效，请重新登陆", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            loginOut();
          }
        });
        break;
      case 1007:
        v.$message.error("无权限");
        break;
      case 9999:
        v.$message.error("系统异常");
        break;
      default:
      // v.$message.error(data.message);
    }

    // 若不是正确的返回code，且已经登录，就抛出错误
    // const err = new Error(data.description)

    // err.data = data
    // err.response = response

    // throw err
    return data;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误";
          break;

        case 401:
          err.message = "系统出错";
          break;

        case 403:
          err.message = "拒绝访问";
          break;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          break;

        case 408:
          err.message = "请求超时";
          break;

        case 500:
          err.message = "服务器内部错误";
          break;

        case 501:
          err.message = "服务未实现";
          break;

        case 502:
          err.message = "网关错误";
          break;

        case 503:
          err.message = "服务不可用";
          break;

        case 504:
          err.message = "网关超时";
          break;

        case 505:
          err.message = "HTTP版本不受支持";
          break;

        default:
      }
    }
    console.log(err.config);
    //请求超时的之后，抛出 err.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
    // if (err.code == "ECONNABORTED" && err.message.indexOf("timeout") != -1) {
    //   var config = err.config;
    //   console.log(config.__retryCount);
    //   config.__retryCount = config.__retryCount || 0;

    //   if (config.__retryCount >= config.headers.retry) {
    //     // Reject with the error
    //     //window.location.reload();
    //     return Promise.reject(err);
    //   }

    //   // Increase the retry count
    //   config.__retryCount += 1;
    //   console.log(config.__retryCount);
    //   // Create new promise to handle exponential backoff
    //   console;
    //   var backoff = new Promise(function(resolve) {
    //     setTimeout(function() {
    //       //console.log('resolve');
    //       resolve();
    //     }, config.headers.retryDelay || 1);
    //   });

    //   return backoff.then(function() {
    //     return instance(config);
    //   });
    // } else {
    //   setTimeout(() => {
    //     window.loading.close();
    //   }, 300);
    //   v.$message.error(`${err.message}`);
    //   return Promise.reject(err);
    // }

    if (err.code === "ECONNABORTED") {
      console.log(`A timeout happend on url ${err.config.url}`);
      err.message = "请求超时";
    }
    setTimeout(() => {
      window.loading.close();
    }, 300);
    // 对响应错误做点什么
    // v.$alert(`${err.message},请重新登陆`, '提示', {
    // 	confirmButtonText: '确定',
    // 	callback: action => {
    // 		loginOut()
    // 	}
    // });
    v.$message.error(`${err.message}`);

    return Promise.reject(err); // 返回接口返回的错误信息
  }
);

export default (url = "", data = {}, type = "GET", dataType = "json") => {
  let header = {};
  if (dataType == "json") {
    header = {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json"
    };
  } else if (dataType == "fromdata") {
    header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }
  let options = {
    url,
    headers: header,
    cancelToken: new CancelToken(c => {
      cancel = c;
      window.__axiosPromiseArr.push(cancel); //放入一个全局数组，以便之后在router中统一取消
    })
  };
  type = type.toUpperCase();
  return new Promise((resolve, reject) => {
    if (type === "GET") {
      options = Object.assign(options, {
        method: "get",
        params: data
      });
    } else if (type === "POST") {
      options = Object.assign(options, {
        method: "post",
        data
      });
    }
    instance(options).then(res => {
      resolve(res);
      return false;
    });
  });
};
