<template>
    <div class="pay-header">
        <div class="lessor">
            <span class="align-left">
                <img class="lessor-icon" src="../assets/img/icon-logo.png" />
                <span class="lessor-name">寓多多</span>
            </span>
            <span class="align-right">出租方</span>
        </div>
        <div class="infor">
            <span class="align-left">
                <span class="house-name">{{ rentName }}</span>
                <span class="house-type">{{ rentType }}</span>
            </span>
            <span v-if="price != 0" class="align-right">{{ price }}<i>元</i></span>
        </div>
    </div>
</template>
<script>
	export default {
		props: {
            rentName: {
                type: String,
                default: ''
            },
            rentType: {
                type: String,
                default: ''
            },
            price: {
                type: Number,
                default: 0
            },
        },
		data () {
            return {}
		},
		created () {

		},
		methods: {

		}
	}
</script>
<style lang="scss" scope>
    @import "../assets/css/base";

    .pay-header {
        padding: .47rem .3rem;
        border-bottom: .15rem solid #efefef;

        .lessor, .infor {
            @include clearfix();
        }

        .lessor {
            margin-bottom: .3rem;
            line-height: .68rem;

            .lessor-icon {
                width: .68rem;
                height: .68rem;
            }

            .lessor-name {
                margin-left: .15rem;
                font-size: .28rem;
            }

            .align-right {
                color: #999;
                float: right;
            }
        }

        .infor {
            line-height: .42rem;

            .house-name {
                @include ellipsis(1);
                display: inline-block;
                max-width: 4rem;
                margin-right: .15rem;
                font-size: .28rem;
                vertical-align: middle;
            }

            .house-type {
                display: inline-block;
                padding: 0 .1rem;
                color: $main-color;
                font-size: .24rem;
                @include setLine(null, $main-color);

                &:before {
                    border-radius: .3rem;
                }
            }

            .align-right {
                color: $main-color;
                font-size: .42rem;
                float: right;

                i {
                    font-size: .24rem;
                    vertical-align: baseline;
                }
            }
        }
    }
</style>
