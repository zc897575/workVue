// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import { sync } from 'vuex-router-sync'
import Vuex from 'vuex'
import store from './store'
import './common'
import Lazyload from 'vue-lazyload'
import { defaultImg} from './common/config'

Vue.use(Vuex)
Vue.use(store)
sync(store, router)
import { ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux'

Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.$vux.toast.text = function (text, position, time) {
    position = position || 'middle'
    time = time || 3000
    setTimeout(() => {
        Vue.$vux.toast.show({
            type: 'text',
            time,
            isShowMask: true,
            text,
            position,
        })
    }, 200)
}
window.addEventListener('load', () => {
    document.querySelector('.vux-toast .weui-mask_transparent').addEventListener('touchstart', () => {
        Vue.$vux.toast.hide()
    }, false)
}, false)

Vue.use(Lazyload, {
    preLoad: 1.3,
    error: defaultImg,
    loading: defaultImg,
    attempt: 1
})
FastClick.attach(document.body)
if (process.env.NODE_ENV === 'development') {
    Vue.config.productionTip = true
}

import { ss } from './common/util'

const pathName = 'paths'
ss.remove(pathName)
ss.remove('count')
let historyCount = 0
let winLoad = false
router.beforeEach((to, from, next) => {
    let paths = ss.get(pathName) || '{}'
    try {
        paths = JSON.parse(paths)
    } catch (e) {
        paths = {}
    }
    const toIndex = paths[to.path]
    const fromIndex = paths[from.path]
    winLoad && store.commit('updateLoadingStatus', { isLoading: true })
    if (toIndex) {
        if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
            store.commit('updateDirection', { direction: 'forward' })
        } else {
            store.commit('updateDirection', { direction: 'reverse' })
        }
    } else {
        ++historyCount
        ss.set('count', historyCount)
        paths[to.path] = historyCount
        ss.set(pathName, JSON.stringify(paths))
        if (winLoad) {
            store.commit('updateDirection', { direction: 'forward' })
        } else {
            store.commit('updateDirection', { direction: 'opacity' })
        }
    }
    winLoad = true
    next()
})

router.afterEach((to) => {
    setTimeout(() => {
        if (to.path.search(/\/(list|details|onlinePay|historyPay|contractChoose|contract|contractPreview|repair|repairDetail)(\?)?$/) === 0) {
            return
        }
        store.commit('updateLoadingStatus', { isLoading: false })
    }, 100)
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app-box')
