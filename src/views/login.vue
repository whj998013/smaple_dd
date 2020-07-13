<style scoped>
</style>
<template>
  <div>
  </div>
</template>
<script>
import dd from "dingtalk-jsapi";
import cookie from "../libs/cookie.js";
import loginApi from "../libs/loginApi.js";
import { debug } from 'util';

export default {
  components: {},
  data() {
    return {
      redirect: "",
    };
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
     
    if (this.$bus.isDD)
      loginApi
        .beginLogin()
        .then(re => {
          //登录成功
          let redirect = this.$route.query.redirect;
          console.log("redurl:", redirect);
          if (redirect) {
            this.$router.push(redirect);
          } else {
            this.$router.push("/");
          }
        })
        .catch(re => {
          //登录失败
          console.log("login error result:", re);
          this.isWebLogin = true;
        });
    else if (this.$util.devMode) this.PcLogin();
  },

  methods: {
    showServerErrorMsg(e) {
      this.$Notice.error({
        title: "程序错误",
        desc: "无法连接后台服务器，请检查网络或联系开发人员。 " + e,
        duration: 5
      });
    },
    PcLogin() {
      let ds2 = { name: "ymn", pwd: "123456" };
      let ds = { name: "whj", pwd: "998013" };

      console.log("开始Web登录");
      this.$util
        .post("/login/Weblogin", ds)
        .then(re => {
          if (re.data != null) {
            loginApi.loginFinsh(re.data);
            let redirect = this.$route.query.redirect;
            console.log("redurl:", redirect);
            if (redirect) {
              this.$router.push(redirect);
            } else {
              this.$router.push("/");
            }
          }
        })
        .catch(p => {
          this.showServerErrorMsg(p);
        });
    }
  }
};
</script>