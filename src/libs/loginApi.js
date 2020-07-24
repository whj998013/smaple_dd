import dd from "dingtalk-jsapi";
import cookie from "./cookie.js";
import vue from "vue";
import bus from "../bus.js";
import Util from './util';

let loginApi = {
    isLoginNow:false,
    beginLogin() {

        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.cookieLogin().then(re => {
                _this.loginFinsh(re);
                resolve(re);
            }).catch(errorInfo => {
                console.log("尝试钉钉登录：", errorInfo);
                if (!dd.other) {
                    _this.ddLogin().then(re => {
                        _this.loginFinsh(re);
                        resolve(re);
                    });
                } else {
                    reject("非钉钉用户");
                }
            });
        })
    },

    
    loginFinsh(user) {
        ///设置免登cookie
        cookie.set("lh", user.LoginCookie, user.LoginOverTime);
        bus.setCookieUser(user);
        // bus.getSystemSetting();

    },

    cookieLogin() {
        return new Promise(function (resolve, reject) {
            let cookiestr = cookie.get("lh");
            console.log("cookid:" + cookiestr);
            if (cookiestr != null) {
                Util.post("apiaction/login/CookieLogin", {
                        cookie: cookiestr
                    })
                    .then(re => {
                        if (re.data != null) {
                            console.log("cookie登录成功");
                            resolve(re.data);
                        } else {
                            console.log("cookie失效，开始钉钉登录");
                            reject("");
                        }
                    }).catch(errorInfo => {
                        console.log("cookie登录错误，尝试钉钉登录", errorInfo);
                        reject("");
                    });
            } else {
                console.log("cookie失效，尝试钉钉登录");
                reject("");
            }
        })
    },

    ddLogin() {
        return new Promise(function (resolve, reject) {
            ///钉钉登录
            dd.ready(function () {
                dd.runtime.permission.requestAuthCode({
                    corpId: "ding99dd341fc99a25eb", // 企业id
                    onSuccess: function (info) {
                        Util.post("apiaction/login/ddlogin", {
                            code: info.code
                        }).then(re => {
                            // vue.$Message.success("钉钉登录成功！");
                            resolve(re.data);
                        }).catch(errorInfo => {
                            reject(errorInfo);
                        });
                    }
                });
            });
        })
    }
}

export default loginApi;