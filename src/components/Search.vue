<template>
	<div class="search">
		<search
			placeholder="输入区域、地铁、小区名"
			@result-click="resultClick"
			@on-change="getResult"
			:results="results"
			v-model="value"
			auto-scroll-to-top
			@on-submit="onSubmit"
			@on-focus="onFocus"
			@on-blur="onBlur"
			ref="search"
		>
			<!--<div class="select" slot="left">
				<div class="title" @click="showChoose">
					<span class="text">{{ chooseText }}</span>
					<i :class="isShowChoose ? 'on' : ''"></i>
				</div>
				<div class="choose" v-show="isShowChoose">
					<em></em>
					<span class="choose-item" @click.stop="choose(1)">合租</span>
					<span class="line"></span>
					<span class="choose-item" @click.stop="choose(2)">整租</span>
				</div>
			</div>-->
			<button class="btn" slot="right" @click="cancel">{{ btnText }}</button>
			<div class="search-hot" v-show="hotShow">
				<template v-if="hotArea.length > 0">
					<div class="hot-title"><i></i>热门板块</div>
					<div class="hot-con">
					<span class="hot-word" v-for="item in hotArea"
					      @click="hotSearch('area', item.AreaID, item.ID, item.Name)">
						{{ item.Name }}
					</span>
					</div>
				</template>
				<template v-if="hotVillage.length > 0">
					<div class="hot-title mr-top10"><i></i>热门小区</div>
					<div class="hot-con">
					<span class="hot-word" v-for="item in hotVillage"
					      @click="hotSearch('village', '', item.ID, item.ComName)">
						{{ item.ComName }}
					</span>
					</div>
				</template>
			</div>
		</search>
	</div>
</template>

<script>
import { Group } from 'vux'
import Search from './VuxSearch'
import { hotArea, hotVillage, hotTip } from '../common/api'


export default {
    components: {
        Group,
        Search
    },
    data() {
        return {
            results: [],
            value: '',
            hotShow: true, //显示热搜内容
            chooseType: -1, //1为合租2整租
            isShowChoose: false, //显示下拉框
            hotArea: [],
            hotVillage: [],
            btnText: '搜索'
        }
    },
    computed: {
        chooseText() {
			return this.chooseType === 1 ? '合租' : '整租'
        }
	},
	created() {
        hotArea().then(res => {
            if (res.ReturnCode == 0 && res.Data) {
                this.hotArea = res.Data
            }
        })
        hotVillage().then(res => {
            if (res.ReturnCode == 0 && res.Data) {
                this.hotVillage = res.Data
            }
        })
	},
    methods: {
        //合租整租
        showChoose() {
			this.isShowChoose = !this.isShowChoose
        },
        choose(type) {
			this.chooseType = type
            this.isShowChoose = false
        },

        //输入框
        setFocus() {
            this.$refs.search.setFocus()
        },
        resultClick(item) {
            this.value = item.text
            this.$emit('key-word', {
                value: item.text,
                type: this.chooseType
            })
        },
        getResult(val) {
	        if (!String.trim(val)) {
                this.results = []
                this.hotShow = true
                return
	        }
            hotTip({
                searchkey: val
            }).then(res => {
                if (res.ReturnCode == '0' && res.Data != '') {
                    let data = []
                    res.Data.forEach((item, index) => {
                        data[index] = {
                            title: item.Name.replace(val, '<span class="search-point">'+ val +'</span>'),
                            text: item.Name,
                            num: item.Count
                        }
                    })
                    this.results = data
                } else {
                    this.results = []
                }
                this.hotShow = this.results.length <= 0
            }).catch(res => {
                this.results = []
                this.hotShow = true
            })
        },
        onSubmit() {
            this.$refs.search.setBlur()
            this.$emit('key-word', {
                value: this.value,
                type: this.chooseType
            })
        },
        onFocus() {
			this.btnText = '取消'
        },
        onBlur() {
            this.btnText = '搜索'
        },
        cancel() {
            this.$refs.search.setBlur()
	        this.value = ''
            this.results = []
        },
        hotSearch(type, pId, id, text) {
            this.value = text
            this.$refs.search.setBlur()
	        let data = {
                type: -1
            }
            if (pId) { //热门板块
				data.hotAreaId = pId + '-' + id
            } else { //热门小区
                data.hotVillageId = id
            }
            this.$emit('key-word', data)
        },
    }
}
</script>

<style lang="scss">
@import "../assets/css/common/search";

</style>
