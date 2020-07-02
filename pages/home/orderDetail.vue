<template>
	<view class="orderDetails">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" title="订单详情" @clickLeft="goBack()"></uni-nav-bar>
			<div class="origin-div">
				<div class="origin-frame">
					<div class="origin">订单来源：<span>北部湾银行</span></div>
				</div>
				<!-- <rownumber :numberStatus="parseInt(index)" /> -->
				<cobommodule :idStatus="parseInt(index)"/>

			</div>
			<!-- 进账信息 -->
			<div class="income">
				<div>进账信息</div>
				<div>
					<span>商品售价</span>
					<span>￥288</span>
				</div>
				<div>
					<span>合作方补贴</span>
					<span>+666</span>
				</div>
				<div>
					<span>平台补贴</span>
					<span>+666</span>
				</div>
				<div>实际进账：298</div>
			</div>
			<div class="cabomContent">
				<cobomcontent />
			</div>
		</div>
	</view>
</template>

<script>
	import rownumber from '../order/rowNumber'
	import cobomcontent from './cobomcontent'
	import cobommodule from './cobomModule'
	export default {
		components:{rownumber,cobomcontent,cobommodule},
		data() {
			return {
				index: ''   //  order详情页传过来的下标      index: 0 1 2
			}
		},
		onLoad: function(index){
			console.log(index.index); //打印出上个页面传递的参数。
			this.index = index.index
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		background-color: #f2f5f7;
	}
	.origin-div {
		width: 100%;
		background-color: #fff;
		.origin-frame {
			width: 100%;
			height: 50px;
			.origin{
				font-size:16px;
				font-family:Source Han Sans CN;
				font-weight:400;
				height: 100%;
				line-height: 50px;
				margin: 0 16px;
				border-bottom: 1px solid #BBB;
				span {
					color:rgba(252,108,79,1);
				}
			}
		}
	}
	.income {
		width: 100%;
		height: 250px;
		background-color: #fff;
		margin-top: 4px;
		div:first-child{
			height: 49px;
			border-bottom: 1px solid #E1E1E1;
			margin: 0 16px;
			line-height: 49px;
			font-size:16px;
			font-family:'Source Han Sans CN';
			font-weight:bold;
		}
		div:nth-child(2),div:nth-child(3),div:nth-child(4) {
			height: 49px;
			border-bottom: 1px solid #E1E1E1;
			margin: 0 16px;
			font-size:14px;
			font-family:'Source Han Sans CN';
			font-weight:500;
			color:rgba(10,30,44,1);
			line-height: 49px;
			display: flex;
			justify-content: space-between;
		}
		div:nth-child(3),div:nth-child(4) {
			span:last-child{
				font-size:14px;
				font-family:Source Han Sans CN;
				color:rgba(69,213,162,1);
			}
		}
		div:last-child{
			text-align: center;
			line-height: 50px;
			font-size:16px;
			font-family:Source Han Sans CN;
			font-weight:500;
			color:rgba(10,30,44,1);
		}
	}
	.cabomContent {
		width: 100%;
		background-color: #fff;
		margin-top: 4px;
	}
</style>
