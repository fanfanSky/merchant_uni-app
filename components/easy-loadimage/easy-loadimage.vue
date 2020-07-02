<template>
    <view class="easy-loadimage" :id="uid">
        <image class="origin-img" :src="imageSrc" :mode="mode"
            v-if="loadImg&&!isLoadError" 
            v-show="showImg"
            :class="{'no-transition':!openTransition,'show-transition':showTransition&&openTransition}"
            @load="handleImgLoad" 
            @error="handleImgError">
        </image>
        <view class="loadfail-img" v-else-if="isLoadError"></view>
        <view class="loading-img" v-show="!showImg&&!isLoadError"></view>
    </view>
</template>
<script>
// 生成全局唯一id
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    })
}
export default{
    props:{
        imageSrc:{
            type: String,
        },
        mode:{
            type: String,
        },
        scrollTop:{
            type: Number,
        },
        openTransition:{
            type: Boolean,
            default:false,
        },
        viewHeight:{
            type:Number,
            default() {
                return uni.getSystemInfoSync().windowHeight;
            }
        }
    },
    watch:{
        scrollTop(val){
            this.onScroll(val)
        }
    },
    data(){
        return {
            uid:'',
            loadImg:false,
            showImg:false,
            isLoadError:false,
            showTransition:false,
        }
    },
    methods:{
        init(){
            this.uid = 'uid-' + generateUUID();
            this.$nextTick(this.onScroll)
        },
        handleImgLoad(e){
            // console.log('success');
            this.showImg = true;
            // this.$nextTick(function(){
            //     this.showTransition = true
            // })
            setTimeout(()=>{
                this.showTransition = true
            },50)
        },
        handleImgError(e){
            // console.log('fail');
            this.isLoadError = true;
        },
        onScroll(scrollTop){
            // 加载ing时才执行滚动监听判断是否可加载
            if(this.loadImg || this.isLoadError) return;
            const id = this.uid
            const query = uni.createSelectorQuery().in(this);
            query.select('#'+id).boundingClientRect(data => {
                if(!data) return;
                if(data.top - this.viewHeight<0){
                    this.loadImg = true;
                }
            }).exec()
        },
    },
    mounted() {
        this.init()
    }
}
</script>

<style scoped>
    /* 官方优化图片tips */
    image{
        will-change: transform
    } 
    /* 渐变过渡效果处理 */
    image.origin-img{
        width: 100%;
        height: 100%;
        opacity: 0.3;
    }
    image.origin-img.show-transition{
        transition: opacity 1.2s;
        opacity: 1;
    }
    image.origin-img.no-transition{
        opacity: 1;
    }
    /* 加载失败、加载中的占位图样式控制 */
    .loadfail-img{
         height: 100%;
         background: url('~@/static/easy-loadimage/loadfail.png') no-repeat center;
         background-size: 50%;
    }
    .loading-img{
        height: 100%;
        background: url('~@/static/easy-loadimage/loading.gif') no-repeat center;
        background-size: 100rpx;
    }
</style>

