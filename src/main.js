import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/Lang' // 引入i18n实例
// import { i18n } from 'element-ui'
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives' // 引入自定义指令
Object.keys(directives).forEach(key => {
  // 遍历所有导出的自定义指令对象，完成自定义指令注册
  Vue.directive(key, directives[key])
})
// 引入全局公共组件
import Component from '@/components'

Vue.use(Component) // 注册自己的插件

import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
//打印插件
import Print from 'vue-print-nb'

Vue.use(Print)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// set ElementUI lang to EN
// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
