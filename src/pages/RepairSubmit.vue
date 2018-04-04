<template>
    <div class="submit-body">
        <label>
            <div class="input-content">
                <input type="text" placeholder="请输入报修物品" class="item-name" maxlength="20" v-model="repairArticles">
            </div>
        </label>
        <textarea id="problemIntro" class="problem-intro" placeholder="请描述您的问题" maxlength="140" v-model="description">
        </textarea>
        <div class="img-container">
            <ul class="img-list">
                <li v-for="(item, index) in showImg" :key="item">
                    <div class="img-box">
                        <img @click.stop="showbig(index)" class="vux-img" :src="item">
                    </div>
                    <i @click.stop="remove(index)"></i>
                </li>
                <li>
                    <label @click="allowUpload" for="fileInput" ref="fileInput" class="add-imgs"></label>
                </li>
            </ul>
        </div>
        <input id="fileInput" class="hide-input" type="file" accept="image/*" @change="fileChange" />
        <div v-transfer-dom>
            <previewer :list="imgList" ref="previewer" :options="options"></previewer>
        </div>
        <button class="long-btn submit-btn" @click="submit()">提 交</button>
    </div>
</template>

<script>
import Vue from 'vue'
import { Previewer, TransferDom } from 'vux'
import { getUrlParams } from '../common/util'
import vHeader from '../components/Header'
import { repairSubmit, sendImg } from '../common/api'
import lrz from "lrz"
import BeiAn from '../components/BeiAn'

export default {
    directives: {
        TransferDom
    },
    components: {
        Previewer,
        BeiAn
    },
    data() {
        return {
            showImg: [],
            imgList: [],//点击查看绑定的列表
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
            maxlength: 5,
            repairArticles: '',
            description: '',
            RoomId: getUrlParams('roomId'),   //房间ID
            HouseId: getUrlParams('houseId'),  //房源ID
            conId: getUrlParams('conId'),  //合同ID
            uId: this.isLogin()
        }
    },
    computed: {},
    created() {
        this.setTitle('立即报修')
        this.initPage()
    },
    methods: {
        //当文件添加时
        fileChange(e) {
            if (!this.HouseId || !this.RoomId || !this.conId) {
                this.$vux.toast.text('您还没有任何租房无法报修', 'middle')
                e.target.files = e.dataTransfer.files = []
                return
            }
            var files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.showLoading()//显示loading
            this.createImage(files, e)
        },
        //压缩文件并加入数组
        createImage(files, e) {
            let _this = this,
                length = files.length,
                loaded = 0
            // if ((length + _this.showImg.length) > _this.maxlength) {
            //     _this.$vux.toast.text('最多上传' + _this.maxlength + '张,请重新选择！', 'middle')
            //     // 清空文件上传控件的值
            //     e.target.value = null
            //     return false
            // }
            for (let i = 0; i < length; i++) {
                lrz(files[i], { width: 350 }).then(function (res) {
                    sendImg({ imgbase: res.base64+'' }).then(function (data) {
                        if (data.ReturnCode == '0') {
                            //上传成功
                            _this.showImg.push(data.Data.FilePath)
                            _this.imgList.push({
                                src: data.Data.FilePath
                            })
                            if (_this.showImg.length >= _this.maxlength) {
                                _this.$refs.fileInput.removeAttribute('class', 'add-imgs')
                            }
                            loaded++
                            if (loaded == length) {
                                _this.hideLoading()
                                loaded == 0
                            }
                        } else if (data.Data.Code == '10001') {
                            _this.$vux.toast.text('上传失败', 'middle')
                            _this.hideLoading()
                        } else if (data.Data.Code == '10002') {
                            _this.$vux.toast.text('缺少上传文件', 'middle')
                            _this.hideLoading()
                        } else if (data.Data.Code == '10003') {
                            _this.$vux.toast.text('文件大小超过限制', 'middle')
                            _this.hideLoading()
                        } else if (data.Data.Code == '10004') {
                            _this.$vux.toast.text('文件格式不正确', 'middle')
                            _this.hideLoading()
                        }
                    }).catch(function (err) {
                        _this.$vux.toast.text('网络异常，请刷新页面重试', 'middle')
                        _this.hideLoading()
                    })
                    return res
                }).catch(function (err) {
                    _this.$vux.toast.text('第' + (i + 1) + '图片格式错误', 'middle')
                    _this.showImg.splice(i, 1)
                    _this.imgList.splice(i, 1)
                    _this.$refs.fileInput.setAttribute('class', 'add-imgs')
                    loaded++
                    if (loaded == length) {
                        _this.hideLoading()
                        loaded == 0
                    }
                }).always(function () {
                    // 清空文件上传控件的值
                    e.target.value = null
                });
            }
        },
        showbig(index) {
            this.$refs.previewer.show(index)
        },
        remove(index) {
            this.showImg.splice(index, 1)
            this.imgList.splice(index, 1)
            this.$refs.fileInput.setAttribute('class', 'add-imgs')
        },
        allowUpload() {
            if (this.showImg.length >= this.maxlength) {
                return false
            }
        },
        //判断用户是否登录， 如未登录，跳转到登录页面
        initPage() {
            if (!this.uId) {
                this.goLogin()
                return
            }
            if (!this.HouseId || !this.RoomId || !this.conId) {
                this.$vux.toast.text('您还没有任何租房无法报修', 'middle')
                return
            }
        },
        submit() {
            let _this = this
            if (!_this.HouseId || !_this.RoomId || !_this.conId) {
                _this.$vux.toast.text('您还没有任何租房无法报修', 'middle')
                return
            }
            if (_this.trim(_this.repairArticles) == '') {
                _this.$vux.toast.text('请输入报修物品', 'middle')
            } else if (_this.trim(_this.description) == '') {
                _this.$vux.toast.text('请输入报修描述', 'middle')
            } else {
                let imgs = []
                for (let i = 0; i < _this.showImg.length; i++) {
                    imgs[i] = {
                        ImgAddress: _this.showImg[i],
                        Sort: i
                    }
                }
                let data = {
                    repairArticles: _this.repairArticles,
                    description: _this.description,
                    renterId: _this.uId,
                    repairUserId: 0,
                    houseId: _this.HouseId,
                    roomId: _this.RoomId,
                    img: JSON.stringify(imgs)
                }
                repairSubmit(data).then(function (res) {
                    if (res.ReturnCode == '0') {
                        _this.$vux.toast.text('报修成功', 'middle')
                        _this.$router.replace('repair?conId=' + _this.conId + '&houseId=' + _this.HouseId + '&roomId=' + _this.RoomId)
                    } else {
                        _this.$vux.toast.text('系统错误', 'middle')
                    }
                })
            }
        },
        //去头尾空格
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "")
        }
    }

}
</script>

<style lang="scss" scoped>
@import "../assets/css/pages/repairSubmit"
</style>
