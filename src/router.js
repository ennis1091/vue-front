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
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children);
      }
    } else {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children);
      }
    }
    return true;
  });
}

function newobj(asyncRouter) {
  let redirect = {
    //实参和形参，传递对象引用类型 形参修改实参会同步修改
    url: "/",
    title: "首页"
  };
  let allRouter = [];
  let newRouterSon = filterAsyncRouterSon(asyncRouter);

  routerChildren(newRouterSon);
  newRouterSon.map((value, index) => {
    if (index == 0) {
      redirect.url = value.path;
      redirect.title = value.name;
    }
  });
  let home = {
    path: "/",
    name: "home",
    component: view("/Home"),
    redirect: redirect.url,
    meta: {
      title: redirect.title
    },
    children: []
  };
  let error = {
    path: "*",
    name: "404",
    component: view("/error/404")
  };
  let person = {
    path: "/person",
    name: "person",
    meta: {
      title: "个人中心"
    },
    component: view("/About")
  };
  home.children.push(...newRouterSon);
  home.children.push(person);
  allRouter.push(home);
  allRouter.push(error);
  return allRouter;
}

function filterAsyncRouterSon(asyncRouter) {
  //去除第一层无url 的标签
  let filterRouter = [];

  asyncRouter.map((value, index) => {
    if (value.url && !value.children.length) {
      filterRouter.push(value);
    } else {
      value.children.map((a, i) => {
        filterRouter.push(a);
      });
    }
  });
  return filterRouter;
}

function routerChildren(asyncRouter, redirect) {
  asyncRouter.map((value, index) => {
    if (value.url) {
      value.meta = {};
      value.meta.title = value.name;
      if (value.children && value.children.length) {
        value.children.map((v, i) => {
          if (i == 0) {
            value.redirect = v.path;
            value.meta.title = v.name;
          }
        });
        routerChildren(value.children);
      }
    }
  });
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

export default router;
