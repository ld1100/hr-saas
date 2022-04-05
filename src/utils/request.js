// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600

const service = axios.create(
  {
    baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础地址，可通过.env.development或者.env.production文件进行设置
    timeout: 5000
  }
) // 创建一个axios的实例
service.interceptors.request.use(config => {
  //  config是请求的配置信息
  //  注入token
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      store.dispatch('user/logout') // 登出操作
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = 'Bearer ' + store.getters.token
  }
  //  必须返回config
  return config
}, error => {
  return Promise.reject(error)
}

) // 请求拦截器

service.interceptors.response.use(response => {
  //  从response中解构出需要的数据
  const { success, message, data } = response.data // axios中默认加了一层data
  if (success) {
    return data
  } else { // success为false
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // 被动接收超时
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 引入element中的 Message方法，提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
}) // 响应拦截器

// token超时检测
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
