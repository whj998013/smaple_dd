import Vue from 'vue';
import cookie from "./libs/cookie.js"
export default new Vue({
  data() {
    return {
      client: {
        IsPc: false,
        IsDd: false
      },
      currentUser: undefined,
    }
  },
  computed: {
    isLogin() {
      //a2
      return this.currentUser == undefined ? false : true;
    },
    isLimt() {
       return this.Auth("Sample_Dd_ViewAllInfo");
       },
    allSampleCanLend() {
      return this.currentUser.setting.allSampleCanLend;
    },
    enableLimtView(){
        return this.currentUser.setting.enableLimtView;
    },
  },
  methods: {
    Auth(value) {
      if (value) {
        let v = this.currentUser.plist.find(p => p == value);
        if (v != undefined) {
          return true;
        }
      }
      return false;
    },
    setCookieUser(user) {
      this.currentUser = user;
      cookie.setSessionCookie('sgud', JSON.stringify(user), "/");
    },
    getUserBycookie() {
      let userstr = cookie.get('sgud');
      if (userstr) {
        let user = JSON.parse(userstr);
        this.currentUser = user;
        console.log('get User By Cooke Finsh');
      } else {
        cookie.delete('sgud');
      }
    }
  },
  watch: {}
});
