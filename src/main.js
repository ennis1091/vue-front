import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./common/css/base.css";
import "./common/scss/common.scss";
import Cookies from "js-cookie";
import { loginOut } from "@/common/js/dom.js";
import apiList from "@/http/modules/index";
import {
  RadioButton,
  RadioGroup,
  Scrollbar,
  Button,
  Table,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  TableColumn,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Radio,
  Menu,
  Pagination,
  Form,
  FormItem,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Option,
  MessageBox,
  Message,
  Col,
  Row,
  Loading,
  Image
} from "element-ui";

Vue.use(Table);
Vue.use(Image);
Vue.use(Button);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Option);
Vue.use(Col);
Vue.use(Row);
Vue.use(Container);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Radio);
Vue.use(Scrollbar);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$cookie = Cookies;
Vue.prototype.$loading = Loading.service;
Vue.config.productionTip = false;
//导入 http 文件夹下的 index.js
import api from "./http";
Vue.use(api);

let receiveMessageFromIframePage = async event => {
  //iframe 子页面传递数据 此处根据数据信息判断是否回到登录页  http://192.168.0.8

  var origin = event.origin;
  if (/^http:\/\/192.168.0.8$/.test(origin)) {
    //校验event.origin 合法性
    // 此处进行敏感操作
    console.log(event.data, event);
    if (event.data.data.includes("backHome")) {
      router.push({ name: "home" });
    } else if (event.data.data.includes("logOut")) {
      try {
        const res = await apiList.logout();
        console.log(res);
        if (res.errorCode == 1) {
          loginOut();
        } else {
          Message.error("登出失败");
        }
      } catch (err) {
        Message.error("登出失败");
      }
    }
  } else {
    // 当校验不通过，则什么也不做，丢弃此消息
  }
};

window.addEventListener("message", receiveMessageFromIframePage, false); //跨域接收iframe 信息

var bus = new Vue();
var eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = bus;
  }
};
Vue.use(eventBus); //创建全局bus 总线
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
