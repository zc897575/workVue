<template>
    <div class="repair-detail-body">
        <div class="feedback-mask" v-show="showFeedbackMak" @touchmove.prevent>
            <div class="feedback-panel">
                <div class="panel-heanding">
                    <span>维修反馈</span>
                    <i @click="clickRemoveBtn()"></i>
                </div>
                <textarea name="" class="feedback-text" id="feedbackText" placeholder="请描述您反馈的问题..." maxlength="140"
                          v-model="content">

                </textarea>
                <div class="text-count">
                    <span>{{countNun}}</span> / 140
                </div>
                <a class="submit-content" href="javascript:void (0)" @click="submitCon()">确 定</a>
            </div>
        </div>
        <div class="warring-container" v-show="refuse && !!RefuseRemark">
            {{RefuseRemark}}
        </div>
        <div class="repair-metre">
            <flow>
                <flow-state state="1" title="待维修" :class="{'weui-wepay-flow__li_done': detail.Status>=1}"></flow-state>
                <flow-line  :class="{'weui-wepay-flow__line_done':detail.Status>=2}"></flow-line>
                <flow-state state="2" title="待施工"  :class="{'weui-wepay-flow__li_done':detail.Status>=2}"></flow-state>
                <flow-line  :class="{'weui-wepay-flow__line_done':detail.Status>=3}"></flow-line>
                <flow-state state="3" title="施工中"  :class="{'weui-wepay-flow__li_done':detail.Status>=3}"></flow-state>
                <flow-line  :class="{'weui-wepay-flow__line_done':detail.Status>=4}"></flow-line>
                <flow-state state="4" title="待确认"  :class="{'weui-wepay-flow__li_done':detail.Status>=4}"></flow-state>
                <flow-line :class="{'weui-wepay-flow__line_done':detail.Status>=5}"></flow-line>
                <flow-state state="5" title="已完成" :class="{'weui-wepay-flow__li_done':detail.Status>=5}"></flow-state>
            </flow>
        </div>
        <div class="repair-detail-container">
            <div class="detail-list detail-ellipsis01">
                <span class="detail-heading">报修单号： </span><span>{{detail.RepairCode}}</span>
                <span v-if="detail.Status==4" class="btn-feekback" @click="clickFeedbackBtn()">维修反馈</span>
            </div>
            <div class="detail-list detail-ellipsis01">
                <span class="detail-heading">报修时间： </span><span>{{repairTime(detail.RepairTime, "MM.dd hh:mm")}}</span>
            </div>
            <div class="detail-list detail-ellipsis01">
                <span class="detail-heading">报修物品： </span><span>{{detail.RepairArticles}}</span>
            </div>
            <div class="detail-list detail-ellipsis2">
                <div class="detail-ellipsis02">
                    <span class="detail-heading">问题描述： </span><span>{{detail.Description}}</span>
                </div>
            </div>
            <div class="detail-list detail-ellipsis01" v-show="detail.Status>=4 && !refuse">
                <span class="detail-heading">维修费用： </span><span class="font-color">{{detail.PayAmount}} 元</span>
            </div>
        </div>
        <div v-if="imgList.length > 0 " class="upload-imgs">
            <span class="heading-title">上传图片：</span>
            <ul class="img-list">
                <li v-for="(item, index) in imgList" :key="index">
                    <img :src="item.ImgAddress" >
                </li>
            </ul>
        </div>
        <div v-if="response.length > 0" class="feedback-container">
            <div class="feedback-content">
                <span class="heading-title">反馈内容：</span>
                <ul class="feedback-list">
                    <li v-for="(item, index) in response" :key="index">
                        <p>{{item.Description}}</p>
                        <span>{{repairTime(item.CreateTime, "yyyy.MM.dd hh:mm")}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-confirm-container" v-if="detail.Status==4">
            <button class="long-btn" @click="successBtn()">确 认</button>
        </div>
    </div>
</template>

<script>
    import {getUrlParams} from '../common/util'
    import {repairDetail, repairFeedback, repairSuccess} from '../common/api'
    import {Flow, FlowState, FlowLine} from 'vux'
    import BeiAn from '../components/BeiAn'

    export default {
        components: {
            Flow,
            FlowState,
            FlowLine,
            BeiAn
        },
        data () {
            return {
                showWarring: true,//显示提示
                showFeedbackMak: false,//显示反馈框
                content: '',
                uid: this.isLogin(),
                repairId: getUrlParams('repId'),
                conId: getUrlParams('conId'),
                HouseId: getUrlParams('houseId'),
                RoomId: getUrlParams('roomId'),
                detail: {},
                refuse: false, //是否拒绝报修
                imgList: [],
                response: [],
                RefuseRemark: ''
            }
        },
        computed: {
            countNun() {
                return this.content.length
            },
        },
        created() {
            this.setTitle('报修详情')
            this.initPage()
        },
        methods: {
            clickFeedbackBtn() {
                this.showFeedbackMak = !this.showFeedbackMak
            },
            clickRemoveBtn() {
                this.showFeedbackMak = !this.showFeedbackMak
                this.content = ''
            },
            submitCon() {
                let _this = this
                let data = {
                    repairId: _this.repairId,
                    feedBackRemark: _this.content
                }
                //判断输入内容是否为空
                if(_this.content.replace(/(^\s*)|(\s*$)/g, "") == ''){
                    _this.$vux.toast.text('请填写反馈内容', 'middle')
                    return
                }
                repairFeedback(data).then(function(res){
                    if(res.ReturnCode == '0'){
                        _this.showLoading()
                        _this.initPage()
                        _this.$vux.toast.text('反馈成功', 'middle')
                    }else if(res.ReturnCode == '110'){
                        _this.$vux.toast.text('此报修单不存在', 'middle')
                    }else{
                        _this.$vux.toast.text('系统错误', 'middle')
                    }
                    _this.content = ''
                    _this.showFeedbackMak = !_this.showFeedbackMak
                })
            },
            successBtn() {
                let _this = this
                let data = {
                    repairId: _this.repairId,
                    type: 1
                }
                repairSuccess(data).then(function(res){
                    if(res.ReturnCode == '0'){
                        _this.$vux.toast.text('报修完成', 'middle')
                        //判断费用是否需要前往支付
                        if(_this.detail.PayAmount > 0){
                            _this.$router.push('onlinePay?conId=' + _this.conId + '&houseId=' + _this.HouseId + '&roomId=' + _this.RoomId)
                        }else{
                            _this.showLoading()
                            _this.initPage()
                        }
                    }else if(res.ReturnCode == '110'){
                        _this.$vux.toast.text('此报修单不存在', 'middle')
                    }else{
                        _this.$vux.toast.text('系统错误', 'middle')
                    }
                })
            },
            initPage() {
                let _this = this
                //判断用户是否登录， 如未登录，跳转到登录页面
                if(!_this.uid){
                    _this.goLogin()
                    return
                }
                if(!_this.repairId){
                    _this.$vux.toast.text('参数有误', 'middle')
                    _this.hideLoading()
                    return
                }
                let data = {
                    repairId: _this.repairId
                }
                repairDetail(data).then(function(res){
                    _this.hideLoading()
                    if(res.ReturnCode == '0'){
                        data = res.Data
                        _this.detail = data.Detail
	                    if (_this.detail.Status == 6) {
                            _this.detail.Status = 0
                            _this.refuse = true
	                    }
                        _this.imgList = data.RepairImgResponseArr
                        _this.response = data.FeedBackDataResponse
                        _this.RefuseRemark = data.RefuseRemark
                    }else if(res.ReturnCode == '110'){
                        _this.$vux.toast.text('保修数据为空', 'middle')
                    }else{
                        _this.$vux.toast.text('系统错误', 'middle')
                    }
                })
            },
            repairTime(time, fmt) {
                let Time = this.TimeFormat(time, fmt)
                return Time
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/css/pages/repairDetail";
</style>
<style lang="scss">
    @import "../assets/css/base";

    .weui-wepay-flow {
        //   进度部分   ----   begin  ---
        .weui-wepay-flow, .weui-wepay-flow-auto {
            padding: .8rem .5rem 1.1rem;
        }

        .weui-wepay-flow__li {
            height: .54rem;
            width: .54rem;
            border: .01rem solid #eee;
            -webkit-border-radius: 50%;
            border-radius: 50%;

            .weui-wepay-flow__state {
                position: absolute;
                left: 0;
                top: 0;
                width: .5rem;
                height: .5rem;
                font-size: 10px;
                line-height: .5rem;
                text-align: center;
                color: #FFF;
                border-radius: 50%;
                box-sizing: border-box;
            }
        }

        .weui-wepay-flow__li_done .weui-wepay-flow__state {
            background-color: $main-color;
            width: .5rem;
            height: .5rem;
            border-radius: 50%;
            line-height: .5rem;
        }

        .weui-wepay-flow__title-bottom {
            position: absolute;
            top: .6rem;
            left: 50%;
            font-size: .28rem;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
        }

        .weui-wepay-flow__process {
            display: block;
            background: #bcbcbc;
            @include setLine(top, #eee);
            @include setLine(bottom, #eee);

        }

        .weui-wepay-flow__line_done .weui-wepay-flow__process {
            background-color: $main-color;
        }

        //  进度条部分 ---  end  ---
    }
</style>
