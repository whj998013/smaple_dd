const cookie = {

    set: function (name, value, OverTime) {

        var d = new Date(OverTime);
        //d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);

        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();

    },

    setDays: function (name, value, days) {

        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);

        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();

    },

    get: function (name) {

        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

        return v ? v[2] : null;

    },

    delete: function (name) {

        this.set(name, '', -1);

    },
    setSessionCookie: function(name, value, cookiePath) {
        var isIE = !-[1,];//判断是否是ie核心浏览器
        if (isIE) {
            if (value) {
                var expire = "; expires=At the end of the Session";
                var path = "";
                if (cookiePath != null) {
                    path = "; path=" + cookiePath;
                }
                document.cookie = name + "=" + value + expire + path;
            }
        } else {
            if (value) {
                var expire = "; expires=Session";
                var path = "";
                if (cookiePath != null) {
                    path = "; path=" + cookiePath;
                }
                document.cookie = name + "=" + value + expire + path;
            }
        }
    }

};
export default cookie;