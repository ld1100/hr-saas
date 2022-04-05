import Cookies from 'js-cookie'
// import { time } from 'mockjs/src/mock/random/date'
// import Da from "element-ui/src/locale/lang/da";

const TokenKey = 'hrsaas-ihrm-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const timeKey = 'hrsaas-timestamp-key'
//  读取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
//  设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
