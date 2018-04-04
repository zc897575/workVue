import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import load from './load'
import wxPay from './wxPay'


export default new Vuex.Store({
    modules: {
        load,
        wxPay
    },
})
