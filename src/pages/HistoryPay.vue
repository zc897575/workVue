<template>
	<div class="history-pay">
		<scroller ref="scroll" :data="listData" @pullup="loadMore">
			<div class="scroll-wrap">
				<template v-for="(value, key) in listData">
					<div class="title" :key="key">
						<span class="date">{{ value.year }}年{{ value.month }}月</span>
						<span class="expend">
							支出：<span class="number">{{ value.total }}</span>
						</span>
					</div>
					<ul class="list" :key="key">
						<li class="list-item" v-for="(item, index) in value.list" :key="item.id">
							<div class="info">
								<p class="text">{{ item.name }}</p>
								<p class="date">缴费时间：{{ item.date }}</p>
							</div>
							<span class="money">{{ item.price }}元</span>
						</li>
					</ul>
				</template>
			</div>
		</scroller>
		<div class="pay-empty" v-show="payEmpty">
			<i></i>
			<p>暂无缴费记录</p>
		</div>
	</div>
</template>

<script>
import Scroller from '../components/Scroller'
import { historyPayList } from '../common/api'
import { payType } from '../common/config'
import { getUrlParams, dateParse } from '../common/util'
import BeiAn from '../components/BeiAn'

var payTypes = {}
payType.forEach(item => {
    payTypes[item.id] = item.name
})

export default {
    components: {
        Scroller,
        BeiAn
    },
    data () {
        return {
            pageIndex: 1, //当前页
            pageTotal: 3, //总页数
            listData: [],
	        listObj: {},
	        url: window.location.href,
            payEmpty: false, //是否为空
        }
    },
    mounted() {
        this.setTitle('历史缴费')
        this.userId = this.isLogin()
        this.conId = getUrlParams('conId', this.url)
	    if (!this.conId) {
            this.hideLoading()
            this.payEmpty = true
            return
	    }
		this.getList()
    },
    methods: {
        numAdd(a, b) {
            return Math.ceil(a*1000 + b*1000) / 1000
        },
        getList() {
            /*let data = []
            for (var i = 0; i < 10; i++) {
                data.push({
                    ActualAmount: (Math.random() * 1254).toFixed(3),
                    PayTime: Math.ceil(Math.random() * 12),
                    PayType: Math.pow(2, i)
                })
            }
            setTimeout(() => {
                this.dataHandler(data)
                if (this.pageIndex >= this.pageTotal) {
                    this.$refs.scroll.noMoreChange(true)
                } else {
                    this.$refs.scroll.noMoreChange(false)
                }
            }, 100)
            this.hideLoading()
	        return*/

            historyPayList({
                pageindex: this.pageIndex,
				userid: this.userId,
                contractid: this.conId
            }).then(res => {
                this.hideLoading()
				if (res.ReturnCode == '0' && res.Data && res.Data.List != '') {
                    this.dataHandler(res.Data.List)
                    this.pageTotal = res.Data.PageCount

                    if (this.pageIndex >= this.pageTotal) {
                        this.$refs.scroll.noMoreChange(true)
                    } else {
                        this.$refs.scroll.noMoreChange(false)
                    }
				} else if (res.ReturnCode == 110) {
                    this.pageIndex === 1 && (this.payEmpty = true)
				}else {
                    this.$vux.toast.text('页面加载失败，请刷新页面重试')
				}
            })
        },
	    dataHandler(data) {
            data.forEach((item) => {
                let payTime = item.PayTime*1000
	            let date =  new Date(payTime)
	            let key = date.getFullYear()*100 + date.getMonth()
                if (!this.listObj[key]) {
                    this.listObj[key] = [{
                        price: item.ActualAmount,
	                    id: item.ID,
	                    name: payTypes[item.PayType],
	                    date: dateParse(payTime, 'MM.dd')
                    }]
                    this.listObj[key].payTime = payTime
                    this.listObj[key].total = item.ActualAmount
                } else {
                    this.listObj[key].total = this.numAdd(this.listObj[key].total, item.ActualAmount)
                    this.listObj[key].push({
                        price: item.ActualAmount,
                        id: item.ID,
                        name: payTypes[item.PayType],
                        date: dateParse(payTime, 'MM.dd')
                    })
                }
            })
            let keys = Object.keys(this.listObj)
            let list = []
            keys.sort((a, b) => {
                return b*1 - a*1
            })
            keys.forEach((item) => {
                let dates = dateParse(this.listObj[item].payTime, 'yyyy-M').split('-')
                list.push({
                    year: dates[0],
                    month: dates[1],
                    total: this.listObj[item].total,
                    list: this.listObj[item]
                })
            })
            this.listData =  list
	    },
        loadMore() {
            this.pageIndex += 1
            if (this.pageIndex <= this.pageTotal) {
                this.$refs.scroll.noMoreChange(false)
                this.getList()
            } else {
                this.$refs.scroll.noMoreChange(true)
            }
        },
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

.history-pay{
	width: 100%;
	height: 100%;

	.title{
		padding: 0 .3rem;
		height: .68rem;
		line-height: .7rem;
		overflow: hidden;
		background: #efefef;

		.date{
			float: left;
			color: #333;
		}
		.expend{
			float: right;
			color: $light-font-color;
		}
		.number{
			color: $main-color;
		}
	}
	.list{
		background: #fff;
		padding: 0 .3rem;
	}
	.list-item{
		display: flex;
		@include setLine(top, #eee);
		padding: .3rem 0;

		&:first-child:before{
			display: none;
		}
		.info{
			line-height: 1.35;
			flex: 1;
		}
		.text{
			margin-top: -2px;
		}
		.date{
			font-size: $small-font;
			color: $light-font-color;
		}
		.money{
			flex: 1;
			text-align: right;
			color: #333;
			display: block;
			line-height: .64rem;
		}
	}
	.pay-empty{
		width: 100%;
		text-align: center;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);

		i{
			width: 1.16rem;
			height: 1.42rem;
			display: inline-block;
			@include bgImg('pay-empty.png');
		}
		p{
			color: $light-font-color;
			padding-top: .7rem;
		}
	}
}
</style>
