<template>
	<view class="content" :style="{ 'height':QHeight+'px' }">
		<image :style="{ 'height':QHeight+'px' }" src="../static/qidong/qidong.png" mode=""></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: 5, // 创建一个时间
				QHeight:0,
			}
		},
		onLoad() {
			// 获取可用的窗口的高度
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(0);
					this.QHeight = height;
				}
			});
			// 当页面启动的时候就调用定时器
			let timeS = this.time;
			this.QTime(timeS);
		},
		methods:{
			QTime(timeS) {
				// 开启定时器
				let timeStart = setInterval(function(){
					timeS--;
					// 判断
					if(timeS == 0){
						// 当time的时间等于0时 关闭定时器
						clearInterval(timeStart);
						uni.redirectTo({
							url:'./login'
						})
					}
					console.log("定时器开启",timeS)
				},10000,timeS)
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		height: 100%;
	}
	.content>image {
		width: 100%;
	}
</style>
