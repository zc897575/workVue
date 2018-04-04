<template>
    <div class="appoint-body">
        <p class="input-box user-name">
            <i class="icon-name appoint-icon"></i>
            <input ref="name" class="input-name" type="text" placeholder="请输入您的姓名" v-model="name" maxlength='16'>
        </p>
        <p class="input-box user-phone">
            <i class="icon-phone appoint-icon"></i>
            <input ref="phone" class="input-phone" type="tel" placeholder="请输入您的手机号码" v-model="phone" maxlength="11">
        </p>
        <p class="input-box user-code">
            <i class="icon-code appoint-icon"></i>
            <input ref="code" class="input-code" type="tel" pattern="[0-9]*" placeholder="请输入验证码" v-model="code" maxlength='6'
                   @keyup.enter="submit"
            >
            <span ref="codeBtn" class="get-code" :class="{'unget-code':hasGetCode}" @click="requestCode">{{getCode}}</span>
        </p>
        <button ref="submit" class="long-btn appoint-btn" @click="submit">立即预约</button>
        <div class="footer">
            <p>收不到短信？</p>
            <p>拨打
                <a href="tel:400-025-6788">400-025-6788</a> 联系客服MM电话预约</p>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { getUrlParams } from '../common/util'
import { securityCode, appointSubmit } from '../common/api'
import BeiAn from '../components/BeiAn'

let name_RegExp = /^[\u4e00-\u9fa5a-zA-Z]{1,16}$/,
    tel_RegExp = /^1[345789][0-9]{9}$/,
    code_RegExp = /^\d{4,6}$/

export default {
    components: {
        BeiAn
    },
    data() {
        return {
            url: window.location.href,
            Houseid: null,
            Roomid: null,
            getCode: '获取验证码',
            hasGetCode: false,
            name: '',
            phone: '',
            code: ''
        }
    },
    created() {
        this.setTitle('预约看房')
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.Houseid = getUrlParams('pid', this.url)
            this.Roomid = getUrlParams('code', this.url)
        },
        requestCode() {
            if (this.hasGetCode == false) {
                this.phone = this.trimStr(this.phone)
                let phone = {
                    str: this.phone,
                    reg: tel_RegExp,
                    type: '手机号码',
                    ele: this.$refs.phone
                }
                //this.code = this.trimStr(this.code)
                if (this.testStr(phone)) {
                    let _this = this
                    let downTime = 60
                    // name.ele.readOnly = true
                    // phone.ele.readOnly = true

                    securityCode(_this.$refs.codeBtn, {
                        Mobile: phone.str
                    }).then(function (res) {
                        if (res.ReturnCode == 0) {
                            _this.hasGetCode = true;
                            _this.getCode = downTime + 's后重新获取'
                            let index = setInterval(function () {
                                downTime--
                                _this.getCode = downTime + 's后重新获取'
                                if (downTime == -1) {
                                    _this.hasGetCode = false
                                    _this.getCode = '获取验证码'
                                    clearInterval(index)
                                }
                            }, 1000)
                            Vue.$vux.toast.text('短信验证码已发送', 'middle')
                            //_this.$refs.code.focus();
                        } else if (res.ReturnCode == 1102) {
                            Vue.$vux.toast.text('手机号非法','middle');
                        } else if (res.ReturnCode == 1103) {
                            Vue.$vux.toast.text('获取频繁，请稍后再试', 'middle')
                        } else {
                            Vue.$vux.toast.text('系统错误', 'middle')
                        }
                    })
                }
            }
        },
        submit() {
            let _this = this
            _this.name = _this.trimStr(_this.name)
            _this.phone = _this.trimStr(_this.phone)
            _this.code = _this.trimStr(_this.code)
            let name = {
                str: _this.name,
                reg: name_RegExp,
                type: '姓名',
                ele: _this.$refs.name
            }, phone = {
                str: _this.phone,
                reg: tel_RegExp,
                type: '手机号码',
                ele: _this.$refs.phone
            }, code = {
                str: _this.code,
                reg: code_RegExp,
                type: '验证码',
                ele: _this.$refs.code
            }
            if (_this.testStr(name)) {
                if (_this.testStr(phone)) {
                    if (_this.testStr(code)) {
                        appointSubmit(_this.$refs.submit, {
                            Name: name.str,
                            Mobile: phone.str,
                            Code: code.str,
                            Houseid: _this.Houseid,
                            Roomid: _this.Roomid,
                            FromStatus: 2 // 1官网 2微官网 3支付宝 4蘑菇租房
                        }).then(function (res) {
                            if (res.ReturnCode == 0) {
                                Vue.$vux.toast.text('预约成功！', 'middle')
                                _this.goBack()
                            } else if (res.ReturnCode == 1201) {
                                Vue.$vux.toast.text('请输入正确的短信验证码', 'middle')
                                //code.ele.focus();
                            } else {
                                Vue.$vux.toast.text('系统错误', 'middle')
                            }
                        })
                    }
                }
            }
        },
        trimStr(str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        },
        testStr(data) {
            if (data.str != '') {
                if (data.reg.test(data.str)) {
                    return true
                } else {
                    Vue.$vux.toast.text('请输入正确格式的' + data.type, 'middle')
                    //data.ele.focus();
                    return false
                }
            } else {
                Vue.$vux.toast.text('请输入您的' + data.type, 'middle')
                //data.ele.focus();
                return false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/pages/appoint";
</style>
