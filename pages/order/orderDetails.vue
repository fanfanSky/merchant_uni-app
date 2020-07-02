<template>
	<view class="orderDetails home">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" title="订单详情" @clickLeft="goBack()"></uni-nav-bar>
			<div class="origin-div">
				<div class="origin-frame" v-if="orderDetails.book_id != 0">
					<div class="origin">订单来源：<span>{{orderDetails.platformName}}</span></div>
				</div>
				<div class="cobommodule">
					<div class="cobommodule-img">
						<image v-if="orderDetails.img_url.length != 0" lazy-load mode="widthFix"  :fade-show="true" :src="orderDetails.img_url" />
						<span class="total-money" v-else >￥{{orderDetails.total_money}}</span>
					</div>
					<div class="cobommodule-content">
						<div class="cobommodoudule-title">
							<span class="title-name">{{orderDetails.name}}</span>
							<span>{{orderDetails.order_id}}号</span>
						</div>
						<div class="order">订单号：{{orderDetails.orderCode}}</div>
						<div class="order" style="padding-top:0px;">完成时间：{{$moment(orderDetails.use_time * 1000).format('YYYY.M.D H:mm')}}</div>
						<div class="monery">
							<span>X{{orderDetails.num}}</span>
							<span>￥{{orderDetails.value | foodCardFilter}}</span>
						</div>
					</div>
				</div>
				<div class="monery-content">
					<div class="monery-flex">
						<span>用户支付</span>
						<span>￥{{orderDetails.add_money | foodCardFilter}}</span>
					</div>
					<div class="monery-flex">
						<span>平台佣金</span>
						<span>-￥{{orderDetails.rbCommissionAmont | foodCardFilter}}</span>
						
					</div>
				</div>
				<div class="real-monery">实际收入：{{money | foodCardFilter}}</div>
			</div>
			<!-- 进账信息 -->
			<div class="cabomContent"  v-show="foods.length!=0">
				<div class="scanContent">
					<div class="scanTop">套餐内容</div>
					<div class="scanDown">
						<div class="main-cate" v-for="food in foods">
							<span>{{food.name}}</span>
							<span>
							{{food.price | foodCardFilter}}
							<span style="padding: 0px 3px;">*</span>
							{{food.num}}
							</span>
							<span>￥{{food.totalPrice | foodCardFilter}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import rownumber from './rowNumber'
	import cobommodule from '../home/cobomModule'
	export default {
		components:{rownumber,cobommodule},
		data() {
			return {
				index: 0  ,//  order详情页传过来的下标      index: 0 1 2
				orderDetails:{},
				foods:[],
			}
		},
		computed:{
			//商家实际挣的钱  用户付的钱 - 平台佣金
			money:function() {
				return this.orderDetails.add_money - this.orderDetails.rbCommissionAmont * this.orderDetails.add_money;
			}
		},
		onLoad(options) {
			this.orderDetails = JSON.parse(options.item)
			console.log('orderDetails',this.orderDetails)
			//判断是代金券还是超值套餐的类型
			if(this.orderDetails.type != 1){
				this.foods = JSON.parse(this.orderDetails.foods_json)
				console.log("this.foods++++++++",this.foods)
				return
			}
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
		padding:0px 16px;
		box-sizing:border-box;
		width: 100%;
		background-color: #fff;
		.origin-frame {
			width: 100%;
			height: 50px;
			.origin{
				font-size:16px;
				height: 100%;
				line-height: 50px;
				border-bottom:1px solid rgba(225,225,225,1);
				span {
					color:rgba(252,108,79,1);
				}
			}
		}
		.cobommodule{
			 display: flex;
			 justify-content: space-between;
			 padding: 8px;
			 font-size: 16px;
			 color:rgba(154,154,154,1);
			.cobommodule-img{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 60px;
				height: 60px;
				border-radius:4px;
				overflow: hidden;
				image{
					width: 100%; 
					height: 60px; 
					background-size: cover;
				}
				.total-money{
					text-align: center;
				}
				span{
					font-size: 26px;
					color: #ff4621;
					
				}
			}
			.cobommodule-content{
				flex: 1;
				margin-left: 20px;
				.cobommodoudule-title{
					display: flex;
					justify-content: space-between;
					.title-name{
						color:rgba(10,30,44,1);
						font-weight: bolder;
					}
				}
				.order{
					font-size: 14px;
					padding: 6px 0px;
				}
				.monery{
					display: flex;
					justify-content: space-between;
				}
			}
		}
		.monery-content{
			border-top:1px solid rgba(225,225,225,1);
			font-size: 14px;
			color:rgba(10,30,44,1);
			.monery-flex{
				display: flex;
				justify-content: space-between;
				color:rgba(10,30,44,1);
				padding: 14px 0px;
				font-weight:500;
				font-weight: bolder;
			}
		}
		.real-monery{
			display: flex;
			justify-content: flex-end;
			border-top:1px solid rgba(225,225,225,1);
			color:rgba(10,30,44,1);
			line-height: 27px;
			font-size: 16px;
			font-weight:500;
			font-weight: bolder;
			padding: 10px 0px 0px 0px;
		}
	}
	.cabomContent {
		width: 100%;
		background-color: #fff;
		margin-top: 4px;
	}
	.scanContent {
		width: 100%;
		.scanTop {
			font-weight:500;
			line-height:16px;
			line-height: 35px;
			margin: 0 16px;
			border-bottom: 1px solid rgba(225,225,225,1);
			margin-bottom: 6px;
			font-size:16px;
			font-weight:bold;
			color:rgba(0,0,0,1);
		}
		.scanDown {
			margin: 0 16px;
			background-color: #fff;
			.main {
				font-size:16px;
				line-height:16px;
				color:rgba(10,30,44,1);
				strong {
					margin-right: 5px;
				}
			}
			.main-cate {
				font-size:14px;
				line-height:16px;
				color:rgba(102,102,102,1);
				margin-left: 12px;
				margin-top: 10px;
				display: flex;
				justify-content: center;
				padding-bottom: 5px;
				span:first-child {
					flex: 1;
				}
				span:nth-child(2) {
					flex: 1;
					text-align: center;
				}
				span:last-child {
					flex: 1;
					text-align: right;
				}
			}
		}
	}
</style>
