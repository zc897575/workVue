<template>
    <div v-show="bodyShow">
        <pay-header :rentName="rentName" :rentType="rentType" :price="price"></pay-header>
        <router-view></router-view>
    </div>
</template>
<script>
    import Vue from 'vue'
    import PayHeader from '../components/PayHeader'
    import { housingDetail } from '../common/api'
    // import {  } from '../common/util'

    export default {
    	components: {
    	    PayHeader,
        },
		data () {
    		return {
    			bodyShow: true,
                rentName: '',
                rentType: '',
                price: 0,
                houseInfor: {
                    Hid: this.$route.query.hcode,
                    Houseid: this.$route.query.pid,
                }
            }
		},
		created () {
            this.setTitle('租客信息')
            this.init()
		},
		methods: {
    		init() {
    			const _this = this
    			let hasHouse = false
                for (let key in _this.houseInfor) {
    				if ( !!_this.houseInfor[key] ) {
                        hasHouse = true
                    } else {
                        return
                    }
                }
    			if (hasHouse) {
                    _this.showLoading()
                    _this.getHouseDetail()
                }
            },
            getHouseDetail() {
            	let _this = this
                housingDetail(_this.houseInfor).then(function(res) {
                    _this.hideLoading()
                    _this.bodyShow = true
                    if (res.ReturnCode == 0) {
                        let data = res.Data.RoomDetail
                        _this.rentType = data.RentType == 1 ? '合租' : '整租'
                        _this.rentName = data.District + data.ComName + data.RoomName
                    }else if (res.ReturnCode == 110) {
                        Vue.$vux.toast.text('数据为空', 'middle')
                    } else {
                        Vue.$vux.toast.text('系统错误', 'middle')
                    }
                })
            }
		}
	}
</script>
<style lang="scss" scope>
    @import '../assets/css/pages/renterInfor';
</style>
