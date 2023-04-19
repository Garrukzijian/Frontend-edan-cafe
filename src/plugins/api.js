import Vue from 'vue'

import router from '../router/index'
//这个是全局状态管理器
import store from '../store'
//导入这个可以进行跨域请求的一个axios的请求
import axios from 'axios'

import moment from 'moment'

import {
    Message,
    MessageBox
} from 'element-ui';

Vue.prototype.$http = axios

//前端路由就是这个8081的端口，进行跨域的请求
axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true //跨域
axios.defaults.timeout = 10000

// 错误的响应码
axios.interceptors.response.use((response) => {

    if (response.data.code == 400) {
        Message.error({
            message: '无响应权限,请联系管理员或者是重新登录'
        });
        router.push('/login')
    }
    return response
    //当出现相应信息不是正常的时候执行之后的操作
}, (error) => {
    if (error.response) {
        let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
        switch (error.response.status) {
            case 404:
                Message.error({
                    message: '很抱歉，资源未找到!'
                });
                break
            case 403:
            case 401:
                Message.error({
                    message: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效!'
                });
                router.push('/login')
                break
            case 500:
                Message.error({
                    message: '后台逻辑出现问题，请联系工作人员!'
                });
                break
            default:
                Message.error({
                    message: errorMessage
                });
                break
        }
    }
    return Promise.reject(error)
})

axios.interceptors.request.use((config) => {
    let token = sessionStorage.getItem('token')
    let exp = sessionStorage.getItem('exp')
    //这个地方进行了修改
    if (exp) {
        let now = moment().format('YYYYMMDDHHmmss')
        if (now - exp >= -10) {
            MessageBox.alert('很抱歉，登录已过期，请重新登录', '登录已过期', {
                confirmButtonText: '确定',
                callback: () => {
                    sessionStorage.clear();
                    location.reload()
                }
            })
        }
    }
    // 有 token就带上 
    if (token) {
        config.headers.Authorization = store.state.token
    }
    return config
}, (error) => {
    return Promise.reject(error)
})