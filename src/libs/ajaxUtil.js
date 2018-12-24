import axios from 'axios';
import cookie from "./cookie.js";
import loginApi from './loginApi.js';
axios.defaults.withCredentials = true;
let ajaxUtil={};
ajaxUtil.getAjax=(baseUrl)=>{
    let ajax = axios.create({
        baseURL: baseUrl,
        timeout: 15000,
    });
     
    ajax.interceptors.response.use(function (response) {
        //对返回的数据进行一些处理  
        return response;
    }, function (error) {
        //对返回的错误进行一些处理
        console.log('ajax出错:', error, "config:", error.config);
        let config = error.config;
        let str = error + '';
        if (str.search('timeout') !== -1 || str.search('Network Error') !== -1) { // 超时error捕获
           // window.location.href = '/login/401';
        };
        if (error.response.status == 401) {
            cookie.delete('sgud');
            //登录失效，开始后台重新登录
            console.log("开始重新登录");
            return loginApi.beginLogin().then(re => {
                console.log("重新登录成功");
                return axios(config);
            }).catch(error => {
                //window.location.href = '/login/401';
            });
    
        } else if (error.response.status == 404) {
            console.log("服务器没有找到相应数据：", error.response);
        } else if (error.response.status == 400) {
           
        };
         return Promise.reject(error);
    });

    return ajax;
    
};

export default ajaxUtil;