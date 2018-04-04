<template>
    <div class="repair-body">
        <v-header :title="'报修服务'" :menuText="'立即报修'" @on-menu="toRepair()"></v-header>
        <div class="repair-list" v-show="listShow">
            <scroller ref="scroll" :data="repair" @pullup="loadMore">
                <repair-item :repair="repair" @goDetail="goDetail"></repair-item>
            </scroller>
        </div>
        <div v-show="!listShow" class="none-repair-record">
            <div class="icon-container">
                <i></i>
                <p>哎呀~ 还没有报修记录</p>
            </div>
        </div>
    </div>
</template>

<script>
import { getUrlParams } from '../common/util'
import vHeader from '../components/Header'
import { repairList } from '../common/api'
import Scroller from '../components/Scroller'
import RepairItem from '../components/RepairItem'
import BeiAn from '../components/BeiAn'

export default {
    components: {
        vHeader,
        Scroller,
        RepairItem,
        BeiAn
    },
    data() {
        return {
            repair: [],
            listShow: false,
            conId: getUrlParams('conId'),    //合同ID
            RoomId: getUrlParams('roomId'),   //房间ID
            HouseId: getUrlParams('houseId'),  //房源ID
            uid: this.isLogin(),
            pageIndex: 1, //当前页数
            pageSize: 15, //每页数
            pageTotal: 1  //总页数
        }
    },
    created() {
        this.setTitle('报修服务')
        this.initPage()
    },
    mounted() {
        
    },
    methods: {
        initPage() {
            let _this = this
            //判断用户是否登录， 如未登录，跳转到登录页面
            if(!_this.uid){
                this.goLogin()
                return
            }
            this.getList()
        },
        getList() {
            let _this = this
            if (!_this.conId||!_this.HouseId||!_this.RoomId) {
                _this.hideLoading()
                _this.listShow = false
                //_this.$vux.toast.text('获取合同ID失败', 'middle')
                return
            } else {
                _this.listShow = true
            }
            repairList({
                renterId: _this.uid,
                pageIndex: _this.pageIndex,
                pageSize: _this.pageSize
            }).then(res => {
                _this.hideLoading()
                if (res.ReturnCode == '0') {
                    _this.listShow = true
                    let list = res.Data.List
                    _this.pageTotal = res.Data.PageCount
                    if (_this.pageIndex > _this.pageTotal) {
                        _this.$refs.scroll.noMoreChange(true)
                    } else {
                        _this.$refs.scroll.noMoreChange(false)
                    }
					if (_this.pageIndex > 1) {
                        _this.repair = _this.repair.concat(list)
					} else {
                        _this.$refs.scroll.scrollTo(0, 100)
						_this.repair = list
                    }
                } else if (res.ReturnCode == '110') {
                    _this.listShow = false
                } else {
                    _this.$vux.toast.text('系统错误', 'middle')
                    _this.listShow = false
                }
            })
        },
        toRepair() {
            this.$router.replace(`repairSubmit?houseId=` + this.HouseId + '&roomId=' + this.RoomId + '&conId=' + this.conId)
        },
        loadMore() {
            let _this = this
            _this.pageIndex++
            if (_this.pageIndex <= _this.pageTotal) {
                _this.$refs.scroll.noMoreChange(false)
				_this.getList()
			} else {
                _this.$refs.scroll.noMoreChange(true)
			}
        },
        goDetail(id) {
            this.$router.push(`repairDetail?repId=` + id + '&conId=' + this.conId + '&roomId=' + this.RoomId + '&houseId=' + this.HouseId)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/pages/repair";
</style>
