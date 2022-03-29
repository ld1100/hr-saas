// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

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
  Message.error(error.message) // 引入element中的 Message方法，提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
}) // 响应拦截器
export default service // 导出axios实例
