<template>
	<header>
		<slot name="left">
			<span class="back" @click="goBack()" :class="{'hidden': hideBack}"><i></i></span>
		</slot>
		<h1>{{ title }}</h1>
		<slot name="right">
			<span class="menu" @click="menuHandler">{{ menuText }}</span>
		</slot>
	</header>
</template>

<script>

export default {
    props: {
        hideBack: {
            type: Boolean,
	        default: false
        },
		title: {
		    type: String,
			default: ''
		},
        menuText: {
		    type: String,
	        default: ''
        }
    },
    methods: {
        menuHandler() {
            this.$emit('on-menu')
	    }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

header{
	display: flex;
	height: 1.1rem;
	line-height: 1.1rem;
	background: #fff;

	.back{
		width: 1rem;
		text-align: center;
		margin-right: .7rem;

		i{
			@include setArrow(left, 12px, #666, 1px);
			vertical-align: -3px;
			display: inline-block;
		}
	}
	.hidden{
		visibility: hidden;
	}
	h1{
		font-size: .36rem;
		text-align: center;
		font-weight: 500;
		color: #333;
		width: 0;
		flex: 1;
		@include ellipsis(1);
	}
	.menu{
		width: 1.7rem;
		text-align: center;
		display: inline-block;
	}
}
</style>
