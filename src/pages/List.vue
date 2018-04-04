<template>
    <div class="list-body" :class="{'android': isAndroid}">
	    <div class="list-header" v-show="!isFilterShow">
		    <img src="static/img/logo2.png"  class="logo">
		    <div class="city-choose">
			    <i></i>
			    <span class="text">上海</span>
		    </div>
	    </div>
	    <search ref="searchDom" @key-word="onSearch" v-show="!isFilterShow"></search>
	    <div class="filter-box" :style="isFilterShow ? 'z-index: 6': ''">
		    <div class="filter-item" v-for="(item, index) in condition"
		         :class="{ selected:(item.id === nowClick) }">
			    <div class="condition" @click="showFilter(item.id)">
				    <span class="text">{{ filterName[item.id] || item.text }}</span>
				    <i class="arrow"></i>
			    </div>
		    </div>
	    </div>
	    <!--位置-->
	    <div class="filter-dialog" v-show="nowClick === 'location'" @click.stop="hideFilter">
			<div class="menu-content" @click.stop>
				<div class="row-item">
					<div class="row-content">
						<span class="list tap-active" v-for="(filter, index) in locationList"
						      :class="{ selected: (location === filter.id) }"
						      @click="menuSelect('location', filter.id)">
							<span class="text">{{ filter.name }}</span>
							<i class="i-arrow"></i>
							<i class="line"></i>
						</span>
					</div>
				</div>
				<div class="row-item">
					<div class="row-content">
						<span class="list" :class="{ on: (location2 === -1) }"
						      @click="houseFilter('location2', -1)">
							<span class="text">不限</span>
						</span>
							<span class="list tap-active" v-for="(filter, index) in location2List"
							      :class="{ selected: (location2 === filter.id) }"
							      @click="menuSelect('location2', filter.id, filter.children || [], filter.name)">
							<span class="text">{{ filter.name }}</span>
							<i class="i-arrow"></i>
							<i class="line"></i>
						</span>
					</div>
				</div>
				<div class="row-item" v-show="showLocation3">
					<div class="row-content">
						<span class="list" :class="{ on: (location3 === -1) }"
						      @click="houseFilter('location3', -1)">
							<span class="text">不限</span>
						</span>
						<template v-show="location3List.length">
							<span class="list" v-for="(filter, index) in location3List"
							      :class="{ on: (location3 === filter.id) }"
							      @click="houseFilter('location3', filter.id, filter.name)">
								<span class="text">{{ filter.name }}</span>
							</span>
						</template>
					</div>
				</div>
			</div>
	    </div>
	    <!--租金-->
	    <div class="filter-dialog" v-show="nowClick === 'rental'" @click.stop="hideFilter">
		    <div class="content" @click.stop>
				<span class="list" :class="{ on: (rental === -1) }"
				      @click="houseFilter('rental', -1)">不限
				</span>
			    <span class="list" v-for="(filter, index) in rentalList"
			          :class="{ on: (rental === filter.id) }"
			          @click="houseFilter('rental', filter.id, filter.name)">{{ filter.name }}
				</span>
		    </div>
	    </div>
	    <!--排序-->
	    <div class="filter-dialog" v-show="nowClick === 'order'" @click.stop="hideFilter">
		    <div class="content" @click.stop>
				<span class="list" :class="{ on: (order === -1) }"
				      @click="houseFilter('order', -1)">默认排序
				</span>
			    <span class="list" v-for="(filter, index) in orderList"
			          :class="{ on: (order === filter.id) }"
			          @click="houseFilter('order', filter.id, filter.name)">{{ filter.name }}
				</span>
		    </div>
	    </div>
	    <!--更多-->
	    <div class="filter-dialog more-dialog" v-show="nowClick === 'more'">
		    <div class="more-content" @click.stop>
			    <template v-for="(value, key) in moreList">
				    <div class="more-title">{{ value.title }}</div>
				    <div class="more-list">
					    <span class="item" v-for="(item, index) in value.data"
					          @click="moreFilter(key, item.id)"
					          :class="{ on:(more[key] === item.id) }"
					    >
						    {{ item.name }}
					    </span>
				    </div>
			    </template>
			    <template>
				    <div class="more-title">其它</div>
				    <div class="more-list">
					<span class="item tap-active" v-for="(item, index) in otherList"
					      @click="otherFilter(item.type, item.id)"
					      :class="{ on:(other[item.type] === item.id) }"
					>
						{{ item.name }}
					</span>
				    </div>
			    </template>
		    </div>
		    <div class="more-btn" @click.stop>
			    <button type="button" class="reset" @click.stop="moreRest">重&nbsp;置</button>
			    <button type="button" class="submit" @click.stop="moreSubmit">确&nbsp;定</button>
		    </div>
	    </div>
		<div class="house-list" ref="houseList">
			<house-item :listData="listData" :minHeight="minHeight"></house-item>
			<div class="list-page" ref="listPage">
				<div class="btn-box">
					<button type="button" :disabled="pageIndex <= 1" @click="pagePrev">上一页</button>
					<button type="button" :disabled="pageIndex >= pageTotal" @click="pageNext">下一页</button>
				</div>
				<p class="number">第 {{ pageIndex }} / {{ pageTotal }} 页</p>
			</div>
			<div class="list-footer" ref="listFooter">
				<p class="service" @click.stop="tel(400025678)">客服热线：400-025-6788</p>
				<p class="copyright">@2016 寓多多 沪ICP备16040161号-1 </p>
				<bei-an></bei-an>
			</div>
		</div>
	    <div class="house-empty" v-show="emptyShow">
		    <div class="box">
			    <i></i>
			    <p>您搜索的房源已经被人预定了！</p>
		    </div>
	    </div>
    </div>
</template>

<script>
import Search from '../components/Search'
import HouseItem from '../components/HouseItem'
import { filter, houseList } from '../common/api'
import { mobile, ss } from '../common/util'
import { shareImg, domain } from '../common/config'
import BeiAn from '../components/BeiAn'
import { wxShare } from '../common/wx-share'


const condition = [
	{
	    text: '位置',
		id: 'location'
	},
    {
        text: '租金',
        id: 'rental'
    },
    {
        text: '排序',
        id: 'order'
    },
    {
        text: '更多',
        id: 'more'
    }
]
const locationList = [
	{
	    id: 'area',
		name: '区域'
	},
    {
        id: 'subway',
        name: '地铁'
    }
]
const orderList = [
	{
	    name: '租金从低到高',
		id: 'Rental-0'
	},
    {
        name: '租金从高到低',
        id: 'Rental-1'
    },
    {
        name: '面积从小到大',
        id: 'Area-0'
    },
    {
        name: '面积从大到小',
        id: 'Area-1'
    }
]
const  moreList = {
	type: {
	    title: '类型'
	},
    rooms: {
	    title: '居室'
	},
    acreage: {
	    title: '面积'
	},
    direction: {
	    title: '朝向',
	    data: [
            {
                id: '东',
                name: '朝东'
            },
            {
                id: '南',
                name: '朝南'
            },
            {
                id: '西',
                name: '朝西'
            },
            {
                id: '北',
                name: '朝北'
            },
            {
                id: '东南',
                name: '东南'
            },
            {
                id: '东北',
                name: '东北'
            },
            {
                id: '西南',
                name: '西南'
            },
            {
                id: '西北',
                name: '西北'
            }
	    ]
	},
    date: {
	    title: '入住时间',
	    data: [
            {
                id: '1',
                name: '立即入住'
            },
            {
                id: '2',
                name: '1周内'
            },
            {
                id: '3',
                name: '1-2周内'
            },
            {
                id: '4',
                name: '2-4周内'
            }
	    ]
    },
    gender: {
	    title: '室友性别',
	    data: [
            {
                id: '1',
                name: '都是美女'
            },
            {
                id: '2',
                name: '都是帅哥'
            },
            {
                id: '3',
                name: '异性空间'
            }
	    ]
    }
}
const more = {}
for (var i in moreList) {
    if (moreList.hasOwnProperty(i)) {
        more[i] = -1
    }
}
const otherList = [
    {
        id: '独卫',
        name: '独卫',
        type: 'Duwei'
    },
    {
        id: '独立阳台',
        name: '独立阳台',
        type: 'Duli'
    },
    {
        id: '地铁十分钟',
        name: '地铁十分钟',
        type: 'Dts'
    },
    {
        id: '2',
        name: '有两间空房',
        type: 'twoRoom'
    }
]
const other = {}
otherList.forEach((item) => {
    other[item.type] = -1
})

export default {
    components: {
        Search,
        HouseItem,
        BeiAn
    },
    data() {
        return {
            isAndroid: mobile.android,
            isVisited: false, //是否访问过该页面
            condition, //过滤条件项
            nowClick: '',//当前展开的标签
            isFilterShow: false, //显示过滤条件

            locationList, //位置
            location2List: [],
            location3List: [],
            areaList: [], //区域
	        subwayList: [], //地铁
            rentalList: [], //租金
            orderList, //排序规则
            moreList, //更多过滤条件
            otherList, //其它过滤条件

            filterName: {}, //选中的过滤条件文字
            filterType: -1, //1为合租2整租
	        searchWord: -1, //搜索关键字
	        hotVillageId: -1, //热门小区
	        hotAreaId: -1, //热门板块
            rental: -1, //租金
            location: 'area', //一级位置 area区域 subway地铁
            location2: -1,  //二级位置
            location2Text: '', //二级位置文字
            location3: -1,  //三级位置
            showLocation3: false, //是否显示三级位置
            order: -1,
            more,
	        other, //其它过滤条件
	        oldMore: '', //保存more旧值

	        //列表
            emptyShow: false, //无数据
            pageIndex: 1,
	        pageTotal: 1, //总页数
            listData: [],
            minHeight: 200, //列表最小高度
        }
    },
    activated() {
        if (this.isVisited) {
            this.setTitle('房源列表')
            this.hideLoading()
        }
        this.isVisited = true
    },
    deactivated() {
        if (this.$route.path !== '/details') {
            this.$destroy()
        }
    },
    mounted() {
        this.setTitle('上海租房，上海租房网，上海租房信息，上海租房价格，上海租房免佣金')
	    //获取过滤条件数据
        filter().then(res => {
            if (res.ReturnCode == '0') {
                let data = res.Data || {}
                this.rentalList = data.rent.List
                this.location2List = this.areaList = data.area
                this.subwayList = data.subway
                this.moreList.type.data = data.type.List
                this.moreList.rooms.data = data.room.List
                this.moreList.acreage.data = data.acreage.List
            }
        })
	    this.getList()
	    this.minHeight = this.$refs.houseList.offsetHeight - this.$refs.listPage.offsetHeight - this.$refs.listFooter.offsetHeight
    },
    beforCreate() {
        // this.setShear()
    },
    created() {
        // 微信分享
        wxShare({
            title: '寓多多',
            desc: '上海租房,白领公寓,0佣金,上海租房就找寓多多',
            link: domain + '/wap/#/list',
            imgUrl: domain + '/wap/' + shareImg
        })
    },
    methods: {
		//获取列表数据
		getList() {
            if (this.pageIndex === 1) {
                this.listData = []
				this.showLoading()
            }
			var data = {
                Searchkey: this.searchWord, //搜索框关键字
                VillageID: this.hotVillageId, //热门小区
                Rentalid: this.rental, //租金
                Type: this.more.type, //租房类型
                Mianjiid: this.more.acreage, //面积
                Hallid: this.more.rooms, //居室
                Orientation: this.more.direction, //朝向
                Checkinroom: this.more.date, //入住时间
                Sex: this.more.gender, //室友
                Duwei: this.other.Duwei, //独卫
                Duli: this.other.Duli, //独立阳台
                Dts: this.other.Dts, //地铁十分钟
                Roomnum: this.other.twoRoom, //有两间空房
			}
			//排序规则
            if (this.order === -1) {
                data.Orderfld = 'createtime'
            } else {
			    let orders = this.order.split('-')
                data.Orderfld = orders[0] ////排序字段(createtime, Area, Rental)默认为createtime
	            data.Ordertype = orders[1]  //排序方式1=降序0=升序
            }
            //位置
			if (this.location === 'subway') { //地铁线
                data.Subwayxid = this.location2 //地铁线
                data.Subwayzid = this.location3 //地铁站
			} else if (this.location === 'area') { //区域
                data.Areaid = this.location2 //区域
                data.Regionid = this.location3 //板块
			}
			//热门搜索
			if (this.hotAreaId !== -1) {
				let areas = this.hotAreaId.split('-')
                data.Areaid = areas[0] //区域
                data.Regionid = areas[1] //板块
			}
			//清除空值
			for (var i in data) {
			    if (data.hasOwnProperty(i) && data[i] === -1) {
			        delete data[i]
			    }
			}
			data.pageindex = this.pageIndex
            this.emptyShow = false
            this.pageTotal = 1
            houseList(data).then(res => {
				this.hideLoading()

                if (res.ReturnCode == '0') {
                    res.Data = res.Data || {}
                    res.Data.List = res.Data.List || []
                    this.pageTotal = res.Data.PageCount
	                this.listData = res.Data.List
                }

				if (res.ReturnCode == 110 && this.pageIndex === 1) {
                    this.listData = []
                    this.emptyShow = true
					return
				}
				if (res.ReturnCode != '0' && res.ReturnCode != 110) {
                    this.$vux.toast.text('请求失败，请重试', 'middle')
					return
				}
            })
		},
	    //下拉加载更多
        loadMore() {
		    this.pageIndex += 1
			if (this.pageIndex <= this.pageTotal) {
                this.$refs.scroll.noMoreChange(false)
				this.getList()
			} else {
                this.$refs.scroll.noMoreChange(true)
			}
        },
        //搜索
        onSearch(obj) {
		    let oldVal = this.searchWord + '/' + this.filterType + '/' + this.hotVillageId + '/' + this.hotAreaId
			this.searchWord = obj.value || -1
	        this.filterType = obj.type
	        this.hotVillageId = obj.hotVillageId || -1
	        this.hotAreaId = obj.hotAreaId || -1
            this.pageIndex = 1
	        let newVal = this.searchWord + '/' + this.filterType + '/' + this.hotVillageId + '/' + this.hotAreaId

	        //重置过滤条件
            this.location = 'area'
	        let index = 0
	        for (let name in this.filterName) {
		        if (this.filterName.hasOwnProperty(name)) {
                    this.filterName[name] = condition[index].text
                    index++
		        }
	        }
            this.rental = this.location2 = this.location3 = this.order = -1
            this.moreRest()
            this.getList()
        },

	    //显示过滤条件弹层
        showFilter(clickName) {
            if (this.nowClick === clickName) { //关闭标签
                this.hideFilter()
            } else { //展开标签
                this.nowClick = clickName
	            this.isFilterShow = true
            }
        },
	    //隐藏过滤条件
        hideFilter() {
            this.nowClick = ''
            this.isFilterShow = false
        },
	    //过滤条件确定
        houseFilter(type, id, text) {
		    let oldId = this[type]
			this[type] = id
            this.filterName[type] = text
	        this.isFilterShow = false

	        this.nowClick = ''
            this.pageIndex = 1

	        //点击位置筛选时清除搜索项
            if (type.indexOf('location') >= 0) {
                this.hotVillageId = this.hotAreaId  = this.searchWord = -1
				this.$refs.searchDom.cancel()
            }

	        //点击第二级不限
	        if (type === 'location2') {
			    this.location3 = -1
                this.filterName['location'] = condition[0].text
                this.location3List = []
		        this.showLocation3 = false
	        }
            //点击第三级
            if (type === 'location3') {
                this.filterName['location'] = text || this.location2Text
            }
            if (oldId === id) {
		        return
            }
            this.getList()
        },
	    //多级菜单展开
        menuSelect(type, id, children, text) {
            this[type] = id
	        this.location3 = -2
	        this.showLocation3 = true
            this.location2Text = text

	        if (type === 'location') { //隐藏第三级
                this.showLocation3 = false
	        }
            if (children) {
                this.location3List = children
	            return
            }
	        this.location2List = this[id+'List']
        },
	    //更多过滤条件选中状态
        moreFilter(type, id) {
		    this.more[type] = id
        },
	    //其它过滤条件
        otherFilter(type, id) {
		    if (this.other[type] !== -1) { //多选功能
                this.other[type] = -1
		    } else {
                this.other[type] = id
		    }
        },
        moreRest() {
		    for (var i in this.more) {
				if (this.more.hasOwnProperty(i)) {
                    this.more[i] = -1
				}
		    }
            for (var i in this.other) {
                if (this.other.hasOwnProperty(i)) {
                    this.other[i] = -1
                }
            }
        },
	    moreSubmit() {
		    this.hideFilter()
            this.pageIndex = 1
		    let newVal = JSON.stringify(this.more) + '/' + JSON.stringify(this.other)
		    if (newVal !== this.oldMore) {
                this.getList()
		    }
            this.oldMore = newVal
	    },
	    tel(telNumber) {
            window.location.href = 'tel:'+ telNumber
	    },
        pagePrev() {
            if (this.pageIndex > 1) {
                this.pageIndex -= 1
                this.listData = []
	            this.$refs.houseList.scrollTop = 0
                this.showLoading()
                this.getList()
            }
        },
	    pageNext() {
            if (this.pageIndex < this.pageTotal) {
                this.pageIndex += 1
                this.listData = []
                this.$refs.houseList.scrollTop = 0
                this.showLoading()
                this.getList()
            }
	    }
    }
}
</script>

<style lang="scss" >
@import "../assets/css/pages/list";

</style>
