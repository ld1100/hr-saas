const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  userId: state => state.user.userInfo.userId, // 建立用户id的映射
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes // 导出当前的路由
}
export default getters
