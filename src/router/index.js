import Vue from 'vue'
import VueRouter from 'vue-router'

// 添加这个Login组件
import Login from '../components/Login.vue'

import Register from '../components/Register.vue'

// import Welcome from '../components/common/Welcome.vue'
import Home from '../components/Home.vue'
import UpdatePassword from '../components/common/UpdatePassword.vue'
import Welcome from '../components/common/Welcome.vue'

//admin下面的两个功能
import UserManage from '../components/system/UserManage.vue'
import RoleManage from '../components/system/RoleManage.vue'
import PermManage from '../components/system/PermManage.vue'
import LogManage from '../components/system/LogManage.vue'


//平常的一些功能的修改的操作
import UploadUserInfo from '../components/common/UploadUserInfo.vue'


//信息配置页面
import Menu from '../components/bus/Menu.vue'
import Customer from '../components/bus/Customer.vue'

//菜单项
import CusView from '../components/bus/CusView.vue'
import CusCar from '../components/bus/CusCar.vue'
import CustOrder from '../components/bus/CustOrder.vue'

import MenuTop from '../components/bus/MenuTop.vue'
import SaleReport from '../components/bus/SaleReport.vue'









Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [

      {
        path: '/updatePassword',
        component: UpdatePassword
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user',
        component: UserManage
      },
      {
        path: '/perm',
        component: PermManage
      },
      {
        path: '/roles',
        component: RoleManage
      },
      {
        path: '/uploadUserInfo',
        component: UploadUserInfo
      },
      {
        path: '/log',
        component: LogManage
      },
      {
        path: '/menu',
        component: Menu
      },
      {
        path: '/cus',
        component: Customer
      },
      {
        path: '/cusview',
        component: CusView
      },
      {
        path: '/car',
        component: CusCar
      },
      {
        path: '/custorder',
        component: CustOrder
      },
      {
        path: '/orderlist',
        component: CustOrder
      },
      {
        path: '/top',
        component: MenuTop
      },
      {
        path: '/sale',
        component: SaleReport
      },
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //to 将要访问
  //from 从哪进行访问
  //next 重定向这个url next() 继续访问。to的路径
  if (to.path == '/login' || to.path == '/register') return next(); //如果是访问这个login，那么就放行，然后执行之后的操作，也就是说这个是首页
  const userFlag = window.sessionStorage.getItem("user"); //如果不是首页，那么就判断这个信息是不是有这个sessionStorage里面进行判断，
  if (!userFlag) { //没有这个信息
    return next('/login') //转到登录的地方去，无值返回到登陆页面    //如果没有，那么就到登录的页面
  }
  next(); //有值，那么就直接进行放行
})





export default router