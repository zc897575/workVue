<template>
	<div class="login-body" :style="{'height': bodyHeight}">
		<div class="logo"><img src="static/img/logo.png" alt="寓多多-登录"></div>
		<div class="list" @click="onFocus('mobile')">
			<i class="lock"></i>
			<div class="input-box">
				<input maxlength="11" @focus=" mobileFocus = true" @blur="inputBlur('mobile')"
				       ref="mobile" type="tel" v-model="mobile" placeholder="请输入手机号">
			</div>
			<span class="remove-input" :class="(!!mobile && mobileFocus) ? '' : 'hidden'" @click="removeInput('mobile')"><em></em></span>
		</div>
		<div class="list" @click="onFocus('code')">
			<i class="mobile"></i>
			<div class="input-box">
				<input maxlength="6" @focus=" codeFocus = true" @blur="inputBlur('code')"
				       @keyup.enter="login"
				       ref="code" type="tel" v-model="code"  placeholder="请输入短信验证码"
				>
			</div>
			<span class="remove-input" :class="(!!code && codeFocus) ? '' : 'hidden'" @click="removeInput('code')"><em></em></span>
			<span class="get-code" ref="getCode" @click.stop="getCode">{{ codeText }}</span>
		</div>
		<div class="tip">未注册过的手机号将自动创建账户</div>
		<button type="button" class="login-btn" @click="login" ref="login">登录</button>
		<div class="remember-login" :class="isInput ? 'inputing' : ''" @click="rememberMe">
			<i :class="isRemember ? 'on' : ''"></i>
			<span>开启免登陆功能</span>
		</div>
		<x-dialog v-model="dialog" :hide-on-blur="true">
			<div class="dialog-con">
				<div class="list-view">
					<img :src="codeSrc" class="code-img" @click="freshImg">
					<span class="code-fresh" :class="{'on': freshOn}" @click="freshImg" ref="freshImg"></span>
				</div>
				<div class="list-view">
					<input type="text" v-model="codeImg" placeholder="请输入图形验证码" @keyup.enter="codeSubmit">
				</div>
				<button type="button" class="dialog-btn" @click="codeSubmit" ref="codeSubmit">确定</button>
			</div>
		</x-dialog>
	</div>
</template>

<script>
import { XDialog } from 'vux'
import { loginToken } from '../common/config'
import { logining, securityCode, codeImg, checkCodeImg } from '../common/api'
import { getUrlParams, cookie } from '../common/util'
import BeiAn from '../components/BeiAn'

var reMobile = /^1[3-9]\d{9}$/,
	reCode = /^\d{4,6}$/,
	time = 60,
	timer = null;

export default {
    components: {
        XDialog,
        BeiAn
    },
    data () {
        return {
            codeDisabled: false, //获取验证码按钮倒计时
	        time,
            isInput: false, //是否在输入
            mobileFocus: false,
	        codeFocus: false,
	        isGetCode: false, //是否获取过验证码
            codeNumber: 1, //获取验证码次数


	        //图形验证码
            dialog: false, //是否显示图形验证码弹窗
            codeImg: '',
            codeSrc: '',
            codeImgNum: 0, //图形验证码请求次数
            freshOn: false,

	        //登录
            mobile: '',
            code: '',
            isRemember: true,
            bodyHeight: 300
        }
    },
    computed: {
        codeText() {
			return this.codeDisabled ? this.time + 's' : ( this.isGetCode ? '重新获取' : '获取验证码')
        }
	},
    created() {
        this.setTitle('登录')
	    this.redir = getUrlParams('redir')
        this.codeNumber = ~~cookie.get('codeNumber') || this.codeNumber
	    this.bodyHeight = document.body.clientHeight + 'px'
    },
    methods: {
        countDown(time) {
            timer && clearInterval(timer)
            timer = setInterval(() => {
                time--
	            if (time <= 0) {
                    clearInterval(timer)
                    this.codeDisabled = false
                    return
	            }
                this.time = time
            }, 1000)
        },
		check(mobile) {
            if (!String.trim(this.mobile)) {
                this.$vux.toast.text('请输入手机号')
                return false
            }
            if (!reMobile.test(this.mobile)) {
                this.$vux.toast.text('请输入正确的手机号码')
                return false
            }
			if (mobile) {
                return true
			}
            if (!this.isGetCode) {
                this.$vux.toast.text('请先获取短信验证码')
                return false
            }
            if (!String.trim(this.code)) {
                this.$vux.toast.text('请输入短信验证码')
                return false
            }
            if (!reCode.test(this.code)) {
                this.$vux.toast.text('请输入正确的短信验证码')
                return false
            }
            return true
		},
        getCode() {
            if (this.codeDisabled) {
                return
            }
            if (!this.check('mobile')) {
                return
            }
            if (this.codeNumber > 1) {
                this.dialog = true
	            this.freshImg()
	            return
            }
            this.sendCode()
        },
	    sendCode() { //发送短信
            securityCode(this.$refs.getCode, {
                Mobile: this.mobile
            }).then(res => {
                if (res.ReturnCode == '0') {
                    if (!this.codeDisabled) {
                        this.countDown(time)
                        this.$vux.toast.text('短信验证码已发送')
                    }
                    this.isGetCode = true
                    this.codeNumber += 1
                    let cookieTime = 3600000 //1小时
                    cookie.set('codeNumber', this.codeNumber, cookieTime)
                    this.time = time
                    this.codeDisabled = true
                } else if (res.ReturnCode == 1102) {
                    this.$vux.toast.text('手机号非法')
                } else if (res.ReturnCode == 1103) {
                    this.$vux.toast.text('获取频繁，请稍后再试')
                } else {
                    this.$vux.toast.text('获取验证码失败，请重试')
                }
            }).catch(res => {
                this.$vux.toast.text('获取验证码失败，请重试')
            })
	    },
        //请求图形验证码
        freshImg() {
            this.codeImgNum += 1
            var type = this.codeImgNum > 1 ? 1 : 0 //0第一次请求 1刷新
	        this.freshOn = true
	        setTimeout(() => {
                this.freshOn = false
            }, 500)
            codeImg(this.$refs.freshImg, {
                Type: type,
                Mobile: this.mobile
            }).then(res => {
                if (res.ReturnCode == '0' && res.Data && res.Data.ImgBytes) {
                    this.codeSrc = 'data:image/png;base64,' + res.Data.ImgBytes
                }
            })
        },
        codeSubmit() {
            if (!String.trim(this.codeImg)) {
                this.$vux.toast.text('请输入图形验证码')
                return
            }
            checkCodeImg(this.$refs.codeSubmit, {
                Code: this.codeImg,
                Mobile: this.mobile
            }).then(res => {
                if (res.ReturnCode == '0') {
                    this.dialog = false
                    this.sendCode()
                } else {
                    this.$vux.toast.text('请输入正确的图形验证码')
                    this.freshImg()
                }
            }).catch(res => {
                this.$vux.toast.text('请输入正确的图形验证码')
	            this.freshImg()
            })
        },
        onFocus(ele) {
            this.$refs[ele].focus()
        },
        rememberMe() {
            this.isRemember = !this.isRemember
        },
	    //删除input内容
        removeInput(ele) {
            this[ele] = ''
            setTimeout(() => {
                this[ele + 'Focus'] = true
            }, 50)
	        this.$refs[ele].focus()
        },
        inputBlur(ele) {
            setTimeout(() => {
                this[ele + 'Focus'] = false
            })
        },
        login() {
			if (!this.check()) {
			    return
			}
            logining(this.$refs.login, {
                Mobile: this.mobile,
                Code: this.code
            }).then(res => {
                if (res.ReturnCode == 1201) {
                    this.$vux.toast.text('请输入正确的短信验证码')
                    return
                }
                if (res.ReturnCode != '0' || !res.Data) {
                    this.$vux.toast.text('登录失败，请重试')
					return
                }
                let time
                if (this.isRemember) {
                    this.$vux.toast.text('您已成功开启免登陆功能')
                    time = 315360000000 //10年
                } else {
                    time = 900000 //15分钟 900000
                }
                cookie.set(loginToken, (res.Data.UserID || ''), time)
                if (this.redir) {
                    this.$router.replace(this.redir)
                } else {
                    this.$router.replace('list')
                }
           }).catch(res => {
                this.$vux.toast.text('登录失败，请重试')
            })
        },
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/pages/login";
</style>
