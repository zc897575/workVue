import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: function (resolve) {
                require(['../pages/Index'], resolve)
            },
        },
        {
            path: '/signa',
            component: function (resolve) {
                require(['../pages/SignatureDemo'], resolve)
            }
        },
        {
            path: '/search',
            component: function (resolve) {
                require(['../components/Search'], resolve)
            }
        },
        {
            path: '/login',
            component: function (resolve) {
                require(['../pages/Login'], resolve)
            }
        },
        {
            path: '/details',
            component: function (resolve) {
                require(['../pages/Details'], resolve)
            }
        },
        {
            path: '/list',
            component: function (resolve) {
                require(['../pages/List'], resolve)
            },
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/appoint',
            component: function (resolve) {
                require(['../pages/Appoint'], resolve)
            }
        },
        {
            path: '/historyPay',
            component: function (resolve) {
                require(['../pages/HistoryPay'], resolve)
            }
        },
        {
            path: '/aliPay',
            component: function (resolve) {
                require(['../pages/AliPay'], resolve)
            }
        },
        {
            path: '/onlinePay',
            component: function (resolve) {
                require(['../pages/OnlinePay'], resolve)
            }
        },
        {
            path: '/onlinePayToPay',
            component: function (resolve) {
                require(['../pages/onlinePayToPay'], resolve)
            }
        },
        {
            path: '/contract',
            alias: '/contractChick',
            component: function (resolve) {
                require(['../pages/Contract'], resolve)
            }
        },
        {
            path: '/contractChoose',
            component: function (resolve) {
                require(['../pages/ContractChoose'], resolve)
            }
        },
        {
            path: '/contractSignature',
            component: function (resolve) {
                require(['../pages/ContractSignature'], resolve)
            }
        },
        {
            path: '/contractSuccess',
            component: function (resolve) {
                require(['../pages/ContractSuccess'], resolve)
            }
        },
        {
            path: '/contractPreview',
            component: function (resolve) {
                require(['../pages/ContractPreview'], resolve)
            }
        },
        {
            path: '/repair',
            component: function (resolve) {
                require(['../pages/Repair'], resolve)
            }
        },
        {
            path: '/repairDetail',
            component: function (resolve) {
                require(['../pages/RepairDetail'], resolve)
            }
        },
        {
            path: '/repairSubmit',
            component: function (resolve) {
                require(['../pages/RepairSubmit'], resolve)
            }
        },
        {
            path: '/appDown',
            component: function (resolve) {
                require(['../pages/AppDown'], resolve)
            }
        },
        {
            path: '/renterInfor',
            component: function (resolve) {
                require(['../pages/RenterInfor'], resolve)
            },
            children: [
                {
                    path: 'fillIn',
                    component: function (resolve) {
                        require(['../components/FillIn'], resolve)
                    }
                },
                {
                    path: 'confirm',
                    component: function (resolve) {
                        require(['../components/Confirm'], resolve)
                    }
                },
                {
                    path: 'payType',
                    component: function (resolve) {
                        require(['../components/PayType'], resolve)
                    }
                }
            ]
        }
    ]
})
