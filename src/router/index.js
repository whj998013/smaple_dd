import Vue from 'vue'
import Router from 'vue-router'
import SampleHome from '@/views/sample/home'
import ProofHome from '@/views/proof/home'

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
      component: (resolve) => require(['../views/sample/sampleinfo.vue'], resolve)
    },
    {
      path: '/proof',
      meta: {
        title: '打样单',
        requireAuth: true,
      },
      component: ProofHome,
      children: [
        {
          path: '/proof',
          meta: {
            title: '样衣库',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/proof/prooftask.vue'], resolve)
        },
        {
          path: '/proof/prooftask',
          meta: {
            title: '样衣库',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/proof/prooftask.vue'], resolve)
        },
        {
          path: '/proof/oldProofTask',
          meta: {
            title: '样衣库',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/proof/oldProofTask.vue'], resolve)
        },

      ]
    },

    //样衣管理
    {
      path: '/',
<<<<<<< HEAD
     
=======
>>>>>>> master
      meta: {
        requireAuth: true,
      },
      component: SampleHome,
      children: [
        {
          path: '/',
          meta: {
            title: '样衣库',
<<<<<<< HEAD
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sampleList.vue'], resolve)
        },
        {
          path: '/sampleList',
          meta: {
            title: '样衣库',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sampleList.vue'], resolve)
=======
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sample/sampleList.vue'], resolve)
        },
        {
          path: '/sampleList',
          meta: {
            title: '样衣库',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sample/sampleList.vue'], resolve)
>>>>>>> master
        },
        {
          path: '/lend',
          meta: {
            title: '借样衣',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sample/lend.vue'], resolve)
        },
        {
          path: '/lendlist',
          meta: {
            title: '已借用',
            requireAuth: true,
          },
          component: (resolve) => require(['../views/sample/lendlist.vue'], resolve)
        },
      ]
    },
    //登录管理
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