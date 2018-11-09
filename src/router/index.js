import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import bus from '../bus.js'
Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/sampleinfo/:id',
      meta: {
        title: '样品信息',
        requireAuth: true,
      },
      component: (resolve) => require(['../views/sampleinfo.vue'], resolve)
    },
    {
      path: '/',
      name: 'Home',
      meta: {
        requireAuth: true,
      },
      component: Home,
      children: [
        {
          path: '/',
          meta: {
            title: '借样衣',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/lend.vue'], resolve)
        },
        {
          path: '/lend',
          meta: {
            title: '借样衣',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/lend.vue'], resolve)
        },
        {
          path: '/lendlist',
          meta: {
            title: '已借用',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/lendlist.vue'], resolve)
        },
      ]
    },
    {
      path: '/login',
      meta: {
        title: ''
      },
      component: (resolve) => require(['../views/login.vue'], resolve)
    },
    {
      path: '/login/:status',
      meta: {
        title: ''
      },
      component: (resolve) => require(['../views/login.vue'], resolve)
    },
  ]
});
router.beforeEach((to, from, next) => {
  
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (bus.isLogin) { // 判断当前的token是否存在
      next();
    }
    else {
      console.log('No login')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }

});

export default router;