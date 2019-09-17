<template>
  <div class="login">
    <img class="bor-img" src="@/common/img/border.png" />
    <img class="bg" src="@/common/img/bg.png" />
    <div class="center">
      <h3>
        <span @click="change(1)" :class="{active:submit=='商户登录'}">
          商户登录2
          <i class="bod-1"></i>
        </span>
        <span @click="change(2)" :class="{active:submit=='代理商登录'}">
          代理商登录
          <i class="bod-2"></i>
        </span>
      </h3>
      <div class="content">
        <form action @submit.prevent="onSubmit">
          <div>
            <input type="text" placeholder="手机号" v-model="params.username" />
          </div>
          <div>
            <input type="password" placeholder="密码" v-model="params.password" />
          </div>
          <div class="form-yzm">
            <input type="text" placeholder="验证码" v-model="params.yzm" />
            <el-image
              class="yzm-img"
              src="https://qa-merchant.poseidong.com/web-merchant/common/captcha?r=1568013764530"
            ></el-image>
            <span>
              看不清
              <br />换一张
            </span>
          </div>
          <div>
            <button @click.stop="login" :disabled="isDisable">{{submit}}</button>
          </div>

          <div v-show="forget">
            <router-link to>忘记密码</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'
export default {
  mounted() {
    // localStorage.removeItem('USER_ROUTER')
    // this.SET_USEROUTER('')
  },
  data() {
    return {
      submit: '商户登录',
      isDisable: false,
      params: {
        username: '18667138598',
        password: '1234',
        userType: 'merchant',
        yzm: ''
      }
    }
  },
  computed: {
    forget() {
      return this.submit == '商户登录' ? 1 : 0
    }
  },
  methods: {
    ...mapMutations(['set_userouter']),
    onSubmit() {
      return false
    },
    change(val) {
      if (val == 1) {
        this.submit = '商户登录'
      } else {
        this.submit = '代理商登录'
      }
    },
    login() {
      if (!this.params.username || !this.params.password) {
        this.$message.error('手机号和密码不能为空')
        return
      }
      this.$api.login(this.params).then(res => {
        if (res.errorCode == 1) {
          // this.$cookie.set("token",res.data)
          // localStorage.setItem("login", "1");
          localStorage.setItem('USER_ROUTER', JSON.stringify(res.data.auths))
          // const token=res.data.token
          // this.$cookie.set('token', token);
          //获取回跳的redirect地址
          const redirect = this.$route.query.redirect
          if (redirect) {
            //如果redirect存在说明当前用户是进入某页面后未登陆自动跳转到登陆页面来的，所以登陆完成后得再次回跳到该地址
            this.$router.push(redirect)
          } else {
            //否则跳转到默认的页面，首页或者其他页面
            this.$router.push('/')
          }
        }
      })
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
$fontColor: #bfbfbf;
.login {
  position: relative;
  width: 100%;
  background: linear-gradient(to bottom left, #008cb0, #0044ae);
  background-size: cover;
  height: 100%;
  overflow: hidden;
  .bor-img {
    height: 90%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
  .bg {
    height: 90%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
  .center {
    width: 320px;
    position: absolute;
    right: 8%;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 10;
    background: #f9f9f9;
    border-radius: 10px;
    padding: 40px 25px 30px;
  }
  h3 {
    font-weight: normal;
    span {
      display: inline-block;
      text-align: center;
      width: 50%;
      padding: 12px 0;
      color: #545454;
      font-weight: bold;
      font-size: 18px;
      box-sizing: content-box;
      cursor: pointer;
      position: relative;
    }
    .active {
      color: #359cec;
      i {
        position: absolute;
        height: 5px;
        background: #359cec;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        border-radius: 3px;
      }
      .bod-1 {
        width: 38%;
      }
      .bod-2 {
        width: 45%;
      }
    }
  }
  .content {
    padding: 0px 20px 30px;
    box-sizing: border-box;
    div {
      padding-top: 20px;
      display: flex;
      input {
        padding: 0 12px;
        height: 45px;
        font-size: 15px;
        width: 100%;
        color: #333;
        background: #f5f5f5;
        @include placeholder($fontColor);
        border: 1px solid #eeeeee;
        border-radius: 10px;
      }
      button {
        font-size: 14px;
        flex: 1;
        padding: 15px 0;
        border-radius: 6px;
        border: none;
        background: #359cec;
        color: #fff;
        font-weight: bold;
      }
      a {
        font-size: 14px;
        color: $fontColor;
      }
    }
    .form-yzm {
      .yzm-img {
        margin: 0 5px;
        border-radius: 5px;
        width: 200px;
        overflow: hidden;
        padding: 0;
        img {
          width: 100% !important;
          height: 100%;
        }
      }
      span {
        width: 100px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ed4fd;
        cursor: pointer;
      }
    }
  }
}
</style>
