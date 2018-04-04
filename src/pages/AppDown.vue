<template>
	<div class="app-down">
		<div class="logo">
			<img src="static/img/down-logo.png" alt="让租房变得简单快乐! ">
		</div>
		<div class="version"><i></i></div>
		<div class="btn-box">
			<p>
				<a :href="ios" target="_blank">
					<i class="ios"></i>
					IOS版下载
				</a>
			</p>
			<p>
				<a :href="android" target="_blank">
					<i class="android"></i>
					Android版下载
				</a>
			</p>
		</div>
		<img src="static/img/down-tip.png" alt="请在浏览器中打开" class="tip" v-show="isWx">
	</div>
</template>

<script>
import { mobile } from '../common/util'
import { getDownLink } from '../common/api'

export default {
    data () {
        return {
	        isWx: false,
            ios: 'itms-services://?action=download-manifest&url=https://raw.githubusercontent.com/rookieJX/Yudoodoo/master/doodooDis133/manifest.plist',
            android: 'http://www.yudoodoo.com/download/yuduoduo1.3.3-12-13-11-29.apk',
        }
    },
	created() {
        this.setTitle('APP下载')
		this.mobileType = mobile.ios ? 'iphone' : 'android'
        var ua = navigator.userAgent.toLowerCase()
		if (ua.indexOf('micromessenger') != -1) {
			this.isWx = true
		}
		getDownLink().then(res => {
            this.hideLoading()
            if(res.ReturnCode == '0' && res.Data != '') {
//            	res.Data[0].ios = '#'
//            	res.Data[0].android = '#'
                this.ios = res.Data.IOSAddress
                this.android = res.Data.AndroidAddress
            }
        })
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";
.app-down{
	background: $main-color;

	.logo{
		width: 100%;
		text-align: center;
		position: absolute;
		top: 2.5rem;
		left: 0;

		img{
			width: 4.6rem;
			height: 2.72rem;
		}
	}
	.version{
		width: 100%;
		position: absolute;
		left: 0;
		top: 5.42rem;
		text-align: center;

		i{
			width: 1.06rem;
			height: .36rem;
			display: inline-block;
			@include bgImg('down-version.png');

		}
	}
	.btn-box{
		width: 100%;
		position: absolute;
		bottom: 1.4rem;
		left: 0;

		a{
			display: block;
			width: 70%;
			text-align: center;
			margin: .4rem auto 0;
			height: .88rem;
			line-height: .88rem;
			font-size: .32rem;
			color: $main-color;
			background: #fff;
			border-radius: 5px;
		}
		i{
			width: .38rem;
			height: .44rem;
			display: inline-block;
			vertical-align: -4px;
			margin-right: .2rem;

			&.ios{
				@include bgImg('down-ios.png');
			}
			&.android{
				@include bgImg('down-android.png');
			}
		}
	}
	.tip{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
	}
}
</style>
