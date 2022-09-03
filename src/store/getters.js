const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  hrsaasTime: state => state.user.hrsaasTime,
  companyId: state => state.user.userInfo.companyId,
  userInfo: state => state.user.userInfo
}
export default getters
