/*
 *  接口
 *  日期：2017/6/8.
 *  作者：Math
 * */

import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { listPageSize, histPageSize } from './config'

const _ = function () {
    var arr = [].slice.call(arguments);
    console.log(arr.join('~~~~~~~'));
}

// axios 配置
axios.defaults.timeout = 10000
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'Access-Control-Allow-Origin': 'http://www.yudoodoo.com'
}
axios.defaults.baseURL = '/API/jsonApi.aspx'
// axios.defaults.baseURL = 'http://www.yudoodoo.com/API/jsonApi.aspx'

// 请求处理
axios.interceptors.request.use((config) => {
    if (config.data && config.data.wMethod) {
        config.url = config.url + '?wMethod=' + config.data.wMethod
        delete config.data.wMethod
    }
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data)
    }
    if (config.url.indexOf('.json') >= 0) {
        config.url = config.url.replace('/API/jsonApi.aspx', '/static')
    }
    return config
}, (error) => {
    Vue.$vux.toast.text('网络异常，请刷新页面重试', 'middle')
    return Promise.reject(error)
})

//返回状态判断
axios.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    Vue.$vux.toast.text('系统繁忙，请刷新页面重试', 'middle')
    return Promise.reject(error)
})

function comAjax(opt) {
    opt.url = opt.url || ''
    if (opt.target) { //防止提交按钮重复提交
        if (opt.target.disabled) {
            return new Promise((reslove, reject) => {})
        }
        opt.target.disabled = true
        return new Promise((resolve, reject) => {
            if (opt.type === 'get') {
                axios.get(opt.url).then((res) => {
                    opt.target.disabled = false
                    resolve(res)
                }).catch((error) => {
                    opt.target.disabled = false
                    reject(error)
                })
            } else {
                axios.post(opt.url, opt.data).then((res) => {
                    opt.target.disabled = false
                    resolve(res)
                }).catch((error) => {
                    opt.target.disabled = false
                    reject(error)
                })
            }
        })
    } else {
        if (opt.type === 'get') {
            return axios.get(opt.url)
        } else {
            return axios.post(opt.url, opt.data)
        }
    }
}

function get(url, data) {
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            if (url.indexOf('?') >= 0) {
                url += '&' + i + '=' + data[i]
            } else {
                url += '?' + i + '=' + data[i]
            }
        }
    }
    return comAjax({
        type: 'get',
        url,
        data
    })
}

//登录
export const logining = function (target, data) {
    data.wMethod = '239'
    return comAjax({
        target: target,
        data: data
    })
}
//发送图形验证码
export const codeImg = function (target, data) {
    data.wMethod = '253'
    return comAjax({
        target: target,
        data: data
    })
}

//验证图片验证码
export const checkCodeImg = function (target, data) {
    data.wMethod = '254'
    return comAjax({
        target: target,
        data: data
    })
}

//房源详情
export const housingDetail = function (data) {
    data.wMethod = '207'
    return get('', data)
}
//房源详情-推荐列表
export const recommendList = function (data) {
    data.wMethod = '220'
    return get('', data)
}

//房源列表-筛选条件
export const filter = function () {
    return get('', {
        wMethod: 205
    })
}
//房源列表数据
export const houseList = function (data) {
    data.wMethod = 206
    data.pagesize = listPageSize
    return get('', data)
}

//热门板块
export const hotArea = function () {
    return get('', {
        wMethod: 213
    })
}
//热门小区
export const hotVillage = function () {
    return get('', {
        wMethod: 214
    })
}
//搜索热词提示
export const hotTip = function (data) {
    data.wMethod = '265'
    return get('', data)
}

//获取验证码
export const securityCode = function(target, data){
    data.wMethod = '215'
    return comAjax({
        target: target,
        data: data
    })
}

//预约看房
export const appointSubmit = function(target, data){
    data.wMethod = '216'
    return comAjax({
        target: target,
        data: data
    })
}

//合同
export const contract = function (data) {
    data.wMethod = '259'
    return get('', data)
}
//合同签名
export const conSignature = function (target, data) {
    data.wMethod = '260'
    return comAjax({
        type: 'post',
        target: target,
        data: data
    })
}
//生成合同PDF
export const conSuccess = function (data) {
    data.wMethod = '263'
    return get('', data)
}

//提交报修
export const repairSubmit = function (data) {
    data.wMethod = '221'
    return get('', data)
}

//报修页面列表
export const repairList = function (data) {
    data.wMethod = '241'
    return get('', data)
}

//报修详情
export const repairDetail = function (data) {
    data.wMethod = '245'
    return get('', data)
}

//报修反馈
export const repairFeedback = function (data) {
    data.wMethod = '242'
    return get('', data)
}

//报修完成
export const repairSuccess = function (data) {
    data.wMethod = '222'
    return get('', data)
}

//合同列表-选择合同
export const contractList = function (data) {
    data.wMethod = '258'
    return get('', data)
}

/*
* 在线支付
* */
//获取在线支付列表
export const payList = function (data) {
    data.wMethod = '240'
    return get('', data)
}

//微信签名
export const wxSignature = function (data) {
    data.wMethod = '229'
    return get('', data)
}
//获取openid
export const wxOpenid = function (data) {
    data.wMethod = '238'
    return get('', data)
}

//微信支付
export const wxPay = function (target, data) {
    data.wMethod = '228'
    return comAjax({
        target: target,
        data: data
    })
}
//支付宝签名
export const aliSignature = function (target, data) {
    data.wMethod = '268'
    return comAjax({
        target: target,
        data: data
    })
}
//支付成功
export const paySucess = function (data) {
    data.wMethod = '270'
    return get('', data)
}

//生成订单
export const createOrder = function (target, data) {
    data.wMethod = '227'
    return comAjax({
        target: target,
        data: data
    })
}

//历史缴费
export const historyPayList = function (data) {
    data.wMethod = '251'
    data.pagesize = histPageSize
    return get('', data)
}


//图片上传
export const sendImg = function (data) {
    data.wMethod = '257'
    return comAjax({
        type: 'post',
        data: data
    })
}

//下载链接
export const getDownLink = function () {
    return get('', {
        wMethod: '286'
    })
}
