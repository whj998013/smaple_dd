// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import bus from './bus.js'
import util from './libs/util.js'
Vue.prototype.$bus = bus;
Vue.prototype.$util = util;
Vue.prototype.$Auth=bus.Auth;
import  { AlertPlugin,LoadingPlugin,ConfirmPlugin } from 'vux';
Vue.use(AlertPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);
FastClick.attach(document.body);
Vue.config.productionTip = false;
/* eslint-disable no-new */
let v=new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box');
Vue.$vux.loading.show({
  text: 'Loading'
 });
