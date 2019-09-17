<template>
 <el-menu class="el-menu-vertical-demo" background-color="rgb(48, 65, 86)"  text-color="rgb(191, 203, 217)" :default-active="$route.path" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse">
  <template>
      <MenuItem :item="item" :key="index" v-for="(item,index) in $store.state.userRouter"></MenuItem>
  </template>
 </el-menu>
</template>
<script>
import MenuItem from './MenuItem';
export default {
	props:{
		isCollapse:{
			type:Boolean,
			default:false
		}
	},
    components:{
        MenuItem
    }
};
</script>