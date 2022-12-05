import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由组件
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'


Vue.use(VueRouter)



const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/home', component: Home, meta: { needTest: true } }
    ]
})

export default router