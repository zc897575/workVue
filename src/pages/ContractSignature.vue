<template>
    <div class="signature-body">
        <p class="text-top">请在下方进行签名，完成<span @click="toPreview">《上海市居住房屋租赁合同》</span>的签署</p>
        <div ref="signatureBox" class="signature-box" @touchstart="removeText">
            <signature ref="signature"></signature>
            <span ref="tip" class="signatureTip">请在此签名...</span>
        </div>
        <p class="text-tip">注：签名提交后将无法修改，因租客自身原因造成的签名错误，由租客自行承担，请您认真填写</p>
        <div class="btn-box">
            <button type="button" class="long-btn save" ref="save" @click="save">确&nbsp;&nbsp;定</button>
            <button type="button" class="clear" @click="clear">重新签名</button>
        </div>
    </div>
</template>
<script>
import { getUrlParams } from '../common/util'
import Signature from '../components/Signature'
import { conSignature } from '../common/api'
import BeiAn from '../components/BeiAn'

export default {
    data() {
        return {
            msg: "ContractSignature",
            uid: this.isLogin(),
            conId: getUrlParams('conId')
        }
    },
    components: {
        Signature
    },
    created() {
        this.setTitle("签订合同")
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let _this = this
            //获取用户id判断是否登录
            if(!_this.uid){
                _this.goLogin()
                return
            }
            //调接口使用数据
            // _this.uid = 'Tk9m*gZIFyY-',
            // _this.conId = '1'
            if(!_this.conId){
                _this.$vux.toast.text('合同ID获取失败','middle');
            }
        },
        removeText() {
            this.$refs.tip.setAttribute('class','hideTip')
        },
        save() {
            let _this = this
            if(!_this.conId){
                _this.$vux.toast.text('合同ID获取失败','middle');
                return
            }
            _this.$refs.signature.save().then(res => {
                _this.sendToServe(res)
            })
        },
        clear() {
            this.$refs.signature.clear()
            this.$refs.tip.setAttribute('class','signatureTip')
        },
        sendToServe(imgBeas64) {
            let _this = this
            conSignature(_this.$refs.save, {
                userid: _this.uid,
                contractid: _this.conId,
                imgbase: imgBeas64
            }).then(function(res){
                if(res.ReturnCode == '0'){
                    //签名成功跳转成功页面
                    _this.$router.push('contractSuccess?conId=' + _this.conId)
                }else if(res.ReturnCode == '1301'){
                    _this.$vux.toast.text('您已签过名了','middle');
                    _this.$router.push('contractSuccess?conId=' + _this.conId)
                }else if(res.ReturnCode == '10002'){
                    _this.$vux.toast.text('签名图片为空，请重新签名','middle');
                }else{
                    _this.$vux.toast.text('系统错误，签名失败','middle');
                }
            })
        },
        toPreview() {
            this.$router.push('contractPreview?conId=' + this.conId)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/pages/contractSignature";
</style>


