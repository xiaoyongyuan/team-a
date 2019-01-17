const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api', {
        target: "http://api.aokecloud.cn",
        pathRewrite:{
            "/api/login/verify":"login/verify"
        },
        changeOrigin: true
    }));

};