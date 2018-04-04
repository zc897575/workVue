/*
 *  微信支付appid
 *  日期：2017/7/17.
 *  作者：Math
 * */

export default {
    state: {
        openid: null,
    },
    mutations: {
        updateOpenid (state, payload) {
            state.openid = payload.openid
        },
    },
}