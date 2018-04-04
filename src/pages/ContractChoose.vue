<template>
    <div class="contract-choose" v-show="pageShow">
		<div class="title">请选择您将查看的合同</div>
	    <ul>
		    <li class="list-item tap-active" v-for="(item, index) in listData" :class="{'on': checked === index}" @click="goOrigin(index)">
			    <i></i>
			    <p class="list-name">
				    {{ item.HouseName }}-
				    {{ rentTypes[item.RentType] }}-{{ item.MonthlyRent }}元
			    </p>
			    <p class="date">租期：{{ formatDate(item.StartDate) }}-{{ formatDate(item.EndDate) }}</p>
		    </li>
	    </ul>
    </div>
</template>
<script>
import { getUrlParams, setUrlParams, ss, dateParse } from '../common/util'
import { rentType } from '../common/config'
import { contractList } from '../common/api'
import BeiAn from '../components/BeiAn'

var rentTypes = {}
rentType.forEach(item => {
    rentTypes[item.id] = item.name
})

export default {
    data() {
        return {
			url: window.location.href,
            checked: 0, //选中项
            pageShow: false,
	        listData: [],
            rentTypes
        }
    },
    created(){
        this.setTitle('选择合同')
	    this.userId = this.isLogin()
	    if (!this.userId) {
            this.goLogin()
            return
	    }
        this.origin = getUrlParams('origin', this.url) || 'onlinePay'
		this.getData()
    },
    methods: {
        getData() {
/*			let list = []
	        for (var i = 0; i < 10; i++) {
                list.push({
                    ContractID: i+3,
                    HouseID: i*2+1,
                    RoomID: i*3+1
                })
	        }
	        this.listData = list
	        this.pageShow = true*/

            contractList({
                userid: this.userId
            }).then(res => {
                this.hideLoading()
                if (res.ReturnCode == '0' && res.Data != '') {
                    this.listData = res.Data
					if (res.Data.length === 1) {
                        this.goOrigin(0, true)
						return
					}
                    this.pageShow = true
                } else if (res.ReturnCode == 110) {
					this.goOrigin(0, true)
                } else {
                    this.$vux.toast.text('页面加载失败，请重试')
                }
            })
        },
	    formatDate(date) {
            return dateParse(date, 'yyyy.MM.dd')
	    },
        goOrigin(index, one) {
            this.checked = index
	        let empty = {
                ContractID: '',
                HouseID: '',
                RoomID: ''
	        }
	        let obj = this.listData[index] || empty
            /*obj.IsDeposit = 2
	        obj.IsDepositBill = 1
	        obj.IsDepositPay = 1
	        obj.IsSign = 1*/
	        ss.set('contractInfo', JSON.stringify(obj))
            let url = setUrlParams({
                conId: obj.ContractID,
                houseId: obj.HouseID,
                roomId: obj.RoomID
            }, this.origin)
	        if (one) {
                this.$router.replace(url)
                return
	        }
	        setTimeout(() => {
                this.$router.push(url)
            }, 50)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/base";
.contract-choose{
	width: 100%;
	height: 100%;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;

	.title{
		padding: 0 .3rem;
		height: .9rem;
		line-height: .9rem;
		color: #999;
		background: #efefef;
		margin-bottom: 2px;
	}
	.list-item{
		padding: .24rem .3rem .24rem 1rem;
		@include setLine(bottom, #eee);

		i{
			width: .38rem;
			height: .38rem;
			@include bgImg('contract-choose.png');
			position: absolute;
			left: .3rem;
			top: 50%;
			margin-top: -0.19rem;
			display: none;
		}
		&.on i{
			display: block;
		}
	}
	.list-name{
		color: #333;
		line-height: 1.5;
	}
	.date{
		padding-top: .2rem;
		color: $light-font-color;
	}
}
</style>

