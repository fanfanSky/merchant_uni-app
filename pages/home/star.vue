<!--
 * @Date: 2020-06-16 20:56:54
 * @LastEditTime: 2020-06-27 16:26:56
 * @Author: 江帆
 * @Github: https://github.com/fanfanSky/
--> 
<template>
  <view class="container">
        <span 
          class="star-item" 
          v-for="(item, index) in itemClasses"
          :key="index"
          :class="item"
        >
        </span>
  </view>
</template>
<script>
// 星星长度 
const LENGTH = 5
// 星星的状态
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
	data() {
		return {
		    itemClasses: []
		}
	},
    name: 'Star',
    props: {
        score: Number,
				default:5
    },
	created() {
	    console.log("进来了=========",this.itemClasses);
	    let result = []
	    let score = Math.floor(this.score * 2) / 2
	    console.log("score=========",score);
	    // 半星 (通过跟1取余判断是否为小数)
	    let hasDecimal = score % 1 !== 0
	    // 全星 （向下取整，获取全星部分）
	    let integer = Math.floor(score)
	    // 遍历全星
	    for(let i = 0; i < integer; i++){
	    	result.push(CLS_ON)
	    }
	    // 处理半星
	    if(hasDecimal){
	    	result.push(CLS_HALF)
	    }
	    // 补齐
	    while(result.length < LENGTH){ // 到这里还不够五颗星，则凑空星
	    	result.push(CLS_OFF)
	    }
	    console.log("result=========",result);
	    this.itemClasses = result;
		console.log("itemClasses=========",this.itemClasses);
		
	}
}
</script>
<style lang="less">
	.container {
		  position: relative;
		}
	.star-item.on,.star-item.half,.star-item.off{
		width: 20px;
		height: 20px;
		float: left;
		display: flex;
		align-items: center;
		background-size:cover;
		}
	.star-item.on {
		background-image: url('../../static/star/star24_on.png');
	}
	.star-item.half {
		background-image: url('../../static/star/star24_half.png');
	}
	.star-item.off {
		background-image: url('../../static/star/star24_off.png');
	}
	
</style>