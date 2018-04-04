<template>
    <div>
        <div class="renter-main">
            <div class="renter-block">
                <div class="renter-row">
                    <span class="item-name">租客姓名：</span>
                    <input type="text" v-model="renterName" placeholder="请输入租客姓名">
                </div>
                <div class="renter-row">
                    <span class="item-name">联系电话：</span>
                    <input type="text" v-model="renterTel" placeholder="请输入联系电话">
                </div>
                <div class="renter-row">
                    <popup-radio title="性别：" :options="[
                    	{
                    		key: 1,
                    		value: '男'
                    	},
                    	{
                    		key: 2,
                    		value: '女'
                    	}
                    ]" v-model="renterSex">
                        <p slot="popup-header" class="vux-1px-b popup-title">请选择性别</p>
                    </popup-radio>
                </div>
            </div>
            <div class="renter-block">
                <div class="renter-row">
                    <!--身份证，护照，台胞证，港澳通行证-->
                    <popup-radio title="证件类型：" :options="[
                    	{
                    		key: 1,
                    		value: '身份证'
                    	},
                    	{
                    		key: 2,
                    		value: '护照'
                    	},
                    	{
                    		key: 3,
                    		value: '台胞证'
                    	},
                    	{
                    		key: 4,
                    		value: '港澳通行证'
                    	}
                    ]" v-model="IDType">
                        <p slot="popup-header" class="vux-1px-b popup-title">请选择证件类型</p>
                    </popup-radio>
                </div>
                <div class="renter-row">
                    <span class="item-name">证件号码：</span>
                    <input type="text" v-model="renterId" placeholder="请输入证件号码">
                </div>
                <div class="renter-row">
                    <span class="item-name">证件照片：</span>
                    <div class="id-card id-up">
                        <input name="idCardUp" id="idCardUp" type="file" accept="image/*" @change="toShow">
                        <label class="id-card" for="idCardUp">
                            <img src="../assets/img/id-up.png">
                        </label>
                    </div>
                    <div class="id-card id-down">
                        <input name="idCardDown" id="idCardDown" type="file" accept="image/*" @change="toShow">
                        <label class="id-card" for="idCardDown">
                            <img src="../assets/img/id-back.png">
                        </label>
                    </div>
                </div>
            </div>
            <div class="renter-block">
                <div class="renter-row">
                    <span class="item-name">租约起始：</span>
                    <span>2018.1.14</span>
                </div>
                <div class="renter-row">
                    <span class="item-name">租约结束：</span>
                    <span>2018.9.14</span>
                </div>
            </div>
        </div>
        <router-link :to="'confirm'" class="long-btn">下一步</router-link>
    </div>
</template>
<script>
    import { PopupRadio } from 'vux'

    export default {
		data () {
			return {
                renterName: '', // 租客姓名
                renterTel: '', // 租客电话
                renterSex: 1, // 租客性别 1-男 2-女
                IDType: 1, // 证件类型 1-身份证 2-护照 3-台胞证 4-港澳通行证
                renterId: '', // 租客证件号码
            }
		},
        components: {
            PopupRadio
        },
		created () {

		},
		methods: {
            toShow(e) {
                const file = e.target.files || e.dataTransfer.files
            }
		}
	}
</script>
<style lang="scss" scope>
@import "../assets/css/common/renterInfor";
</style>
