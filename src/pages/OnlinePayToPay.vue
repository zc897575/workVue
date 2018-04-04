<template>
    <div class="online-pay" :class="{'more-pay-bg': (payType === 'more')}">
        <div class="first-pay">
            <pay-header :rentName="rentName" :rentType="rentType" :price="price"></pay-header>
            <!--定金-->
            <template v-if="frontPay">
                <div class="pay-list">
                    <div class="pay-row">
                        <p>
                            <span class="align-left">定金</span>
                            <span class="align-right">{{ front }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">月租金{{ price }}/月X30%</span>
                        </p>
                    </div>
                </div>
            </template>
            <!--全额-->
            <template v-if="rentalPay">
                <div class="pay-list">
                    <div class="pay-row">
                        <p>
                            <span class="align-left">租金</span>
                            <span class="align-right">{{ price * payMonth }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">月租金{{ price }}/月X{{ payMonth }}月</span>
                        </p>
                    </div>
                    <div class="pay-row">
                        <p>
                            <span class="align-left">押金</span>
                            <span class="align-right">{{ price * pledgeMonth }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">月租金{{ price }}/月X{{ pledgeMonth }}月</span>
                        </p>
                    </div>
                    <div class="pay-row" v-if="server">
                        <p>
                            <span class="align-left">服务费</span>
                            <span class="align-right">{{ server }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">{{ startTime }} - {{ endTime }}</span>
                            <span class="align-right" v-if="isCutr">原价{{ totalServer }}元，已折扣{{ isCutr }}元</span>
                        </p>
                    </div>
                    <p v-if="server && isCutr" class="cutr-tip">活动期间服务费折扣{{ cutr }}%</p>
                </div>
            </template>
            <!--尾款-->
            <template v-if="lastPay">
                <div class="pay-list">
                    <div class="pay-row">
                        <p>
                            <span class="align-left">房租尾款</span>
                            <span class="align-right">{{ lastSum }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">租金+押金-定金</span>
                        </p>
                    </div>
                    <div class="pay-row" v-if="server">
                        <p>
                            <span class="align-left">服务费</span>
                            <span class="align-right">{{ server }}<i>元</i></span>
                        </p>
                        <p class="sub-row">
                            <span class="align-left">{{ serverDate }}</span>
                            <span class="align-right" v-if="isCutr">原价{{ totalServer }}元，已折扣{{ isCutr }}元</span>
                        </p>
                    </div>
                    <p v-if="server && isCutr"  class="cutr-tip">活动期间服务费折扣{{ cutr }}%</p>
                </div>
            </template>
            <pay-btn :payData="payData" :amount="precise[1]" :payType="payId"
                     className="long-btn pay-btn" :text="precise[0]"
                     @pay-success="paySuccess"
            >

            </pay-btn>
        </div>
    </div>
</template>

<script>
    import VHeader from '../components/Header'
    import PayHeader from '../components/PayHeader'
    import PayBtn from '../components/PayBtn'
    import { getUrlParams, setUrlParams, ss} from '../common/util'
    import { appid, payType, aliJs } from '../common/config'
    import { payList, wxSignature, wxOpenid, createOrder, wxPay, contractList } from '../common/api'
    import BeiAn from '../components/BeiAn'

    var code = getUrlParams('code', window.location.href, 0)
    var oldCode = ss.get('code')
    var payTypes = {}
    payType.forEach(item => {
        payTypes[item.id] = item.name
    })
    export default {
        components: {
            VHeader,
            PayHeader,
            PayBtn,
            BeiAn
        },
        data () {
            return {
                payTypes: payType,
                payType: '', //first首次支付房租 more非首次
                hasRental: true, //是否有房租账单
                hasFront: true, //是否有定金账单
                frontPay: false, // 支付定金
                rentalPay: false, // 支付全款租金
                lastPay: false, //尾款支付
                paySum: 0, //首次支付金额
                payId: 0, //房租支付类型
                paySelected: 'rental', //选择项 front订金 rental租金
                front: 0, //订金
                rental: 0, //租金
                server: 0, //最终服务费
                totalServer: 0, //原价
                cutr: 0, //折扣百分比
                isCutr: 0, //已减去
                serverDate: '', //服务开始结束时间
                rentalText: '', //房租提示词
                lastSum: 0, //尾款金额
                price: 0, // 房屋单价
                rentType: '', // 租房类型 1 合租  2 整租
                rentName: '', // 房源名
                totalMonth: 0, // 总月数
                pledgeMonth: 0, // 押金月数
                payMonth: 0, // 付款月数
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                ContractName: '', // 合同类型

                totalSum: 0, //非首次支付总额
                totalId: 0, //支付总额Id
                url: window.location.href,
                payEmpty: false, //是否有待支付账单
                payData: { //支付基础数据
                    houseId: 0, //房源ID
                    roomId: 0, //房间ID
                    userId: 0, //用户ID
                }
            }
        },
        created() {
            this.setTitle('在线支付')
            this.userId = this.isLogin()
            this.conId = getUrlParams('conId', this.url)
            this.houseId = getUrlParams('houseId', this.url)
            this.roomId = getUrlParams('roomId', this.url)
            this.paySelected = getUrlParams('type', this.url)
            if (!this.userId) {
                this.goLogin()
                return
            }
            if (!this.conId) {
                this.hideLoading()
                this.payEmpty = true
                return
            }

            this.payData = {
                houseId: this.houseId, //房源ID
                roomId: this.roomId, //房间ID
                userId: this.userId, //用户ID
            }
            this.getContract()
            this.aliLoad()
        },
        computed: {
        	// 数字格式化
            precise() {
                let temp = '',
                    count = 0
                let sum = Math.round((this.paySum || this.lastSum + this.server) * 100) / 100
                sum = sum.toString() // 金额转为字符串
                const sumArr = sum.split('.') // 金额更具小数点划分
                // 遍历整数按千位划分整数
                for(let i = sumArr[0].length ; i > 0; i--) {
                    count++
                    temp = sumArr[0][(i - 1)] + temp
                    if(count % 3 == 0 && count < sumArr[0].length) {
                        temp = ',' + temp
                    }
                }
                // 截取2位小数不四舍五入 直接截取 如果没有则显示00
                if (sumArr[1]) {
                    sumArr[1] = sumArr[1].substring(0, 2)
                } else {
                    sumArr[1] = '00'
                }
                // 拼接字符串
                var payArray =  ['支付 ' + temp + '.' + sumArr[1], (temp + '.' + sumArr[1])]
                return payArray
            }
        },
        methods: {
            oauthUrl() {
                var href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+  encodeURIComponent(this.url)+'&response_type=code&scope=snsapi_base&state=yudoodoo#wechat_redirect'
                window.location.replace(href)
            },
            //去签合同
            goContract() {
                let url = setUrlParams({
                    conId: this.conId,
                    houseId: this.houseId,
                    roomId: this.roomId
                }, 'contract')
                this.$router.push(url)
            },
            paySuccess(list) { //支付成功
                ss.remove('contractInfo')
                if (this.ContractName == '服务费版本') {
                    if (this.payId === this.payTypes[7].id + this.payTypes[8].id + this.payTypes[13].id || list) { //尾款
                        this.payType = 'more'
                       // this.getList ()
                    } else {
                        this.goContract ()
                    }
                } else {
                    if (this.payId === this.payTypes[7].id + this.payTypes[8].id || list) { //尾款
                        this.payType = 'more'
                       // this.getList()
                    } else {
                        this.goContract()
                    }
                }
            },
            //获取合同数据
            getContract() {
                let contractInfo = ss.get('contractInfo')
                try {
                    contractInfo = JSON.parse(contractInfo)
                } catch (e) {
                    contractInfo = {}
                }
                if (contractInfo.ContractID == this.conId) {
                    this.getStats(contractInfo)
                    return
                }
                contractList({
                    userid: this.userId
                }).then(res => {
                    this.hideLoading()
//                    res.ReturnCode = '0'
//                    res.Data = [{
//                        HouseName: '测试房源',
//                        /// <summary>
//                        /// 租房类型1合租2整租
//                        /// </summary>
//                        RentType: 2,
//
//                        /// <summary>
//                        /// 修改后的租金
//                        /// </summary>
//                        ActualMonthlyRent: 5000,
//
//                        /// <summary>
//                        /// 每月租金
//                        /// </summary>
//                        MonthlyRent: 3000,
//
//                        StartDate: '2018/1/2 12:00',
//                        EndDate: '2018/9/2 12:00',
//                        /// <summary>
//                        /// 是否首次支付，0是1否
//                        /// </summary>
//                        IsFirst: 0,
//                        /// <summary>
//                        /// 是否支付定金，0没付1已付定金2已付房租或尾款
//                        /// </summary>
//                        IsDeposit: 0,
//                        /// <summary>
//                        /// 是否签名，0否1是
//                        /// </summary>
//                        IsSign: 1,
//                        HouseID: '1001',
//                        RoomID: '3487',
//                        /// <summary>
//                        /// 付几月
//                        /// </summary>
//                        PaymentMonth: 10,
//                        /// <summary>
//                        /// 押几月
//                        /// </summary>
//                        PledgeMonth: 3,
//                        /// <summary>
//                        /// 支付类型
//                        /// </summary>
//                        PayType: '',
//                        /// <summary>
//                        /// 合同ID
//                        /// </summary>
//                        ContractID: '01',
//                        /// <summary>
//                        /// 是否支持定金支付0否1是
//                        /// </summary>
//                        IsDepositPay: 1,
//                        /// <summary>
//                        /// 是否有定金账单0否1是
//                        /// </summary>
//                        IsDepositBill: 1,
//                        /// <summary>
//                        /// 是否有房租账单0否1是
//                        /// </summary>
//                        IsRentBill: 1,
//                    }]
                    if (res.ReturnCode == '0' && res.Data != '') {
                        let hasCon = false
                        res.Data.some(item => {
                            if (item.ContractID == this.conId) {
                                hasCon = true
                                this.getStats(item)
                                return true
                            }
                        })
                        if (!hasCon) {
                            this.payEmpty = true
                            this.payType = 'none'
                        }
                    } else {
                        this.payEmpty = true
                        this.payType = 'none'
                    }
                })
            },
            //获取支付状态 (首次支付、尾款、签订合同等)
            getStats(contractInfo) {

                /*
                 * IsDeposit 是否支付定金，0没付 1已付定金 2已付房租或尾款
                 * IsSign 是否签名，0否 1是
                 * */
                if (contractInfo.IsDeposit != 0 && contractInfo.IsSign == 0) {
                    this.goContract()
                    return
                }
                if (contractInfo.IsDeposit == 2) { //非首次支付
                    this.payType = 'more'
                    this.getList()
                    return
                }
                this.hideLoading()
                //首次支付
                this.payType = 'first'
                /*
                 * IsDepositBill 是否有定金账单0否1是
                 * IsDepositPay  是否支持付定金 0否1是
                 * IsRentBill  是否有房租账单0否1是
                 * */
                if (contractInfo.IsRentBill == 0) {
                    this.hasRental = false
                }
                if (contractInfo.IsDepositPay == 0 || contractInfo.IsDepositBill == 0) {
                    this.hasFront = false
                }
                //没付定金且没有定金账单和房租账单
                if (contractInfo.IsDeposit == 0 && contractInfo.IsDepositBill == 0 && contractInfo.IsRentBill == 0) {
                    this.payEmpty = true
                    this.payType = 'none'
                    return
                }

                /*
                 * PaymentMonth  付几月
                 * PledgeMonth 押几月
                 * MonthlyRent 每月租金
                 * */
                //总月数
                this.totalMonth = contractInfo.PaymentMonth + contractInfo.PledgeMonth
                //付月数
                this.payMonth = contractInfo.PaymentMonth
                //押月数
                this.pledgeMonth = contractInfo.PledgeMonth
                //服务费
                this.totalServer = contractInfo.ServiceCharge // 原价
                this.cutr = contractInfo.DisCount // 折扣
                this.isCutr = Math.ceil(this.totalServer * (this.cutr)) / 100 // 已减去
                this.server = this.totalServer - this.isCutr // 最终服务费
                if (contractInfo.ServiceStartDate && contractInfo.ServiceEndDate) {
                    this.serverDate = contractInfo.ServiceStartDate.split (' ')[0] + '-' + contractInfo.ServiceEndDate.split (' ')[0]
                }
                //总金额
                var total = this.totalMonth * contractInfo.MonthlyRent + this.server || 0
                //订金
                this.front = Math.ceil(contractInfo.MonthlyRent * 30) / 100 || 0
                // 租金
                this.rental = total
                // 单价
                this.price = contractInfo.MonthlyRent
                // 租房类型
                this.rentType = contractInfo.RentType == 1 ? '合租' : '整租'
                // 房源名
                this.rentName = contractInfo.HouseName
                //尾款
                this.lastSum = Math.round((total - this.server - this.front) * 100 ) / 100
                // 开始结束时间
                this.startTime = contractInfo.StartDate.split(' ')[0]
                this.endTime = contractInfo.EndDate.split(' ')[0]
                this.ContractName = contractInfo.ContractName
                if (contractInfo.IsDeposit == 0) { //房租
                    if(this.paySelected === 'rental') {
                    	this.rentalPay = true
                        if (this.ContractName == '服务费版本') {
                            this.payId = this.payTypes[4].id + this.payTypes[8].id + this.payTypes[13].id
                        } else {
                            this.payId = this.payTypes[4].id + this.payTypes[8].id
                        }
                    } else if(this.paySelected === 'front'){
                    	this.frontPay = true
                        this.payId = this.payTypes[3].id
                    }
                } else { //尾款
                    this.lastPay = true
                    // this.paySum = this.lastSum
                    if (this.ContractName == '服务费版本') {
                        this.payId = this.payTypes[7].id + this.payTypes[13].id
                    } else {
                        this.payId = this.payTypes[7].id
                    }
                }
                //支付切换
                this.paySum = this[this.paySelected]
            },
            //获取待付费列表
//            getList() {
//                /*const listData = [
//                 {
//                 payId: 1,
//                 price: 123.343,
//                 },
//                 {
//                 payId: 2,
//                 price: 2323.343,
//                 },
//                 {
//                 payId: 4,
//                 price: 123.343,
//                 },
//                 {
//                 payId: 32,
//                 price: 2323.343,
//                 }
//                 ]
//                 listData.map(item => {
//                 return item.name = payTypes[item.payId]
//                 })
//                 this.listData = listData
//                 this.hideLoading()
//                 this.countTotal()*/
//
//                payList({
//                    userid: this.userId,
//                    contractid: this.conId,
//                    time: +new Date()
//                }).then(res => {
//                    this.hideLoading()
//                    if (res.ReturnCode == '0' && res.Data != '') {
//                        res.Data.forEach((item, index) => {
//                            res.Data[index].payId = item.PayType
//                            res.Data[index].price = item.ShouldAmount
//                            res.Data[index].name = payTypes[item.PayType]
//                            res.Data[index].startDate = (item.FinanceStarDate || '')
//                            res.Data[index].endDate = (item.FinanceEndDate || '')
//                            res.Data[index].cut = (item.Discount || '')
//                        })
//                        this.listData = res.Data
//                        this.countTotal()
//                    } else if (res.ReturnCode == 110) {
//                        this.payEmpty = true
//                    } else {
//                        this.oauthUrl()
//                    }
//                })
//            },
            //微信签名
            signature(res) {
                /*var data = {}
                 try {
                 res.signature = JSON.parse(res.signature)
                 res.signature.forEach(item => {
                 data[item.Key] = item.Value
                 })
                 wx.config({
                 debug: false,
                 appId: appid,
                 timestamp: data.timestamp,
                 nonceStr: data.nonceStr,
                 signature: data.signature,
                 jsApiList: ['onMenuShareTimeline', 'chooseWXPay']
                 })
                 wx.ready(function () {
                 wx.onMenuShareTimeline({
                 title: '寓多多-来了',
                 link: 'http://testapi.yudoodoo.com/wap/',
                 imgUrl: 'http://testapi.yudoodoo.com/wap/static/img/favicon.png',
                 desc: '寓多多-挺好的呀',
                 trigger: function (res) {
                 //alert('用户点击分享到朋友圈');
                 },
                 success: function (res) {
                 //alert('已分享');
                 },
                 cancel: function (res) {
                 //alert('已取消');
                 },
                 fail: function (res) {
                 //alert(JSON.stringify(res));
                 }
                 })
                 })
                 }catch (e) {
                 this.$vux.toast.text('微信签名失败，请重试')
                 }*/
            },
            //获取签名数据
            getSignature() {
                wxSignature({
                    url: encodeURIComponent(this.url.split('#')[0])
                }).then(res => {
                    if (res.ReturnCode == '0' && res.Data) {
                        this.signature(res.Data)
                    } else {
                        this.$vux.toast.text('微信签名失败，请重试')
                    }
                })
            },
            aliLoad() {
                if (window._AP) {
                    return
                }
                var script = document.createElement('script')
                script.defer = true
                script.async = true
                script.src = aliJs
                document.body.appendChild(script)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/css/pages/onlinePay";

</style>
