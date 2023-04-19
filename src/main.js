import Vue from 'vue'
import App from './App.vue'

// 这个是路由管理器的设置
import router from './router'
//这个是全局状态管理器
import store from './store'

import './plugins/element.js'

// 引入的是全局的样式
import './assets/css/global.css'
//添加全局的font组件库
import './assets/font/iconfont.css'

import './plugins/api'

import  './plugins/initHTMLEditor.js'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
