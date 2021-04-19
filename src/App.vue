<template>
  <div id="app">
    <keep-alive include="Home">
      <router-view></router-view>
    </keep-alive>
    <van-tabbar
      route
      fixed
      placeholder
      active-color="#ff5e7f"
      v-show="showTabbar"
    >
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="qr">分类</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="shopping-cart-o"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item to="/profile" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      active: 0,
      tabbarArray: ['Home', 'Category', 'Cart', 'Profile']
    };
  },
  computed: {
    showTabbar () {
      return this.tabbarArray.indexOf(this.$route.name) !== -1 ? true : false
    }
  },
  methods: {
    init () {
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
@import "assets/css/base.css";
#app {
  background-color: #f9faff;
  box-sizing: border-box;
  height: 100vh;
}
</style>
