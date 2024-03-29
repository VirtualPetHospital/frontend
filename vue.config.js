
module.exports = {

    devServer: {
        proxy: {
            '/api': {
                target: 'http://47.103.131.161:10010/',// 后端接口
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}





