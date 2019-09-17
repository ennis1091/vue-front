import Vue from "vue";
import Router from "vue-router";
import login from "./views/login.vue";
// import home from './views/Home.vue'
import { clearHttpRequestingList } from "@/common/js/cancel";
import store from "./store";
import Cookies from "js-cookie";

Vue.use(Router);

// {
//   path: '/merchant/ivem/aptitude',
//   name: 'about',
//   component: () => import(/* webpackChunkName: "about" */ './views/merchant/ivem/aptitude.vue')
// }
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: login
    }
    // {
    //   path:'*',
    //   component:{
    // render:h=>h('h1',{},'页面没找到')
    // }
    //}
  ]
});

const whiteList = ["/login"];
let asyncRouter;
router.beforeEach((to, from, next) => {
  clearHttpRequestingList(); // 跳转路由取消全部请求
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token = Cookies.get("token");
  let userRouter = get("USER_ROUTER");

  if (whiteList.indexOf(to.path) !== -1) {
    asyncRouter = null;
    next();
  } else {
    // let userName = sessionStorage.getItem('user')
    console.log(asyncRouter);
    if (token) {
      // 加载动态菜单和路由
      if (!asyncRouter) {
        asyncRouter = userRouter;
        go(to, next);
      } else {
        store.commit("set_userouter", asyncRouter);
        next();
      }
    } else {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({
        name: "login",
        query: {
          redirect: to.fullPath //记录登录前地址
        }
      });
      // next()
    }
  }
});
function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter);
  store.commit("set_userouter", asyncRouter);
  store.commit("set_filrouter", newobj(asyncRouter));
  router.addRoutes(newobj(asyncRouter));
  next({ ...to, replace: true });
}

function get(name) {
  return JSON.parse(localStorage.getItem(name));
}

function filterAsyncRouter(routes) {
  return routes.filter(route => {
    let path = route.url;
    if (path) {
      let component = path.toString().replace(/\s+/g, "");
      if (component.charAt(component.length - 1) == "/") {
        component = component.substr(0, component.length - 1);
      }
      route.component = view(component);
      route.path = component;
    } else {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children);
      }
    }
    return true;
  });
}

function newobj(asyncRouter) {
  let newrouter = [];
  let redirect = "/";
  let title = "首页";
  let allRouter = [];

  asyncRouter.map(function(value, index) {
    if (value.url) {
      if (index == 0) {
        redirect = value.path;
        title = value.name;
      }
      let json = {};
      json.path = value.path;
      json.component = value.component;
      json.meta = {};
      json.meta.title = value.name;
      newrouter.push(json);
    } else {
      if (value.children && value.children.length) {
        value.children.map(function(a, i) {
          if (index == 0 && i == 0) {
            redirect = a.path;
            title = a.name;
          }
          let json = {};
          json.path = a.path;
          json.component = a.component;
          json.meta = {};
          json.meta.title = a.name;
          newrouter.push(json);
        });
      }
    }
  });
  let home = {
    path: "/",
    name: "home",
    component: view("/Home"),
    redirect: redirect,
    meta: {
      title: title
    },
    children: [
      {
        path: "/person",
        name: "person",
        meta: {
          title: "个人中心"
        },
        component: view("/About")
      }
    ]
  };
  let error = {
    path: "*",
    name: "404",
    component: view("/error/404")
  };
  home.children.push(...newrouter);
  allRouter.push(home);
  allRouter.push(error);
  return allRouter;
}

function view(path) {
  return function(resolve) {
    import(/* webpackChunkName: "group-foo" */ `@/views${path}.vue`).then(
      mod => {
        resolve(mod);
      }
    );
  };
}

// router.beforeEach((to, from, next) => {
//    clearHttpRequestingList() // 跳转路由取消全部请求
//   // 登录界面登录成功之后，会把用户信息保存在会话
//   // 存在时间为会话生命周期，页面关闭即失效。
//   let token = Cookies.get('x-token')
//   // let userName = sessionStorage.getItem('user')
//   if (to.path === '/login') {
//     // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
//     if (token) {
//       next({ path: '/' })
//     } else {
//       next()
//     }
//   } else {
//     if (!token) {
//       // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
//       next({
//         name: 'login',
//         query: {
//           redirect: to.fullPath //记录登录前地址
//         }})
//     } else {
//       // 加载动态菜单和路由
//        addDynamicMenuAndRoutes(userName, to, from)
//       next()
//     }
//   }
// })

export default router;
