<template>
    <div class="success-body" v-if="canShow">
        <div class="success-main">
            <p class="success-title">感谢您选择寓多多</p>
            <img class="success-img" src="../assets/img/contract-success.png" />
            <p class="success-text">您的电子协议已生成</p>
            <p class="success-text"><span class="yellow-text">《上海市居住房屋租赁合同》</span>建议在WIFI环境下载</p>
        </div>
        <a class="long-btn download-btn" :href="FilePath" target="_blank">保存到本地</a>
    </div>
</template>
<script>
import { getUrlParams } from '../common/util'
import { conSuccess } from '../common/api'
import BeiAn from '../components/BeiAn'

export default {
    components: {
        BeiAn
    },
    created() {
        this.setTitle('签约成功')
    },
    data() {
        return {
            msg: "ContractSuccess",
            uid: this.isLogin(),
            conId: getUrlParams('conId'),
            FilePath: '',
            canShow: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let _this = this
            if(!_this.conId){
                _this.$vux.toast.text('合同ID获取失败', 'middle')
                return
            }
            //获取用户id判断是否登录
            if(!_this.uid){
                _this.goLogin()
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
            conSuccess(data).then(function(res){
                if(res.ReturnCode == '0'){
                    _this.canShow = true
                    _this.FilePath = res.Data.FilePath
                }else if(res.ReturnCode == '110'){
                    _this.$vux.toast.text('无合同PDF数据', 'middle')
                }else{
                    _this.$vux.toast.text('获取合同路径失败', 'middle')
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/pages/contractsuccess';
</style>
