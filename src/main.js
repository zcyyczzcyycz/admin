import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入vuex
import store from './store'
// 导入axios
import axios from 'axios'
// 引入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入全局css样式
import '@/assets/css/global.css'

// 使用element ui插件
Vue.use(ElementUI);
// 配置axios请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios

// 关闭终端提示
Vue.config.productionTip = false

// 全局导航守卫
router.beforeEach((to, from, next) => {
    //  对含有needTest属性的路由地址进行验证
    if (to.meta.needTest) {
        // 获取token
        const token = sessionStorage.getItem('token')
        if (token) {
            next()
        } else {
            new Vue().$message({
                message: '请先进行登录',
                type: 'warning'
            });
            next('/login')
        }
    }
    next()
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')