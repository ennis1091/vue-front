import router from "@/router";
import Cookies from "js-cookie";
import store from "@/store";
// import Vue from 'vue'
// let v = new Vue();
export const loginOut = () => {
  Cookies.remove("token");

  store.commit("set_userouter", "");
  store.commit("clear_topnav"); //重置小导航

  localStorage.removeItem("USER_ROUTER");
  if (window.location.href.indexOf("/login") !== -1) {
    router.go(0);
  } else {
    router.push({
      path: "/login"
    });
  }
};
