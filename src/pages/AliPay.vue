<template>
	<div class="aliPay">
		<div class="J-weixin-tip-img weixin-tip-img" :class="mobileType" v-show="isWx">
			<div class="weixin-tip-content">
				请在菜单中选择在浏览器中打开,<br/>
				以完成支付
			</div>
			<i></i>
			<p class="tip">支付完成后，请刷新页面</p>
		</div>
	</div>
</template>

<script>
import { paySucess } from '../common/api'
import { mobile, getUrlParams, ss } from '../common/util'
import { aliJs } from '../common/config'
import BeiAn from '../components/BeiAn'

export default {
    data () {
        return {
            mobileType: '',
	        isWx: false
        }
    },
	created() {
        this.setTitle('在线支付')
		this.mobileType = mobile.ios ? 'iphone' : 'android'
		var goto = this.goto = getUrlParams('goto')
		this.orderId = getUrlParams('orderId')
		if (!goto) {
            this.$vux.toast.text('打开链接地址有误！')
			return
		}
        var ua = navigator.userAgent.toLowerCase()
		if (ua.indexOf('micromessenger') != -1) {
			this.isWx = true
			this.paySucess()
		} else {
			this.aliLoad()
		}
	},
	methods: {
        aliLoad() {
            if (window._AP) {
                this.goAli()
                return
            }
            var script = document.createElement('script')
            script.defer = true
            script.async = true
	        script.onload = () => {
                this.goAli()
	        }
            script.src = aliJs
            document.body.appendChild(script)
        },
        goAli() {
            var goto = _AP.decode(this.goto)
            window.location.replace(goto)
        },
		paySucess() {
            var ali = ss.get('ali')
            ss.remove('ali')
			if (ali) {
				return
			}

            paySucess({
                ordersn: this.orderId
            }).then(res => {
				if (res.ReturnCode == '0') {
                    this.$vux.toast.text('支付成功！')
                    setTimeout(() => {
                        this.goBack()
                    }, 2000)
				} else {
                    this.$vux.toast.text('您还没有完成支付，请在<br/>浏览器打开，以完成支付')
				}
            })
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/pages/aliPay";

</style>
