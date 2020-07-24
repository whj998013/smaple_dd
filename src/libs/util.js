import ajaxUtil from './ajaxUtil';

//console.log("mode",process.env.NODE_ENV);
let util = {};
const dataUrl=process.env.NODE_ENV=='development'?'http://api.sungingroup.com:8082' :'https://app.sungingroup.com:8182';
const ajaxUrl = dataUrl+'/';

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
util.getGmtDate=(dstr)=>{
    let dt;
    // if (dstr instanceof Date) {
    //     dt = dstr;
    // } else {
    //     dt = new Date(dstr);
    // };
    dt = dstr instanceof Date ? dstr : new Date(dstr);
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();
    let ms = m > 9 ? m : ('0' + m);
    let ds = d > 9 ? d : ('0' + d);
    let str = y + '-' + ms + '-' + ds;
    return str;
};

export default util;