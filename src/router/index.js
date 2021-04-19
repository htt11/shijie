import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from 'views/home/Home.vue'
import Category from 'views/category/Category'
import Cart from 'views/cart/Cart'
import Profile from 'views/profile/Profile'
import UserInfo from 'views/profile/UserInfo'
import Search from 'views/search/Search'
import Detail from 'views/detail/Detail'
import Comment from 'views/detail/comment'
import GoodsList from 'views/goodsList/GoodsList'
import Login from 'views/login/Login'
import Register from 'views/register/Register'

import Address from 'views/address/Address'
import AddAddress from 'views/address/AddAddress'
import Collect from 'views/collect/Collect'
import Order from 'views/order/Order'
import MyOrder from 'views/order/MyOrder'
import Refund from 'views/order/Refund'

import AdminUser from 'views/Admin/user'
import AdminOrder from 'views/Admin/order'


// 1.安装VueRouter
Vue.use(VueRouter)

// 2.配置路由信息
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/category',
    name: 'Category',
    component: Category
  },
  {
    path: '/cart',
    name:'Cart',
    component: Cart
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/comment/:id',
    name: 'Comment',
    component: Comment
  },
  {
    path: '/goodsList/:type',
    name: 'GoodsList',
    component: GoodsList
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: UserInfo
  },
  {
    path: '/address',
    name: 'Address',
    component: Address
  },
  {
    path: '/addAddress',
    name: 'AddAddress',
    component: AddAddress
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/myOrder',
    name: 'MyOrder',
    component: MyOrder
  },
  {
    path: '/refund',
    name: 'Refund',
    component: Refund
  },
  {
    path: '/adminUser',
    name: 'AdminUser',
    component: AdminUser
  },
  {
    path: '/adminOrder',
    name: 'AdminOrder',
    component: AdminOrder
  }
]

// 3.创建路由对象
const router = new VueRouter({
  mode: 'history',
  routes
})

// 4.导出
export default router
