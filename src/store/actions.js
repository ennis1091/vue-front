/*
通过mutation间接更新state的多个方法的对象
 */
import router from "@/router";
import { SET_LOADING, OFFAll_TOPNAV, OFFOTHER_TOPNAV } from "./mutation-types";

export default {
  SetLoading({ commit }, boolean) {
    commit(SET_LOADING, boolean);
  },
  OffTopnav({ state, commit }) {
    if (state.topNav.length > 1) {
      if (router.currentRoute.fullPath == state.topNav[0].url) {
        commit(OFFAll_TOPNAV);
      } else if (
        state.topNav.length < 3 &&
        router.currentRoute.fullPath != state.topNav[0].url
      ) {
        return;
      } else {
        let currObj;
        let disArr = [];
        disArr.push(state.topNav[0]);
        state.topNav.map((value, index) => {
          if (router.currentRoute.fullPath == value.url) {
            currObj = value;
          }
        });
        disArr.push(currObj);
        commit(OFFOTHER_TOPNAV, disArr);
      }
    }
  }
};
