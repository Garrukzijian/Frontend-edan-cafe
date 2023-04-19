module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        open: true, // vue项目启动时自动打开浏览器
        proxy: {
            '/api': { // '/one'是主要就是一个标志的作用，那么主要的作用就是检查这个数据是否含有在这个前缀
                target: "http://127.0.0.1:8081", //目标地址，一般是指后台服务器地址
                changeOrigin: true, //是否跨域
                pathRewrite:{
                    '^/api':''
                }
            },
            //图片代理没有进行修改，直接进行之后的操作的
            '/img': { // '/one'是主要就是一个标志的作用，那么主要的作用就是检查这个数据是否含有在这个前缀
                target: "http://127.0.0.1:8081", //目标地址，一般是指后台服务器地址
                changeOrigin: true, //是否跨域
            },
        }
    }
}