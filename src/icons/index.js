import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 读取所有的.svg文件
const req = require.context('./svg', false, /\.svg$/)
// 将所有svg目录下的所有.svg后缀文件全部引入到项目中
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
