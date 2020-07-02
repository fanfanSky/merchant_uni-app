<template>
	<view class="useExplain">
		<div class="useExplain-div">
			<div class="useExplain">
				<span>使用说明</span>
			</div>
			<div class="explainContent">
				<textarea v-model="mDesc" auto-height style="width: 100%;" disabled="disabled"></textarea>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		props: ['mDesc']
	}
</script>

<style lang="less" scoped>
	.useExplain-div {
		width: 100%;
		height: auto;
		background-color: #fff;
		.useExplain { 
			margin-top: 6px;
			border-bottom: 1px solid rgba(225,225,225,1);
			line-height: 44px;
			position: flex;
			justify-content: center;
			margin-left: 17px;
			margin-right: 17px;
			span:first-child{
				font-size:16px;
				font-weight:bold;
				line-height:16px;
				color:rgba(0,0,0,1);
			}
		}
		.explainContent {
			margin: 7px 17px 0 17px;
			font-size:14px;
			color:rgba(102,102,102,1);
		}
	}
</style>
