import ajaxUtil from './ajaxUtil';

//console.log("mode",process.env.NODE_ENV);
let util = {};
const dataUrl=process.env.NODE_ENV=='development'?'http://api.sungingroup.com:8082' :'http://app.sungingroup.com:8082';
const ajaxUrl = dataUrl+'/api';

util.fileUrl = dataUrl;
util.devMode=process.env.NODE_ENV=='development'?true:false;

util.ajax=ajaxUtil.getAjax(ajaxUrl);
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