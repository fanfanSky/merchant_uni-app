<template>
	<view class="scanAffirm">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()"></uni-nav-bar>
			<p class="useScan-text">是否确定使用该套餐:</p>
			<div class="scanName">双人火锅套餐</div>
			<v-cobomcontent />
			<div style="display: flex; width: 100%; justify-content: center;">
				<button class="affirmUse">确定使用</button>
			</div>
		</div>
	</view>
</template>

<script>
	import cobomcontent from './cobomcontent'
	export default{
		components:{
			"v-cobomcontent": cobomcontent
		},
		data() {
			return {
				
			}
		},
		methods:{
			goBack() {
				uni.navigateBack({
					delta:1
				})
			},
			
			
		}
	}
</script>

<style lang="less" scoped>
	.useScan-text {
		font-size:18px;
		font-family: 'Source Han Sans CN';
		line-height:18px;
		color:rgba(154,154,154,1);
		margin: 10px 0px 21px 15px;
	}
	.scanName {
		width: 100%;
		line-height: 35px;
		text-align: center;
		font-size:16px;
		font-family: 'Source Han Sans CN';
		font-weight:500;
		color:rgba(10,30,44,1);
		margin-bottom: 2px;
	}
	
	.affirmUse {
		background-color: #45D5A2;
		font-size:18px;
		font-family: 'Source Han Sans CN';
		line-height:18px;
		color:rgba(255,255,255,1);
		line-height: 39px;
		flex: 1;
		margin:0 87px;
		margin-top: 40px;
	}
</style>
