<template>
  <div class="page">
    <el-container style="height:100%">
      <el-header height="50px">
        <div>
          <div
            id="hamburger-container"
            class="hamburger-container"
            style="padding: 0px 15px;"
            @click="collapse"
          >
            <i class="hamburger" :class="[!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold']"></i>
          </div>
          <span>杭州蓄久科技有限公司</span>
          <router-link to="/person">
            <i @click="pushPathS('/person','个人中心')">个人中心</i>
          </router-link>
        </div>
      </el-header>
      <el-container class="content-r">
        <el-aside :style="{width:navwidth}" class="nav-left">
          <el-scrollbar style="height:100%">
            <Menu :isCollapse="isCollapse"></Menu>
          </el-scrollbar>
        </el-aside>
        <el-container class="content-m" :style="{marginLeft:navwidth}">
          <div class="nav-w">
            <div @click="scrollLeft" class="nav-w-l nav-w-btn">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="nav-bar" ref="scrollOut">
              <div class="sum-path" ref="scrollDom" :style="{left:mLeft+'px'}">
                <router-link
                  :to="{path:item.url}"
                  tag="span"
                  v-for="(item,index) in topNav"
                  :key="index"
                  active-class="active"
                  class="s-name"
                  :ref="index"
                  @click.native="moveSpan($event)"
                >
                  {{item.name}}
                  <i
                    class="el-icon-error small-closed"
                    @click.stop="del(index)"
                    v-if="!(index==0)"
                  ></i>
                </router-link>
              </div>
            </div>
            <div class="nav-w-r">
              <span @click="scrollRift" class="nav-w-btn">
                <i class="el-icon-arrow-right"></i>
              </span>
              <el-dropdown trigger="click" class="nav-dropdown" @command="handleCommand">
                <span class="el-dropdown-link">
                  关闭操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus" command="a">关闭全部选项卡</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-circle-plus" command="b">关闭其余选项卡</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span class="s-logout" @click="logOut">
                <i class="el-icon-arrow-right"></i>退出
              </span>
            </div>
          </div>
          <el-main style="padding:10px">
            <router-view></router-view>
          </el-main>
          <el-footer height="36px">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import Menu from '@/components/Menu'
import { loginOut } from '@/common/js/dom.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  created() {
    this.$bus.$on('todoSth', target => {
      console.log(target)
      let a = 1
      this.topNav.map((value, index) => {
        if (value.url == target.url) {
          this.domIndex = index
          a = 0
        }
      })
      console.log(a, 'a')
      this.set_topnav(target)
      if (a) {
        this.$nextTick(() => {
          console.log(this.$refs.scrollDom.offsetWidth)
          let diff =
            this.$refs.scrollOut.offsetWidth - this.$refs.scrollDom.offsetWidth
          if (diff < 0) {
            this.mLeft = diff
          }
        })
      }
    })
  },
  mounted() {
    this.mountedNav(this.filRouter)

    this.set_topnav(this.obj)
    if (this.$route.fullPath != this.filRouter[0].redirect) {
      this.filTile(this.filRouter)
      this.set_topnav(this.currentPath)
    }
    window.onresize = () => {
      this._delMove()
    }
  },
  data() {
    return {
      isCollapse: false,
      currentPath: '',
      mLeft: 0,
      domIndex: 0,
      setLW: [], //每个span offsetLeft和offsetWidth 的集合
      obj: {}
    }
  },
  computed: {
    ...mapGetters(['topNav', 'filRouter']),
    navwidth() {
      let width = '64px'
      if (this.isCollapse) {
        width = '64px'
        return width
      } else {
        width = '200px'
        return width
      }
    }
  },
  methods: {
    ...mapMutations([
      'del_topnav',
      'set_topnav',
      'offall_topnav',
      'offother_topnav'
    ]),
    ...mapActions(['OffTopnav']),
    mountedNav(filRouter) {
      filRouter.map((value, index) => {
        let children = value.children
        if (index == 0) {
          if (children && !children.length) {
            if (value.path && value.meta.title) {
              this.obj.url = value.path
              this.obj.name = value.meta.title
            }
          } else if (children && children.length) {
            this.mountedNav(value.children)
          }
        }
      })
    },
    pushPathS(val, name) {
      console.log('几次？')
      //params是传递的参数
      let obj = {
        url: val,
        name: name
      }

      this.$bus.$emit('todoSth', obj)
      // this.set_topnav(obj)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleCommand(command) {
      switch (command) {
        case 'a':
          this.closedAll()
          break
        case 'b':
          this.closedOther()
          break
        default:
          break
      }
    },
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    del(index) {
      console.log(this.topNav.length - 1)
      this.del_topnav(index)

      this.$nextTick(() => {
        this._delMove()
      })
    },
    scrollLeft() {
      // that.$refs.scrollOut.offsetWidth;
      let diff =
        this.$refs.scrollOut.offsetWidth - this.$refs.scrollDom.offsetWidth
      if (diff < 0) {
        let anIndex = 0
        this.setLW.map((value, index) => {
          if (value.L + this.mLeft <= 0 && value.W + this.mLeft > 0) {
            anIndex = index
          }
        })
        this.mLeft = -(this.setLW[anIndex].W - this.$refs.scrollOut.offsetWidth)
        if (this.mLeft > 0) {
          this.mLeft = 0
        }
      }
    },
    scrollRift() {
      let diff =
        this.$refs.scrollOut.offsetWidth - this.$refs.scrollDom.offsetWidth
      if (diff < 0) {
        let anIndex = 0
        this.setLW.map((value, index) => {
          if (
            value.L + this.mLeft < this.$refs.scrollOut.offsetWidth &&
            value.W + this.mLeft >= this.$refs.scrollOut.offsetWidth
          ) {
            anIndex = index
          }
        })
        if (anIndex > 0) {
          this.mLeft = -this.setLW[anIndex].L
        }
        if (this.mLeft < diff) {
          this.mLeft = diff
        }
      }
    },
    filTile(arrPath) {
      let arr = arrPath.filter(a => {
        return a.path.toString() == this.$route.fullPath.toString()
      })
      if (!arr.length) {
        arrPath.map((value, index) => {
          if (value.children) {
            this.filTile(value.children)
          }
        })
      } else {
        let obj = {
          url: arr[0].path,
          name: arr[0].meta.title
        }
        this.currentPath = obj
      }
    },
    closedAll() {
      this.mLeft = 0
      this.offall_topnav()
    },
    closedOther() {
      this.mLeft = 0
      this.OffTopnav()
    },
    moveSpan(e) {
      let spanL = e.target.offsetLeft + this.mLeft
      let spanW = e.target.offsetWidth
      this._moveSpan(spanL, spanW)
    },
    _moveSpan(spanL, spanW) {
      if (spanL < 0) {
        this.mLeft = this.mLeft - spanL
      } else if (
        spanL >= 0 &&
        spanL + spanW <= this.$refs.scrollOut.offsetWidth
      ) {
        return
      } else if (spanL + spanW > this.$refs.scrollOut.offsetWidth) {
        this.mLeft =
          this.mLeft - (spanL + spanW - this.$refs.scrollOut.offsetWidth)
      }
    },
    async logOut() {
      try {
        const res = await this.$api.logout()
        if (res.errorCode == 1) {
          loginOut()
        } else {
          this.$message.error('登出失败')
        }
      } catch (err) {
        this.$message.error('登出失败')
      }
    },
    _delMove() {
      let anIndex = this.topNav.length - 1
      let lastNav =
        this.$refs[anIndex][0].$el.offsetLeft +
        this.$refs[anIndex][0].$el.offsetWidth

      if (
        lastNav + this.mLeft < this.$refs.scrollOut.offsetWidth &&
        this.mLeft < 0
      ) {
        let diff =
          this.$refs.scrollOut.offsetWidth - this.$refs.scrollDom.offsetWidth
        if (diff > 0) {
          this.mLeft = 0
        } else {
          this.mLeft = diff
        }
      }
    }
  },
  //在vue对象的beforeDestroy钩子中解除bus总线绑定
  beforeDestroy() {
    this.$bus.$off('todoSth')
  },
  watch: {
    topNav: {
      handler() {
        this.setLW = []
        this.$nextTick(() => {
          this.topNav.map((value, index) => {
            let setObj = {}
            setObj.L = this.$refs[index][0].$el.offsetLeft
            setObj.W =
              this.$refs[index][0].$el.offsetLeft +
              this.$refs[index][0].$el.offsetWidth
            this.setLW.push(setObj)
          })
        })
      },
      immediate: true,
      deep: true
    },
    domIndex: {
      handler(newV, oldV) {
        console.log(newV, oldV)
        this.$nextTick(() => {
          let spanL = this.$refs[newV][0].$el.offsetLeft + this.mLeft
          let spanW = this.$refs[newV][0].$el.offsetWidth
          this._moveSpan(spanL, spanW)
        })
      },
      immediate: true
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;

  .nav-left {
    position: fixed;
    top: 50px;
    bottom: 0;
    transition: width 0.3s;
  }
  .el-header {
    overflow: hidden;
    position: relative;
    padding: 0;
    background: #09c;
    color: #fff;
    line-height: 50px;
    font-size: 16px;
    .hamburger-container {
      line-height: 50px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
    }
  }

  .content-m {
    transition: margin-left 0.3s;
    .nav-w {
      display: flex;
      align-items: center;
      border-bottom: #eee 1px solid;
      .nav-bar {
        flex: 1;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        background: #fafafa;
        .sum-path {
          white-space: nowrap;
          position: absolute;
          transition: left 0.5s;
          .s-name {
            display: inline-block;
            height: 100%;
            padding: 0 10px;
            background: #ddd;
            cursor: pointer;
            border-right: 1px solid #e6e6e6;
            color: #999;
            background: #fafafa;
            font-size: 14px;
            &:hover {
              color: #777;
            }
          }

          .active {
            background: #ccc;
            color: #fff;
            &:hover {
              color: #fff;
            }
          }
          .small-closed {
            color: #929292;
            &:hover {
              color: red;
            }
          }
        }
      }

      .nav-w-btn {
        width: 40px;
        display: flex;
        justify-content: center;
        height: 100%;
        align-items: center;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }

      .nav-w-r {
        display: flex;
        flex-direction: row;
        height: 100%;
        .nav-dropdown {
          width: 110px;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        }
        .s-logout {
          display: flex;
          width: 80px;
          font-size: 14px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  position: relative;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
