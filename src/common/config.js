/*
 *  项目配置文件
 *  日期：2017/7/5.
 *  作者：Math
 * */

// 房源列表页一页显示条数
export const listPageSize = 30

// 历史缴费一页显示条数
export const histPageSize = 30

// 默认加载图
export const defaultImg = 'static/img/default.png'

// 默认分享图片
export const shareImg = 'static/img/share.png'

// 登录信息保存本地
export const loginToken = 'yddToken'

// 微信appid
export const appid = 'wx3a89f20e68fcc59a' // wx3a89f20e68fcc59a

// 支付宝支付js文件
export const aliJs = 'static/js/alipay.js'

// 当前地址
export const domain = window.location.origin

// 租房类型
export const rentType = [
    { id: 1, name: '合租' },
    { id: 2, name: '整租' }
]

// 在线支付-付款类型
export const payType = [
    { id: 1, name: '水费' }, // 0
    { id: 2, name: '电费' }, // 1
    { id: 4, name: '煤气费' }, // 2
    { id: 8, name: '房租定金' }, // 3
    { id: 16, name: '房租缴费' }, // 4
    { id: 32, name: '维修费' }, // 5
    { id: 64, name: '滞纳金' }, // 6
    { id: 128, name: '房租尾款' }, // 7
    { id: 256, name: '房租押金' }, // 8
    { id: 512, name: '滞纳金-房租' }, // 9
    { id: 1024, name: '滞纳金-水费' }, // 10
    { id: 2048, name: '滞纳金-电费' }, // 11
    { id: 4096, name: '滞纳金-煤气费' }, // 12
    { id: 8192, name: '服务费' }, // 13
]
