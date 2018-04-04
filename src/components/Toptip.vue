<template>
    <div class="top-tip">
        <span class="tip-text">{{msg}}</span>
    </div>
</template>
<script>
export default {
    name: 'tip',
    props: {
        msg: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss">
.top-tip {
    padding: .2rem .3rem;
    margin-bottom: .15rem;
    background-color: #fff5d5;
    .tip-text {
        line-height: .4rem;
        color: #b5931d;
        font-size: .28rem;
    }
}
</style>


