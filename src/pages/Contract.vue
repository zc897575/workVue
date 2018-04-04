<template>
    <div class="contract-body">
        <v-header v-if="hasContract && hasAjax" :title="setTitleText()" :menuText="'预览合同'" @on-menu="toPreview"></v-header>
        <div v-if="hasContract && hasAjax" class="contract-main">
            <tip :msg="msg"></tip>
            <div class="contract-block">
                <p class="contract-cell pdlr30 first-cell">
                    <span class="main-font">
                        <i class="contract-logo"></i>寓多多</span>
                    <span class="sub-font">出租方</span>
                </p>
                <p class="contract-cell pdlr30 last-cell">
                    <span class="main-font">{{info.HouseName}}
                        <i class="icon-font">{{setRentType(info.RentType)}}</i>
                    </span>
                    <span class="rental-font">{{info.MonthlyRent}}<span class="little-font">元</span></span>
                </p>
            </div>
            <div class="contract-block">
                <p class="contract-cell pdlr30 contract-title unline">
                    <span class="main-font">1、核对承租人信息</span>
                </p>
                <div class="pdlr30">
                    <p class="contract-cell unline">
                        <span class="main-font">承租人</span>
                        <span class="sub-font">{{info.CustomerName}}</span>
                    </p>
                    <p class="contract-cell unline">
                        <span class="main-font">联系方式</span>
                        <span class="sub-font">{{info.Mobile}}</span>
                    </p>
                    <p class="contract-cell unline">
                        <span class="main-font">证件号码</span>
                        <span class="sub-font">{{info.IdCardNo}}</span>
                    </p>
                    <p class="contract-cell">
                        <span class="main-font">证件照片</span>
                        <span class="sub-font important">虚假证件将承受法律责任</span>
                    </p>
                    <div class="idcard-box">
                        <div class="idcard">
                            <img :src="!!info.IdCardPhoto?info.IdCardPhoto[0]:''" />
                        </div>
                        <div class="idcard">
                            <img :src="!!info.IdCardPhoto?info.IdCardPhoto[1]:''" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="contract-block last-block">
                <p class="contract-cell pdlr30 contract-title unline">
                    <span class="main-font">2、核对租赁合同信息</span>
                </p>
                <div class="pdlr30">
                    <p class="contract-cell unline">
                        <span class="main-font">租金</span>
                        <span class="sub-font">{{info.MonthlyRent}}</span>
                    </p>
                    <p class="contract-cell unline">
                        <span class="main-font">押金</span>
                        <span class="sub-font">{{info.ZongYaJin}}</span>
                    </p>
                    <p class="contract-cell unline">
                        <span class="main-font">付款方式</span>
                        <span class="sub-font">{{'押' + setCHN(info.PledgeMonth) + '付' + setCHN(info.PaymentMonth)}}</span>
                    </p>
                    <p class="contract-cell">
                        <span class="main-font">起始日期</span>
                        <span class="sub-font">{{info.StartDate}}</span>
                    </p>
                    <p class="contract-cell">
                        <span class="main-font">结束日期</span>
                        <span class="sub-font">{{info.EndDate}}</span>
                    </p>
                    <p class="contract-cell">
                        <span class="main-font">补充约定</span>
                        <span class="sub-font">{{info.Addition}}</span>
                    </p>
                </div>
            </div>
            <p class="treaty" @click="toggleAgree"><i class="chick" :class="{chicked:agree,unchicked:!agree}"></i>我已阅读合同条款</p>
            <button v-if="from" class="long-btn contract-submit" @click="contractSubmit">确认签订</button>
        </div>
        <div v-if="!hasContract" class="empty-contract">
            <div class="empty-contract-container">
                <i></i>
                <p>暂无租约</p>
                <p class="sub-P">如你已签约，请联系房管家获取租约</p>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import vHeader from '../components/Header'
import tip from '../components/Toptip'
import { cookie } from '../common/util'
import { contract } from '../common/api'
import { getUrlParams } from '../common/util'
import BeiAn from '../components/BeiAn'

export default {
    data() {
        return {
            msg: "Contract",
            from: this.$route.path == '/contract',
            agree: true, //是否同意条款
            msg: '提示：请核实您的身份信息和租约条款后签订，建议点击查看合同',
            info: {}, //合同数据存放容器
            uid: this.isLogin(),
            canSubmit: false, //是否可以提交合同
            conId: getUrlParams('conId'),
            hasContract: true, //是否有合同
            hasAjax: false //是否完成后台请求
        }
    },
    components: {
        vHeader,
        tip
    },
    created(){
        this.setTitle(this.setTitleText())
        this.init()
    },
    mounted(){
        
    },
    methods: {
        setTitleText() {
            return this.from?'签订合同':'查看租约'
        },
        init() {
            let _this = this
            //判断用户是否登录， 如未登录，跳转到登录页面
            if(!_this.uid){
                _this.goLogin()
                return
            }
            //判断时候有合同ID 如果没有说明合同为空
            if(!_this.conId){
                _this.hasContract = false
                _this.hideLoading()
                //_this.$vux.toast.text('合同ID获取失败', 'middle')
                return
            }
            let data = {
                userid: _this.uid,
                contractid: _this.conId
            }
            //调接口使用数据
            // data = {
            //     userid: 'Tk9m*gZIFyY-',
            //     contractid: '1'
            // }
            contract(data).then(function(res){
                _this.hideLoading()
                if(res.ReturnCode == '0'){
                    _this.info = res.Data
                    _this.canSubmit = true //可以提交合同
                    _this.hasContract = true //可以显示合同
                }else if(res.ReturnCode == '110'){
                    _this.$vux.toast.text('没有当前合同编号的合同', 'middle')
                    _this.hasContract = false //没有合同
                }else{
                    _this.$vux.toast.text('系统错误', 'middle')
                    _this.hasContract = false //没有合同
                }
                _this.hasAjax = true
            })
        },
        toggleAgree() {
            if(!this.from){
                return
            }
            this.agree = this.agree ? false : true
        },
        contractSubmit() {
            if(!this.canSubmit){
                this.$vux.toast.text('系统错误暂时不能提交', 'middle')
                return
            }else if(!this.agree){
                this.$vux.toast.text('请先勾选“我已阅读合同条款”','bottom');
                return
            }else{
                //提交
                this.$router.push('contractSignature?conId=' + this.conId)
            }
        },
        //跳转合同预览页面
        toPreview() {
            this.$router.push('contractPreview?conId=' + this.conId)
        },
        //设置租凭类型 1合租2整租
        setRentType(int) {
            let type = ''
            if(int == 1){
                type = '合租'
            }else{
                type = '整租'
            }
            return type
        },
        //返回中文字符
        setCHN(int) {
            let strArr = ['零','一','二','三','四','五','六','七','八','九'],
                str = ''
            if(int < 10){
                str = strArr[int]
            }else{
                let a = Math.floor(int/10)
                let b = int - (a * 10)
                if(b == 0){
                    str = strArr[a] + '十'
                }else{
                    str = strArr[a] + '十' + strArr[b]
                }
                str = str.replace('一十', '十')
            }
            return str
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/pages/contract";
</style>

