import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    requestLoading: 0,
    userRouter:'',
    filRouter:'',
    topNav:[]
  },
  getters:{
    requestLoading: state => {
      return state.requestLoading
    },
    userRouter: state => {
      return state.userRouter
    },
    filRouter: state => {
      return state.filRouter
    },
    topNav: state => {
      return state.topNav
    }
  },
  mutations: {
    SET_LOADING: (state, boolean) => {
      boolean ? ++state.requestLoading : --state.requestLoading
    },
    SET_USEROUTER: (state, userRouter) =>{
      state.userRouter = userRouter
    },
    SET_FILROUTER: (state, filRouter) => {
      state.filRouter = filRouter
    },
    SET_TOPNAV: (state, arr) => {
      let on=1
      state.topNav.map((value,index) => {
        if(value.url == arr.url){
          on=0
        }
      })
      if (on){
        state.topNav.push(arr)
      }
    },
    DEL_TOPNAV: (state,index) => {
      console.log(router.currentRoute.fullPath)
      if (state.topNav[index].url == router.currentRoute.fullPath){
        state.topNav.splice(index,1)
        let anIndex=0
        if (state.topNav[index]) {
          anIndex=index
        }else{
          anIndex = index-1
        }
        router.replace({
          path: state.topNav[anIndex].url
        })
      }else{
        state.topNav.splice(index, 1)
      }
      
    },
    OFFAll_TOPNAV: (state) => {
      let leng = state.topNav.length-1
      if (leng>0){
        state.topNav.splice(1, leng)
        router.replace({
          path: state.topNav[0].url
        })
      }
    },
    OFFOTHER_TOPNAV: (state,disArr) => {
      state.topNav = disArr
    }
  },
  actions: {
    SetLoading({ commit }, boolean) {
      commit('SET_LOADING', boolean)
    },
    OffTopnav({ state,commit }){
       if (state.topNav.length>1){
         if (router.currentRoute.fullPath == state.topNav[0].url){
           commit('OFFAll_TOPNAV')
          }else if (state.topNav.length < 3 && router.currentRoute.fullPath != state.topNav[0].url){
            return
          }else{
           let currObj
           let disArr=[] 
           disArr.push(state.topNav[0])
           state.topNav.map((value,index) => {
             if (router.currentRoute.fullPath == value.url){
               currObj = value
             }
           })
           disArr.push(currObj)
           commit('OFFOTHER_TOPNAV',disArr)
          }
      }
    }
  }
})
