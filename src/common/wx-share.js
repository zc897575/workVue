/*
 *  微信分享公共方法
 *  日期：2017/11/30.
 *  作者：Math
 * */
import Vue from 'vue'
import lrz from "lrz"
import { domain, shareImg } from './config'
import { getUrlParams, ss } from './util'
import { wxSignature, sendImg } from './api'


// 微信appid
const appid = 'wxdafdcfa4f1414975'
// 微信jssdk文件
const wxJs = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'

// 注意这里的域名地址 不同环境要修改
const webUrl = 'http://www.yudoodoo.com'

// 获取微信授权地址
const getOauthUrl = function (url) {
    url = url || window.location.href
    const href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base&state=ydd#wechat_redirect`
    return href
}

// 微信授权地址跳转
const oauthUrl = function (url) {
    // 判断微信浏览器
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') === -1) {
        return
    }
    const href = getOauthUrl(url)
    if (window.location.href.indexOf(webUrl) === 0) {
        window.location.replace(href)
    }
}

function wxLoad(callback) {
    if (window.wx) {
        callback()
        return
    }
    const script = document.createElement('script')
    script.defer = true
    script.async = true
    script.onload = () => {
        callback()
    }
    script.src = wxJs
    document.body.appendChild(script)
}
// 微信签名
function signature(data, shareData) {
    // 是否支持接口
    var checked = {}
    data.signature = JSON.parse(data.signature)
    data.signature.forEach(item => {
        data[item.Key] = item.Value
    })
    wx.config({
        debug: false,
        appId: appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
    })
    // wx.checkJsApi({
    //     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    //     success: function(res) {
    //         // 以键值对的形式返回，可用的api值true，不可用为false
    //         // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    //         res = JSON.parse(res)
    //         checked = JSON.parse(res.checkResult)
    //     }
    // });
    // const shareConfig = {
    //     title: shareData.title, // 分享标题
    //     desc: shareData.desc, // 分享描述
    //     link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: shareData.imgUrl, // 分享图标
    //     type: 'link', // 分享类型,music、video或link，不填默认为link
    //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //     trigger() {
    //         // alert('用户点击分享');
    //     },
    //     success() {
    //         // alert('已分享');
    //     },
    //     cancel() {
    //         // alert('已取消');
    //     },
    //     fail(res) {
    //         // alert(JSON.stringify(res));
    //     }
    // }
    wx.ready(function() {
        lrz(shareData.imgUrl, { width: 350 }).then(function (res) {
            sendImg({
                imgbase: res.base64+'',
                requesttype: 1
            }).then(function (res) {
                if (res.ReturnCode == '0' && res.Data.FilePath &&  res.Data.FilePath != ''){
                    shareData.imgUrl = res.Data.FilePath
                } else {
                    shareData.imgUrl = domain + '/wap/' + shareImg
                }
                bindShare(shareData)
            })
        }).catch (function (res) {
            shareData.imgUrl = domain + '/wap/' + shareImg
            bindShare(shareData)
        })
    })
}

function bindShare (shareData) {
    const shareConfig = {
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.imgUrl, // 分享图标
        trigger() {
            // alert('用户点击分享');
        },
        success() {
            // alert('已分享');
        },
        cancel() {
            // alert('已取消');
        },
        fail(res) {
            // alert(JSON.stringify(res));
        }
    }

    wx.onMenuShareTimeline(shareConfig)
    wx.onMenuShareAppMessage(shareConfig)
    wx.onMenuShareQQ(shareConfig)
    //wx.onMenuShareTimeline(shareConfig)
}

/*
* @param title 标题
* @param desc 描述
* @param link 链接
* @param imgUrl 小图标
* */
const wxShare = function (shareData) {
    // 判断微信浏览器
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') === -1) {
        return
    }
    const href = window.location.href
    const code = getUrlParams('code', href, 0)
    const oldCode = ss.get('wxCode')
    if (!code || code === oldCode) {
        oauthUrl(href)
        return
    }
    ss.set('wxCode', code)
    wxLoad(() => {
        wxSignature({
            Url: encodeURIComponent(href.split('#')[0])
        }).then((res) => {
            if (res.ReturnCode == 0) {
                signature(res.Data, shareData)
            } else {
                Vue.$vux.toast.text('微信签名失败，请刷新重试')
            }
        })
    })
}

export { wxShare }
