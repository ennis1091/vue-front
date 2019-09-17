<template>
  <el-submenu v-if="item.children.length" :index="item.id.toString()">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">{{item.name}}</span>
    </template>
    <template v-for="(m,i) in item.children">
      <MenuItem :item="m" :key="i"></MenuItem>
    </template>
  </el-submenu>
  <div class="menu-wrapper nest-menu" v-else>
    <router-link :to="{path:item.path}">
      <el-menu-item :index="item.path" @click="pushPath(item.path,item.name)">
        <i class="el-icon-location"></i>
        <span>{{item.name}}</span>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapMutations(['set_topnav']),
    pushPath(val, name) {
      console.log('几次？')
      //params是传递的参数
      let obj = {
        url: val,
        name: name
      }

      this.$bus.$emit('todoSth', obj)
      // this.set_topnav(obj)
    }
  }
}
</script>