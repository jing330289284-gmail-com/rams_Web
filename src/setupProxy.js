const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
    app.use(createProxyMiddleware('/api', 
      { 
        target: "https://asia-northeast1-tsunagi-all.cloudfunctions.net/", 
        changeOrigin:true,
        secure: false,
        pathRewrite: {
                    "^/api": "/"
                }
      }))
   }
