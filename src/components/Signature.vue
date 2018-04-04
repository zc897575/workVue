<template>
	<div class="signature" ref="wrapper">
		<canvas></canvas>
	</div>
</template>

<script>
import SignaturePad from 'signature_pad'

SignaturePad.prototype.toDataURL = function (type, width) {
    var _canvas = document.createElement('canvas')
    var ctx = _canvas.getContext('2d')
    width = width || 200
    var scale =  width / this._canvas.width
    var height = Math.floor(this._canvas.height*scale)
    _canvas.width = width
    _canvas.height = this._canvas.height*scale
    var img = new Image()
    img.src = this._canvas.toDataURL()
    switch (type) {
        case 'image/svg+xml':
            return this._toSVG();
        default:
            for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                options[_key - 1] = arguments[_key];
            }
            return new Promise(function (resolve, reject) {
                img.onload = function(){
                    ctx.drawImage(img, 0, 0, width, height)
                    img = img.onload = img.onerror = null
                    return resolve(_canvas.toDataURL.apply(_canvas, [type].concat(options)))
                }
                img.onerror = function () {
                    img = img.onload = img.onerror = null
	                return reject()
                    self.$vux.toast.text('保存失败，请重试', 'middle')
                }
            })
    }
}
export default {
    props: {
        minWidth: { //最细笔画
		    type: Number,
			default: 1
		},
        maxWidth: { //最粗笔画
		    type: Number,
	        default: 1
        },
        penColor: { //笔画颜色
            type: String,
            default: '#000'
        },
	    imgWidth: { //保存的图片宽度，高度会自动成比例缩放
            type: Number,
            default: 200
	    }
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化
        setTimeout(() => {
            this._init()
        }, 20)
    },
    methods: {
        _init() {
			this.canvas = this.$refs.wrapper.querySelector('canvas')
	        this.resizeCanvas()
	        this.signaturePad = new SignaturePad(this.canvas, {
                minWidth: this.minWidth,
                maxWidth: this.maxWidth,
                penColor: this.penColor
	        })
        },
        resizeCanvas() {
            var ratio =  Math.max(window.devicePixelRatio || 1, 1)
            this.canvas.width = this.canvas.offsetWidth * ratio
            this.canvas.height = this.canvas.offsetHeight * ratio
            this.canvas.getContext("2d").scale(ratio, ratio)
        },
        clear() {
            this.signaturePad.clear()
	    },
	    save() {
            if (this.signaturePad.isEmpty()) {
                this.$vux.toast.text('请先输入签名', 'middle')
                return new Promise(() => {})
            } else {
                return this.signaturePad.toDataURL('', this.imgWidth)
            }
	    }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

.signature{
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;

	canvas{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.01) inset;
	}
}
</style>
