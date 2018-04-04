<template>
    <div class="map-body" id="container">
    
    </div>
</template>
<script>
var lanlng = []
const deial = {
    name: 'qqMap',
    props: ['Lat' , 'Lng'],
    mounted() {
        window.addMap = this.addMap.bind(this)
        lanlng = [this.Lat,this.Lng]
    },
    methods: {
        initMap() {
            if (window.qq) {
                this.addMap()
                return
            }
            var script = document.createElement('script')
            script.src = 'http://map.qq.com/api/js?v=2.exp&key=DYDBZ-XAR3D-LFT44-P4WQB-HACWO-2EBFX&libraries=convertor&callback=addMap'
            script.defer = true
            script.async = true
            document.body.appendChild(script)
        },
        addMap() {
            try {
                if (!lanlng[0]) {
                    setTimeout(this.addMap, 50)
                    return
                }
                let center = new qq.maps.LatLng(lanlng[0], lanlng[1]);
                new qq.maps.convertor.translate(center, 3, function (res) {
                    let map = new qq.maps.Map(document.getElementById('container'), {
                        center: res[0],
                        zoom: 16
                    });
                    //创建marker
                    let marker = new qq.maps.Marker({
                        position: res[0],
                        map: map
                    });
                })
            } catch (err) {
                console.log(err)
            }
        }
    },
}
export default deial
</script>
<style lang="scss">
.map-body {
    width: 100%;
    height: 3.3rem;
    .smnoprint {
        bottom: 1.5rem !important;
    }
    div[title='放大'] {
        width: .6rem !important;
        height: .6rem !important;
    }
    div[title='缩小'] {
        width: .6rem !important;
        height: .6rem !important;
    }
}
</style>

