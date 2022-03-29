import router from '@/router' //  权限拦截在路由跳转，导航守卫
import store from '@/store' //  引入store实例，相当于组件中的this.$store
import NProgress from 'nprogress' //  引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404']
//  前置守卫
//  next是前置守卫必须执行的钩子 next()直接通行，next(false)跳转终止，next(地址)跳转到某个地址
router.beforeEach(async(to, from, next) => {
  NProgress.start() //  开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) { // 如果没有id这个值 才会调用 vuex的获取资料的action
        // 为什么要写await 因为我们想获取完资料再去放行
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭进度条，解决有token情况下手动修改地址token不关闭的问题
})

router.afterEach(function() {
  NProgress.done() // 关闭进度条
})

