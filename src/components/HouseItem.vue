<template>
	<ul class="house-list-content scroll-wrap" :style="{'min-height': minHeight + 'px'}">
		<li class="house-item tap-active" v-for="(item, index) in listData" :key="index"
		    @click="goDetail(item)">
			<div class="box">
				<img class="lazyload pic"  v-lazy="item.ImageUrl">
				<div class="content">
					<h4>{{ item.Title }}</h4>
					<div class="info">
						{{ item.Room }}室<span v-if="item.Hall">{{ item.Hall }}厅</span>
						| {{ item.Area }}m<sup>2</sup>
					</div>
					<div class="locations">
						<i></i>
						<span class="lines">{{ item.SubwaysName }} {{ item.SubwayzName }}</span>
						<span class="map">{{ item.District }} {{ item.Name }}</span>
					</div>
					<div class="price">
						<span class="number">{{ item.Rental }}</span>
						元
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
    props: {
		listData: {
		    type: Array,
			default: []
		},
        minHeight: {
            type: Number,
            default: 200
        }
    },
	data() {
		return {

		}
	},
    methods: {
        goDetail(obj) {
            this.$router.push(`details?hcode=${ obj.HID }&pid=${ obj.ParentID }&rental=${ obj.Rental }`)
	    },
        tstart(e) {
	        let item = e.target
	        while (item.className.indexOf('house-item') === -1) {
                item = item.parentNode
	        }
            item.className = 'house-item hover'
        },
        tend(e) {
            let item = e.target
            while (item.className.indexOf('house-item') === -1) {
                item = item.parentNode
            }
            item.className = 'house-item'
        }
    }
}
</script>

<style lang="scss">
@import "../assets/css/base";

.house-item{
	padding: 0 .3rem .3rem;
	height: 2.6rem;
	background: #fff;

	&.hover{
		background: #f1f1f1;
	}
	.box{
		padding-top: .3rem;
		display: flex;

		@include setLine(top, #ddd);
	}
	&:first-child .box:before{
		display: none;
	}
	.pic{
		width: 2.64rem;
		height: 2rem;
	}
	.content{
		width: 0;
		flex: 1;
		margin-left: .3rem;
	}
	h4{
		font-size: .3rem;
		font-weight: 500;
		color: #333;
		@include ellipsis(1);
		margin-top: -1px;
	}
	.info{
		color: #333;
		margin: .16rem 0;
		font-size: $small-font;
	}
	.locations{
		font-size: $small-font;
		@include ellipsis(1);

		i{
			width: 7px;
			height: 10px;
			display: inline-block;
			vertical-align: 0;
			margin: 0 3px 0 0;
			@include bgImg('marker.png');
		}
	}
	.lines{
		margin-right: 4px;
	}
	.price{
		text-align: right;
		color: $main-color;
		position: absolute;
		bottom: -0.12rem;
		left: 0;
		width: 100%;

		.number{
			font-size: .38rem;
			font-weight: 700;
		}
	}
}
</style>
