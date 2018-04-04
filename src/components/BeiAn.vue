<template>
	<div class="bei-an">
		<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010402003549">
			<img src="static/img/bei-an.png" style="display: inline-block; margin: 0 4px 0 10px;"/>
			沪公网安备 31010402003549号
		</a>
	</div>
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

<style lang="scss">
@import "../assets/css/base";

.bei-an{
	width: 100%;
	text-align: center;
	padding-top: .1rem;
	padding-bottom: .2rem;
	font-size: .2rem;
	color: #ababab;

	a{
		color: #ababab;
	}
}

.details-body .bei-an{
	padding-bottom: 1.6rem;
}
</style>
