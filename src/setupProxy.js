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

	app.use(createProxyMiddleware('/katakana',
		{
			target:"https://labs.goo.ne.jp/api/hiragana",
			//target: "https://api.apigw.smt.docomo.ne.jp/gooLanguageAnalysisCorp/v1/hiragana?APIKEY=36767e486ea387713ac17cff9c07ee840ce0781e7320010bd6ff661724a49c7a",
			changeOrigin: true,
			secure: false,
			pathRewrite: {
				"^/katakana": "/"
			}
		}))

}
