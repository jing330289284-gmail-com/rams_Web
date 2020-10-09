const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
	app.use(createProxyMiddleware('/api',
		{
			target: "https://asia-northeast1-tsunagi-all.cloudfunctions.net/",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/api": "/"
			}
		}))

	app.use(createProxyMiddleware('/postcodeApi',
		{
			target: "https://zipcloud.ibsnet.co.jp/api/",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/postcodeApi": "/"
			}
		}))

	app.use(createProxyMiddleware('/cal',
		{
			target: "http://ap.hutime.org/cal/",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/cal": "/"
			}
		}))

}
