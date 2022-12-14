// import { resetRouter } from '@/router'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 初始化用户信息
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
  },
  setUserInfo(state, result) {
    state.userInfo = result //  更新用户信息
  },
  removeUserInfo(state) {
    state.userInfo = {} //  删除用户信息
  }
}
// 执行异步
const actions = {
  //  定义登录action
  async login(context, data) {
    // 经过request中响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data)
    context.commit('setToken', result)
    // 获取token后设置时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId) //  获取用户详情（头像）
    const baseResult = { ...result, ...baseInfo } //  合并两个接口结果
    context.commit('setUserInfo', baseResult) //  提交到mutations执行setUserInfo
    return baseResult //  返回result是为后期做权限需要result
  },
  // 登出action
  async logout(context) {
    context.commit('removeToken') //  删除token
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

