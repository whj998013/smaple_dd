<style scoped>
</style>
<template>
  <div>
  </div>
</template>
<script>
import dd from "dingtalk-jsapi";
import cookie from "../libs/cookie.js";
export default {
  components: {},
  data() {
    return {};
  },

  mounted() {    
    let status = this.$route.params.status;
    if (status == 401) {
      this.$Notice.error({
        title: "连接超时",
        desc: "连接超时或登录失效，正在重新尝试连接登录",
        duration: 5
      });
    }
    this.$bus.isPc = dd.pc;
    this.$bus.isDD = !dd.other;
    console.log('mode:',this.$util.devMode,'url',this.$util.baseURL);
    if(this.$bus.isDD) this.cookinLogin();
    else if(this.$util.devMode) this.PcLogin();
  },

  methods: {
    showServerErrorMsg(e) {
      this.$Notice.error({
        title: "程序错误",
        desc: "无法连接后台服务器，请检查网络或联系开发人员。 " + e,
        duration: 5
      });
    },
    loginFinsh(user) {
      this.$bus.setCookieUser(user);
      this.$router.back(-1);
    },

    cookinLogin() {
      let cookiestr = cookie.get("lh");
      if (cookiestr != null) {
        this.$util
          .post("/login/CookieLogin", { cookie: cookiestr })
          .then(re => {
            if (re.data != null) {
              this.loginFinsh(re.data);
              console.log("cookie登录成功", this.$bus.currentUser);
            } else {
              console.log("cookie失效，开始钉钉登录");
              this.ddLogin();
            }
          })
          .catch(re => {
            console.log("cookie登录错误，尝试钉钉登录");
            this.ddLogin();
          });
      } else {
        console.log("cookie失效，尝试钉钉登录");
        this.ddLogin();
      }
    },
    ddLogin() {
      let _this = this;
      ///钉钉登录
      dd.ready(function() {
        dd.runtime.permission.requestAuthCode({
          corpId: "ding99dd341fc99a25eb", // 企业id
          onSuccess: function(info) {
            console.log("ddinfo", info);
            _this.$util.post("/login/ddlogin", { code: info.code }).then(re => {
              console.log("re", re);
              _this.loginFinsh(re.data);
              ///设置免登cookie
              cookie.set("lh", re.data.LoginCookie, re.data.LoginOverTime);
            });
          }
        });
      });
    },
    PcLogin() {
      let ds = { name: "whj", pwd: "998013" };
      console.log("开始Web登录");
      this.$util
        .post("/login/Weblogin", ds)
        .then(re => {
          if (re.data != null) {       
            this.loginFinsh(re.data);
          } 
        })
        .catch(p => {
          this.showServerErrorMsg(p);  
        });
    }
  }
};
</script>