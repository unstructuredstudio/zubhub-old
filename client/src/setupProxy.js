const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        '/api/*',
        createProxyMiddleware({
            target: 'http://[::1]:5000',
            changeOrigin: true
        })
    );
    //app.use(proxy('/api/*', { target: 'http://localhost:5000' }))
}