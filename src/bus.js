import Vue from 'vue';
import cookie from "./libs/cookie.js"
export default new Vue({
    data() {
        return {
            client: {
                IsPc: false,
                IsDd: false
            },
            currentUser: null,
        }
    },
    computed: {
        isLogin() {
            return this.currentUser == null ? false : true;
        },
        isLimt() {
            return this.currentUser.isLimt;
        },
        allSampleCanLend(){
           return this.currentUser.allSampleCanLend;
        },
    },
    methods: {
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