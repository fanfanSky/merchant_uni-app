<template>
	<view class="detail-main">
		<div v-show="collectExpendListData.length != 0" class="detail">收支明细</div>
		<p class="empty" v-if="collectExpendListData.length == 0" style="margin-top:400upx;">
			没有更多数据啦
		</p>
		<!-- 收支详情列表 -->
		<div class="detail-list" v-else>
			<div class="collectExpendType" v-for="(item,index) in collectExpendListData" :key="index" >
				<div class="top-main">
					<span class="type-text">{{item.mDesc}}</span>
					<span class="money-change">{{item.type == 1? '+':'-'}}{{item.orderCouponAmount}}</span>
				</div>
				
				<div class="top-main" v-show="item.rbCouponCommissionAmount != null || item.rbCouponCommissionAmount!=underfined">
					<span class="type-text">平台佣金</span>
					<span class="money-change">{{item.type == 1 || item.type == 2? '-':'+'}}{{item.rbCouponCommissionAmount}}</span>
				</div>
				   
				<div class="top-main" v-show="item.storeCouponAmount.length != 0">
					<span class="type-text color-style" >实收</span>
					<span class="money-change">￥{{item.storeCouponAmount}}</span>
				</div>
			
				<div class="down">
					<span class="date">{{item.createTime * 1000 | formatTime}}</span>
				</div>
				<div  class="balance">
					<!-- <span class="type-text">余额</span> -->
					 <!-- :style="{color: item.type ==1 ? '#34e073' : '#ff0000'}" -->
					<!-- <span class="money-change monery-l">￥{{item.balance}}</span> -->
				</div>
			</div>
		</div>

		
	</view>
</template>

<script>
	export default {
		props:['collectExpendListData'],
		data() {
			return {
				 
			}
		},
		created() {
			var self = this;
			setTimeout(function(){
				console.log("====>",self.collectExpendListData.length)
			},1500)
		},
		methods:{
		}
	}
</script>

<style lang="less" scoped>
	.detail-main{
		width: 100%;
		height: 100vh;
		background-color: #FFFFFF;
		overflow-y: scroll;
		padding-bottom: 20px;
	}
	.detail-list{
		margin-top: 120upx;
	}
	.empty{
		font-size: 16px;
		text-align: center;
		margin-top: 500upx 0 0 0;
		height: 30px;
		color: #999;
		width: 100%;
	}
	.detail {
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size:18px;
		font-weight:500;
		color:#0A1E2C;
		padding: 40upx 0 20upx 0;
		position: fixed;
		top: 306upx;
		right: 0px;
		left: 0px;
		width: 100%;
		// margin-right: 6px;
	}
	.collectExpendType {
		background-color: #fff;
		border-bottom: 1px solid #E1E1E1;
		margin: 0 10px;
		.top-main {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 20upx 0px 0px 0px;
			.type-text,.money-change {
				font-size:16px;
			}
			.type-text{
				color: #666;
			}
			.money-change{
				color:#0A1E2C;
			}
			.color-style{
				color: #000000;
			}
		}
		.down {
			width: 100%;
			font-size:16px;
			color:rgba(154,154,154,1);
			padding: 10upx 0px 10upx 0px;
			text-align: right;
			.date{
				color: #9A9A9A;
			}
		}
		// 余额
		.balance{
			width: 100%;
			text-align: right;
			color: #666666;
			font-size: 16px;
			padding-bottom: 20upx;
			.monery-l{
				padding-left: 20upx;
			}
		}
	}
</style>
