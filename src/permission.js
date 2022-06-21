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
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes(routes)
        // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        next(to.path)
        // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好
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

