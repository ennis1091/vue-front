/*
包含多个基于state的getter计算属性的对象
 */
export default {
  requestLoading: state => {
    return state.requestLoading;
  },
  userRouter: state => {
    return state.userRouter;
  },
  filRouter: state => {
    return state.filRouter;
  },
  topNav: state => {
    return state.topNav;
  }
};
