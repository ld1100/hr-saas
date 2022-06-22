// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import Breadcrumb from './Breadcrumb'
import UploadExcel from './UploadExcel'
import ScreenFull from './ScreenFull'
import TagsView from './TagsView'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('Breadcrumb', Breadcrumb)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('TagsView', TagsView)
  }
}
