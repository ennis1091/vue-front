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
  let redirect = {
    //实参和形参，传递对象引用类型 形参修改实参会同步修改
    url: "/",
    title: "首页"
  };
  let allRouter = [];
  routerChildren(asyncRouter, redirect, newrouter, 0);
  let home = {
    path: "/",
    name: "home",
    component: view("/Home"),
    redirect: redirect.url,
    meta: {
      title: redirect.title
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

function routerChildren(asyncRouter, redirect, newrouter, num) {
  if (num == 0) {
    asyncRouter.map((value, index) => {
      if (value.url && !value.children.length) {
        if (index == 0) {
          redirect.url = value.path;
          redirect.title = value.name;
        }
        let newJson = jsonObj(value, "");
        newrouter.push(newJson);
      } else if (value.url && value.children.length) {
        let redirectArr = [];
        value.children.map((k, j) => {
          if (k.url && !value.children.length) {
            redirectArr.push(k.url);
          }
        });
        let newJson = jsonObj(value, redirectArr);
        newrouter.push(newJson);
      } else {
        if (value.children && value.children.length) {
          value.children.map((a, i) => {
            if (index == 0 && i == 0) {
              redirect.url = a.path;
              redirect.title = a.name;
            }
            let newJson = jsonObj(a, "");
            newrouter.push(newJson);
          });
        }
      }
    });
  }
}

function jsonObj(value, redirectArr) {
  let json = {};
  if (redirectArr) {
    json.redirect = redirectArr[0];
  }
  json.path = value.path;
  json.component = value.component;
  json.meta = {};
  json.meta.title = value.name;
  return json;
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
