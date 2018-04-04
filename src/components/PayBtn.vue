<template>
	<button type="button" :class="className" ref="payBtn" @click="paying">{{ text }}</button>
</template>

<script>
import {mapState} from 'vuex'
import { createOrder, aliSignature } from '../common/api'
import { ss, setUrlParams } from '../common/util'

export default {
    props: {
        className: {
		    type: String,
			default: ''
		},
        text: {
		    type: String,
	        default: '支付'
        },
	    payData: {
            type: Object,
		    default: {}
	    },
        amount: {
            default: 0
        },
        payType: {
            type: Number,
            default: 0
        }
    },
	data() {
        return {
            url: window.location.href
        }
	},
    methods: {
        paying() {
            let data = {
                paycode: 0, //0支付 1收入
                amount: typeof this.amount == 'string' ? parseFloat(this.amount.replace(',', '')) : this.amount, //金额
                paytype: this.payType, //付款类型：1-水，2-电，4-煤，8-定金，16-房租，32-维修费用，64-滞纳金
                houseid: this.payData.houseId, //房源ID
                roomid: this.payData.roomId, //房间ID
                userid: this.payData.userId, //用户ID
            }
            createOrder(this.$refs.payBtn, data).then(res => {
                if (res.ReturnCode == '0' && res.Data && res.Data.OrderSN) {
					this.aliSignature({
                        amount: data.amount,
                        ordersn: res.Data.OrderSN
					})
                } else {
                    this.$vux.toast.text('支付失败，请重试')
                }
            }).catch(res => {
                this.$vux.toast.text('支付失败，请重试')
            })
	    },
        aliSignature(data) {
            aliSignature(this.$refs.payBtn, {
                amount: data.amount,
                ordersn: data.ordersn,
                returnurl: this.url
            }).then(res => {
                if (res.ReturnCode == '0' && res.Data != '') {
					var signData = {}
                    res.Data.forEach(item => {
                        signData[item.Key] = item.Value
                    })
	                this.aliPay(signData, data)
                } else {
                    this.$vux.toast.text('支付失败，请重试')
                }
            }).catch(res => {
            	console.log(res)
                this.$vux.toast.text('支付失败，请重试')
            })
        },
        aliPay(signData, payData) {
            /*var url = setUrlParams({
	            'sign': signData.sign,
	            'app_id': signData.app_id, //支付宝appid
				'charset': signData.charset,
	            'method': signData.method, //支付类型
	            'sign_type': signData.sign_type,
	            'timestamp': signData.timestamp,
	            'version': signData.version,
	            'notify_url': signData.notify_url, //回调地址
	            'subject': signData.subject,
	            'total_amount': '0.01',
	            'out_trade_no': '123456', //订单号
	            'seller_id': signData.seller_id, //商户UID
	            'product_code': signData.product_code //销售产品码
            }, 'https://openapi.alipaydev.com/gateway.do')*/

            ss.remove('contractInfo')
	        var url = setUrlParams(signData, 'https://openapi.alipay.com/gateway.do')
            var goto = _AP.pay(url)
            ss.set('ali', 'yes')
            //this.setShear('#aliPay?goto=' + goto + '&orderId=' + payData.ordersn)
	        this.$router.push('aliPay?goto=' + goto + '&orderId=' + payData.ordersn)
	    }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";
</style>
