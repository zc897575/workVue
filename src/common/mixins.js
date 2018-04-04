/*
 *  vue Mixins
 *  日期：2017/7/5.
 *  作者：Math
 * */

import Vue from 'vue'
import router from '../router'
import { loginToken } from './config'
import { cookie, mobile } from './util'


//页面统计
router.afterEach((to, from) => {
    console.log(to.path)
})

Vue.mixin({
    methods: {
        goBack() {
            router.go(-1)
        },
        goHome() {
            router.push('/')
        },
        goLogin() {
            let href = window.location.hash.replace('#', '')
            router.replace('/login?redir=' + encodeURIComponent(href))
        },
        isLogin() { //判断是否为登录状态
            return cookie.get(loginToken)
        },
        hideLoading() { //隐藏全局loading
            this.$store.commit('updateLoadingStatus', { isLoading: false })
        },
        showLoading() { //显示全局loading
            this.$store.commit('updateLoadingStatus', { isLoading: true })
        },
        setTitle(title) { //设置页面标题
            title = title || '寓多多'
            document.title = title
            var iframe = document.createElement('iframe')
            iframe.src = 'static/img/favicon.png'
            iframe.style.display = 'none'
            iframe.onload = function () {
                setTimeout(function () {
                    document.body.removeChild(iframe)
                    iframe.onload = iframe = null
                }, 50)
            }
            document.body.appendChild(iframe)
        },
        TimeFormat(Data, fmt) {
            if(!Data){
                return
            }
            //分解时间
            let dataArr = Data.split(' ')
            let date = dataArr[0].split('/'),
                time = dataArr[1].split(':')
            let year = date[0],
                month = date[1],
                day = date[2],
                house = time[0],
                minutes = time[1],
                seconds = time[2]
            //正则表达式表
            let o = {
                "M+": month, //月份
                "d+": day, //日
                "h+": house, //小时
                "m+": minutes, //分
                "s+": seconds //秒
            };
            //格式化日期
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        // 专治微信ios用浏览器打开以及分享后链接地址错误
        // setShear(path) {
        //     path = path || window.location.hash
        //     window.location.href =  window.location.origin + window.location.pathname + '?prop={url:"' + path.replace('#', '') + '"}/' + path
        //     if (mobile.ios) {
        //         window.location.href =  window.location.origin + window.location.pathname + '?prop={url:"' + path.replace('#', '') + '"}/' + path
        //     } else {
        //         this.$router.push(path.replace('#', ''))
        //     }
        // }
    },
})
