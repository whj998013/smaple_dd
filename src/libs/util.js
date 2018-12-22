import axios from 'axios';
import cookie from "./cookie.js"
import Vue from 'vue'
axios.defaults.withCredentials = true;
console.log("mode",process.env.NODE_ENV);
let util = {};

const dataUrl=process.env.NODE_ENV=='development'?'http://api.sungingroup.com:8082' :'http://app.sungingroup.com:8082';
const ajaxUrl = dataUrl+'/api';
util.baseURL = ajaxUrl;
util.fileUrl = dataUrl;
util.devMode=process.env.NODE_ENV=='development'?true:false;
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
});
util.ajax.interceptors.response.use(function (response) {
    //对返回的数据进行一些处理  
    return response;
}, function (error) {
    //对返回的错误进行一些处理
   
    if (error.response.status == 404) {
        console.log("服务器没有找到相应数据：",error.response);
    }    
    if (error.response.status == 400) {
        Vue.$vux.alert.show({
            title: "信息",
            content: error.response.data.Message,
        });
    }
    return Promise.reject(error);
});

util.post = util.ajax.post;
util.get = util.ajax.get;
util.getMaterial = (arr) => {
    let materstr = '';
    for (let p of arr) {
        materstr = materstr + p.percent + "%" + p.materials + " ";
    }
    return materstr;
};
util.removeByValue = (arr, val) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

export default util;