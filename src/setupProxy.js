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

	app.use(createProxyMiddleware('/login',
		{
			target: "http://127.0.0.1:8080/login/login",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/login": "/"
			}
		}))


	app.use(createProxyMiddleware('/sendVerificationCode',
		{
			target: "http://127.0.0.1:8080/login/sendVerificationCode",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/sendVerificationCode": "/"
			}
		}))

	app.use(createProxyMiddleware('/init',
		{
			target: "http://127.0.0.1:8080/login/init",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/init": "/"
			}
		}))

}
