// import { resetRouter } from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/user'

// 状态
const state = {
  token: getToken() // 设置token初始状态   token持久化 => 放到缓存中
}
// 修改状态
const mutations = {
  //  设置token
  setToken(state, token) {
    state.token = token //  更新state中的token
    setToken(token) //  将token同步给缓存
  },
  //  删除token
  removeToken(state) {
    state.token = null // 清空vuex中的token
    removeToken() //  清空缓存中的token
  }
}
// 执行异步
const actions = {
  //  定义登录action
  async login(context, data) {
    // 经过request中响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data)
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

