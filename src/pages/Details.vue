<template>
    <div class="details-body" v-show="bodyShow" :class="{'android': isAndroid}">
        <div v-if="showPhoto" class="photo" @click="show(imgIndex - 1)">
            <swiper :list="imgs" auto :aspect-ratio="500/800" :show-dots="false" :index="imgIndex" @on-index-change="imgChang"></swiper>
            <span class="pic-count">
                <span class="now-index">{{imgIndex}}</span>
                <span class="all-index">{{'/' + imgs.length}}</span>
            </span>
            <div v-transfer-dom>
                <previewer :list="imglist" ref="previewer" :options="options"></previewer>
            </div>
        </div>
        <div class="info">
            <flexbox :gutter="0" class="info-block info-else-block">
                <span class="info-name-location">
                    <p class="info-name">{{info.Title}}</p>
                    <p class="info-location">
                        <i class="location-icon"></i>
                        <span class="location-text">
                            <span v-if="info.Name">[{{info.Name}}]</span>{{info.SubwaysName}} {{info.SubwayzName}}
                        </span>
                    </p>
                </span>
                <flexbox-item class="info-price">
                    <span class="info-rental">{{info.Rental}}</span>
                    <span class="yuan">元</span>
                </flexbox-item>
            </flexbox>
            <flexbox :gutter="15" :align="'flex-start'" class="info-block info-else-block">
                <flexbox-item class="info-left">
                    <p>面积：
                        <span>{{info.Area}}m
                            <sup>2</sup>
                        </span>
                    </p>
                    <p>朝向：
                        <span>{{info.Orientation}}</span>
                    </p>
                    <p>户型：
                        <span>{{info.Room}}室<span class="house-type" v-if="info.Hall">{{info.Hall}}厅</span><span class="house-type" v-if="info.Toilet">{{info.Toilet}}卫</span>
                        </span>
                    </p>
                    <p>楼层：
                        <span>{{info.SeveralLayers}}/{{info.TotalHeight}}层</span>
                    </p>
                </flexbox-item>
                <flexbox-item class="info-right">
                    <p>房间编号：
                        <span>{{info.HouseNo}}</span>
                    </p>
                    <p>小区名称：
                        <span>{{info.ComName}}</span>
                    </p>
                    <p>所在区域：
                        <span>{{info.District}} {{info.Name}}</span>
                    </p>
                    <p>小区地址：
                        <span>{{info.District}}{{info.Street}}{{info.StreetNumber}}弄{{info.UnitNo}}号</span>
                    </p>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="info-block else-block">
            <div class="info-feature" v-if="showFeature">
                <p class="title">房屋特色</p>
                <ul class="feature-ul">
                    <li class="feature-list" v-for="i in feature" :key="i">{{i}}</li>
                </ul>
            </div>
            <p class="title else-title">关于此房源</p>
            <QQmap ref="mapDom" :Lat="info.P_Lat" :Lng="info.P_Lng"></QQmap>
            <p v-if="info.Note" class="info-note-showall" ref="infoNote">
                <span>周边：</span>{{info.Note}}
            </p>
            <div v-show="overline" class="arrow-box" @click="arrowClick">
                <span class="arrow"></span>
            </div>
        </div>
        <div class="info-block" v-if="showConfig">
            <div v-if="showRoomConfig">
                <p class="title">房间配置</p>
                <ul class="config-list">
                    <li class="config-icon" v-for="(item,index) in roomConfig" :key="index">
                        <span class="icon" :class="configData[item[0]]"></span>
                        <p class="icon-text">{{item[1]}}</p>
                    </li>
                </ul>
            </div>
            <div v-if="showPublicConfig">
                <p class="title config-bottom">公共配置</p>
                <ul class="config-list">
                    <li class="config-icon" v-for="(item,index) in publicConfig" :key="index">
                        <span class="icon" :class="configData[item[0]]"></span>
                        <p class="icon-text">{{item[1]}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="info-block" v-if="showLst">
            <p class="title">我的室友</p>
            <x-table :cell-bordered="false" style="background-color:#fff;">
                <thead>
                    <tr>
                        <th>房间</th>
                        <th>状态</th>
                        <th>室友</th>
                        <th>阳台</th>
                        <th>独卫</th>
                        <th>租金</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in roomLst" :key="index" @click="toRecommend(item.HouseID,item.ID,item.Rental,item.Status)">
                        <td>{{item.RoomName}}</td>
                        <td :class="{bright:item.ID == nowHouseID}">{{status(item.Status,item.ID)}}</td>
                        <td>
                            <i class="roomie-icon" :class="setGender(item.Status,item.Gender)"></i>
                        </td>
                        <td>
                            <i class="roomie-icon" :class="setTick(item.HasBalcony)"></i>
                        </td>
                        <td>
                            <i class="roomie-icon" :class="setTick(item.HasToilet)"></i>
                        </td>
                        <td :class="{bright:item.ID == nowHouseID}">{{item.Rental+'/月'}}</td>
                    </tr>
                </tbody>
            </x-table>
        </div>
        <div class="info-block else-block recommend" v-if="showRecommend">
            <p class="title else-title">精品推荐</p>
            <ul class="recommend-box">
                <li class="recommend-list" v-for="(item,index) in recommendList" :key="index">
                    <a href="javascript:void(0);" @click="toRecommend(item.ParentID,item.HID,item.Rental,1)">
                        <div class="recommendImg">
                            <img class='lazyload' v-lazy="item.ImageUrl" />
                        </div>
                        <flexbox :gutter="0" class="recommend-block">
                            <span class="recommend-name-location">
                                <p class="recommend-name">{{item.Title}}</p>
                                <p class="recommend-location">
                                    <span class="recommend-location-text">{{item.Room}}室<span v-if="item.Hall">{{item.Hall}}厅</span> | {{item.Area}}m
                                        <sup>2</sup>
                                    </span>
                                </p>
                            </span>
                            <flexbox-item class="recommend-price">
                                <span class="recommend-rental">{{item.Rental}}</span>
                                <span class="recommend-yuan">元</span>
                            </flexbox-item>
                        </flexbox>
                    </a>
                </li>
            </ul>
        </div>
        <div class="appoint">
            <a href="tel:400-025-6788" class="bottom-btn call-number">
                <i class="appoint-icon icon-phone"></i>电话预约</a>
            <span class="h-line"></span>
            <router-link :to="'/appoint?hcode=' + Hid + '&pid=' + Houseid" class="bottom-btn appoint-btn"><i class="appoint-icon icon-appoint"></i>在线预约</router-link>
            <router-link :to="'/renterInfor/fillIn?hcode=' + Hid + '&pid=' + Houseid" class="bottom-btn booking-btn">立即预约</router-link>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Swiper, Previewer, TransferDom, Flexbox, FlexboxItem, XTable } from 'vux'
import { housingDetail, recommendList } from '../common/api'
import { getUrlParams, setUrlParams, mobile } from '../common/util'
import { defaultImg, domain } from '../common/config'
import QQmap from '../components/map'
import BeiAn from '../components/BeiAn'
import lrz from "lrz"
import { wxShare } from '../common/wx-share'

var imgUrlRegExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\[w- .\/?%&=#]*)?/

export default {
    data() {
        return {
            msg: 'details',
            isAndroid: mobile.android ? true : false,
            bodyShow: false,
            url: window.location.href,
            Hid: null,
            Houseid: null,
            //swiper图片
            imgs: [],
            //previewer图片
            imglist: [],
            imgIndex: 1,
            nowHouseID: -1,
            options: {
                getThumbBoundsFn(index) {
                    // find thumbnail element
                    let thumbnail = document.querySelectorAll('.vux-img')[index]
                    // get window scroll Y
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    // optionally get horizontal scroll
                    // get position of element relative to viewport
                    let rect = thumbnail.getBoundingClientRect()
                    // w = width
                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                    // Good guide on how to get element coordinates:
                    // http://javascript.info/tutorial/coordinates
                }
            },
            //房源信息
            info: {},
            //房屋特色
            feature: [],
            //房屋/公共配置图标对照
            configData: {},
            roomConfig: [],
            publicConfig: [],
            roomLst: [],
            //推荐列表
            recommendList: [],
            showFeature: false,
            showConfig: false,
            showRoomConfig: false,
            showPublicConfig: false,
            showLst: false,
            showRecommend: false,
            showPhoto: false,
            overline: false //超出行显示箭头
        }
    },
    beforCreate() {
        // this.setShear()
    },
    created() {
        this.setTitle('房源详情')
    },
    components: {
        Swiper,
        Previewer,
        Flexbox,
        FlexboxItem,
        XTable,
        QQmap,
        BeiAn
    },
    mounted() {
        this.init()
    },
    methods: {
        imgChang(index) {
            this.imgIndex = (index + 1)
        },
        show(index) {
            this.$refs.previewer.show(index)
        },
        init(code, pid, rental) {
            this.Hid = code || getUrlParams('hcode', this.url)
            this.Houseid = pid || getUrlParams('pid', this.url)
            this.Rental = rental || getUrlParams('rental', this.url)
	        if (code) {
                this.showLoading()
		        this.bodyShow = false
                document.documentElement.scrollTop = document.body.scrollTop = 0;
	        }
            //获取房源详情
            this.getHouseDetail()
            //获取推荐房源
            this.getRecommend()
        },
        //获取房屋信息
        getHouseDetail() {
            let _this = this
            let data = {
                Hid: _this.Hid,
                Houseid: _this.Houseid
            }
            let respond = housingDetail(data)
            respond.then(function (res) {
                _this.hideLoading()
	            _this.bodyShow = true
                if (res.ReturnCode == 0) {
                    let data = res.Data
                    let ImgLst = data.ImgLst
                    //房源信息
                    _this.info = data.RoomDetail
                    // 设置title分享时显示
                    _this.setTitle(_this.info.Title)
                    _this.$refs.mapDom.initMap()
                    //设置当前房屋ID
                    _this.nowHouseID = data.RoomDetail.HID
                    //房源图片解析
                    var imgs = [{
                            url: 'javascript:',
                            img: defaultImg
	                    }],
	                    imglist = [],
	                    defaultList = []
                    if (ImgLst.length > 0) {
                        for (let i = 0; i < ImgLst.length; i++) {
                            let img = imgUrlRegExp.test(ImgLst[i].ImgAddress)?ImgLst[i].ImgAddress:defaultImg
                            imgs[i] = {
                                url: 'javascript:',
                                img: img
                            }
                            defaultList[i] = {
                                url: 'javascript:',
	                            img: defaultImg
                            }
                            imglist[i] = {
                                src: img
                            }
                        }
                        _this.showPhoto = true;
                    }
                    _this.imgs = defaultList
                    _this.imglist = imglist
                    var loadImg = new Image()
	                loadImg.onload = function () {
                        _this.imgs = imgs
		                _this.imglist = imglist
                        loadImg = loadImg.onload = loadImg.onerror = null
                    }
                    loadImg.onerror = function () {
                        _this.imgs = imgs
                        _this.imglist = imglist
                        loadImg = loadImg.onload = loadImg.onerror = null
                    }
                    loadImg.src = imgs[0].img

                    //房屋特色
                    let feature = data.RoomDetail.Feature || ''
                    feature = feature.split(/[,，]/)
	                let newFeature = []
                    feature.forEach((item, index) => {
                        if (!!item && !/^\s+$/.test(item)) {
                            newFeature.push(item)
                        }
                    })
                    _this.feature = newFeature
                    if(_this.feature != ''){
                        _this.showFeature = true
                    }
                    //房屋配置
                    _this.initHouseConfig()
                    _this.roomConfig = _this.getConfigList(data.RoomDetail.RoomConfig)
                    _this.publicConfig = _this.getConfigList(data.RoomDetail.PublicConfig)
                    if(_this.publicConfig.length > 0 || _this.roomConfig.length > 0){
                        _this.showConfig = true
                        if(_this.roomConfig.length > 0){
                            _this.showRoomConfig = true
                        }
                        if(_this.publicConfig.length > 0){
                            _this.showPublicConfig = true
                        }
                    }
                    //室友
                    _this.roomLst = data.RoomLst != null ? data.RoomLst : []
                    if(_this.roomLst.length > 1){
                        _this.showLst = true
                    }
                    // 微信分享
                    wxShare({
                        title: _this.info.Title,
                        desc: '[' + _this.info.Name + ']' +  _this.info.SubwaysName +  _this.info.SubwayzName,
                        link: domain + '/wap/' + window.location.hash,
                        imgUrl: ImgLst.length ? ImgLst[0].ImgAddress : domain + '/wap/' + defaultImg
                    })
                    //房源周边箭头设置
                    setTimeout(function(){
                        if (!_this.$refs.infoNote) {
                            return
                        }
                        let style = window.getComputedStyle(_this.$refs.infoNote, null)
                        let lines = Math.round(parseInt(style.height)/parseInt(style.lineHeight))
                        if(lines > 4){
                            _this.overline = true
                            _this.$refs.infoNote.setAttribute('class','info-note')
                        }
                    },50)
                } else if (res.ReturnCode == 110) {
                    Vue.$vux.toast.text('数据为空', 'middle')
                } else {
                    Vue.$vux.toast.text('系统错误', 'middle')
                }
            })
        },
        getRecommend() {
            //推荐
            let _this = this
            let data = {
                Hid: _this.Hid,
                Rental: _this.Rental
            }
            let respond = recommendList(data)
            respond.then(function (res) {
                if (res.ReturnCode == 0) {
                    let data = res.Data
                    _this.recommendList = data
                    if(_this.recommendList.length > 0){
                        _this.showRecommend = true
                    }
                }
            })
        },
        initHouseConfig() {
            //设置房间配置标签
            var icons = 'wifi,xi-yi-ji,hong-gan-ji,kong-tiao,bing-xiang,re-shui-qi,tv,wei-bo-lu,kao-xiang,dian-ti,jian-shen-fang,you-yong-chi,park,chao-shi,chu-fang,dian-ci-lu,chu-gui,you-yan-ji,yi-gui,shu-zhuo,yi-zi,chuang,zhi-neng-suo,mei-qi,zhi-jin,shu-yi,can-zhuo'.split(',')
            var ids = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,29,30'.split(',')
            for (var i = 0, len = icons.length; i < len; i++) {
                this.configData[ids[i]] = icons[i]
            }
        },
        getConfigList(data) {
            if(!data){
                return []
            }
            let first = data.split(','),
                second = []
            for (let i = 0; i < first.length; i++) {
                second[i] = first[i].split('|')
            }
            return second
        },
        status(n, id) {
            //判断当前房源邻室是否可入住 1：可入住 2：已出租
            if (id == this.nowHouseID) {
                return '当前房间'
            } else {
                return n > 1 ? '可入住' : '已出租'
            }
        },
        setGender(status, gender) {
            //判断性别 1：男 2：女
            if (status == 2) {
                return (gender == 1 ? 'man' : 'female')
            } else {
                return ''
            }
        },
        setTick(n) {
            //判断房间是否有阳台或者独立卫生 1：有
            if (n == 1) {
                return 'tick'
            } else {
                return ''
            }
        },
        toRecommend(houseid, hid, rental, status) {
            if(hid != this.nowHouseID && status == 1){
                this.url = setUrlParams('pid', houseid, this.url)
                this.url = setUrlParams('hcode', hid, this.url)
                this.url = setUrlParams('rental', rental, this.url)

	            this.init(hid, houseid, rental)
                /*window.location.href = this.url
                window.location.reload()
                document.body.scrollTop = 0;*/
            }
        },
        arrowClick() {
            if(this.overline){
                this.overline = false
                this.$refs.infoNote.setAttribute('class','info-note-showall')
            }
        }
    },
    directives: {
        TransferDom
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/pages/details";
</style>
