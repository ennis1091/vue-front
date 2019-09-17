/*
直接更新state的多个方法的对象
 */
import router from "@/router";
import {
  SET_LOADING,
  SET_USEROUTER,
  SET_FILROUTER,
  SET_TOPNAV,
  DEL_TOPNAV,
  OFFAll_TOPNAV,
  OFFOTHER_TOPNAV,
  CLEAR_TOPNAV
} from "./mutation-types";

export default {
  [SET_LOADING]: (state, boolean) => {
    boolean ? ++state.requestLoading : --state.requestLoading;
  },
  [SET_USEROUTER]: (state, userRouter) => {
    state.userRouter = userRouter;
  },
  [SET_FILROUTER]: (state, filRouter) => {
    state.filRouter = filRouter;
  },
  [SET_TOPNAV]: (state, arr) => {
    let on = 1;
    state.topNav.map((value, index) => {
      if (value.url == arr.url) {
        on = 0;
      }
    });
    if (on) {
      state.topNav.push(arr);
    }
  },
  [DEL_TOPNAV]: (state, index) => {
    console.log(router.currentRoute.fullPath);
    if (state.topNav[index].url == router.currentRoute.fullPath) {
      state.topNav.splice(index, 1);
      let anIndex = 0;
      if (state.topNav[index]) {
        anIndex = index;
      } else {
        anIndex = index - 1;
      }
      router.replace({
        path: state.topNav[anIndex].url
      });
    } else {
      state.topNav.splice(index, 1);
    }
  },
  [OFFAll_TOPNAV]: state => {
    let leng = state.topNav.length - 1;
    if (leng > 0) {
      state.topNav.splice(1, leng);
      router.replace({
        path: state.topNav[0].url
      });
    }
  },
  [OFFOTHER_TOPNAV]: (state, disArr) => {
    state.topNav = disArr;
  },
  [CLEAR_TOPNAV]: state => {
    state.topNav = [];
  }
};
