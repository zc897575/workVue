<template>
<ul class="repair-list-container scroll-wrap">
    <li class="repair-item" v-for="(item, index) in repair" @click="goRepairDetail(item.Id)" :key="index">
        <div class="repair-heading">
            <span class="repair-code main-font">报修单号：<span class="code-color">{{item.RepairCode}}</span></span>
            <span class="repair-pro orange" :class="{orange: item.Status<=4,gray: item.Status>=5}">{{item.StatusName}}</span>
        </div>
        <div class="repair-detail-container">
            <div class="repair-list-content  ellipsis-style-01">
                <span class="code-color">报修物品：</span>
                <span class="main-font">{{item.RepairArticles}}</span>
            </div>
            <div class="repair-list-content  ellipsis-style-02">
                <span class="code-color">问题描述：</span>
                <span class="main-font">{{item.Description}}</span>
            </div>
            <div class="repair-list-content add-margin">
                <span class="code-color">报修时间：</span>
                <span class="main-font">{{repairTime(item.RepairTime)}}</span>
            </div>
        </div>
    </li>
</ul>
</template>

<script>
export default {
    props: {
		repair: {
		    type: Array,
			default: function(){
                return []
            }
        }
    },
    methods: {
        repairTime(time) {
            let Time = this.TimeFormat(time, "MM.dd hh:mm")
            return Time
        },
        goRepairDetail(id) {
            this.$emit('goDetail',id)
        },
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/css/pages/repair";
</style>