<template>
  <section class="app-main" v-show="requestLoading">
    <div class="request-loading" :class="{'request-loading-show' : requestLoading}">
      <div class="loading-module"></div>
    </div>
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters([
      'requestLoading',
    ]),
  },
}
</script>

<style scoped lang="scss">
.app-main{
  @include bg-fixed(0,0,rgba(0,0,0,.5),10)

}
</style>
