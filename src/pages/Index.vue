<template>
	<div class="index-body">
		<h1>{{ msg }}</h1>
		<router-link to="/search">搜索</router-link>
		<router-link to="/login">登录</router-link>
		<router-link to="/contractChoose?origin=onlinePay">在线支付</router-link>
		<router-link to="/contractChoose?origin=historyPay">历史缴费</router-link>
		<router-link to="/list">房源列表</router-link>
		<router-link to="/contractChoose?a=132&bb=456">选择合同</router-link>
		<router-link to="/contractChoose?origin=contract">签订合同</router-link>
		<router-link to="/contractChoose?origin=repair">报修服务</router-link>
		<router-link to="/contractChoose?origin=repairDetail">报修详情</router-link>
		<router-link to="/contractChoose?origin=repairSubmit">立即报修</router-link>
		<router-link to="/signa">在线签名</router-link>
		<router-link to="/aliPay?goto=aHR0cHM6Ly9tYXBpLmFsaXBheS5jb20vZ2F0ZXdheS5kbz9zaWduPUl2alZwMCUyRlhhUm1WbUU4Q3NpbyUyQlRwYmp1VHpBemQ0UHJRTE1VUjhWODJPY0docmp5JTJCV0x0YUREN0tGbjB0bk1YZnBMSUp5S1JqbXhOdWxYTlRNVldrbktCNFM3N1RSaUJWSFZPemVFQ0tmaDRCVVklMkJVeWVzdzZ2WGp0YklxMmNMNkdVSTFBOE9IdTJIQ2psTkpLMUtzM1ZRcU1UWTdjb3dlOERYOFBFVHEwJTNEJl9pbnB1dF9jaGFyc2V0PXV0Zi04JnN1YmplY3Q9dGVzdCZ0b3RhbF9mZWU9MC4wMSZzaWduX3R5cGU9UlNBJnNlcnZpY2U9YWxpcGF5LndhcC5jcmVhdGUuZGlyZWN0LnBheS5ieS51c2VyJm5vdGlmeV91cmw9aHR0cCUzQSUyRiUyRnd3dy50ZXN0YWxpcGF5LmNvbSUyRmFsaXBheS53YXAuY3JlYXRlLmRpcmVjdC5wYXkuYnkudXNlci1KQVZBLVVURi04JTJGbm90aWZ5X3VybC5qc3AmcGFydG5lcj0yMDg4NTAxNjI0NTYwMzM1JnNlbGxlcl9pZD0yMDg4NTAxNjI0NTYwMzM1Jm91dF90cmFkZV9ubz0yMDE2MzMwMTM0NDQzODE0JnBheW1lbnRfdHlwZT0xJnJldHVybl91cmw9aHR0cCUzQSUyRiUyRnd3dy50ZXN0YWxpcGF5LmNvbSUyRmFsaXBheS53YXAuY3JlYXRlLmRpcmVjdC5wYXkuYnkudXNlci1KQVZBLVVURi04JTJGcmV0dXJuX3VybC5qc3A%3D">支付宝</router-link>
		<router-link to="/contractChoose?origin=contractSuccess">签订成功</router-link>
		<router-link to="/contractChoose?origin=contractChick">查看租约</router-link>
		<router-link to="/contractChoose?origin=contractSignature">合同签名</router-link>
		<!--<button type="button" @click="goWeixin">点击</button>-->
	</div>
</template>

<script>
    import { getUrlParams } from '../common/util'
export default {
    name: 'hello',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            // path: getUrlParams('prop')
        }
    },
//    beforeCreate() {
//        if (this.path) {
//            this.path = JSON.parse(this.path).url
//            this.$router.push(this.path)
//        }
//    },
    created() {
        this.setTitle('首页')
    },
    methods: {
        goWeixin() {
            window.location.href = 'weixin://dl/chat'
        }
	}
}
</script>

<style lang="scss" scoped>
.index-body{
	text-align: center;
}
h1{
	font-size: 22px;
	padding-bottom: 20px;
}
a {
	color: blue;
	display: block;
	line-height: 28px;
}
</style>
