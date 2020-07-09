<template>
	<view class="set-meal">
		<div class="voucherList">
			<div class="voucherText" v-if="couponList.length != 0">代金券</div>
			<v-voucherDetailModule v-for="(item,index) in couponList" :key="index" :info="item"/>
		</div>
		<div class="cobomList">
			<div class="cobomText"  v-if="foodList.length != 0">超值套餐</div>
			<food-card v-for="(item,index) in foodList" :key="index" :info="item"></food-card>
		</div>
	</view>
</template>

<script>
	import voucherDetailModule from './voucherDetailModule'
	import foodCard from "./foodCard";
	export default{
		components:{
			"v-voucherDetailModule": voucherDetailModule,
			'food-card': foodCard
		},
		props: {
			couponList: {
				type: Array,
				default: []
			},
			foodList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			}
		},
		methods:{
			goTogoodsDetail() {
				uni.navigateTo({
					url:'./goodsDetail'
				})
			},
			goToVoucherDetail() {
				uni.navigateTo({
					url:'./voucherDetail'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.voucherList {
		background-color: #fff;
		border-radius: 5px;
		margin: 0 8px;
		.voucherText {
			height: 40px;
			padding-left: 8px;
			padding-top: 10px;
		}
	}
	.cobomList {
		width: 100%;
		.cobomText {
			margin: 10px 0 0px 0px;
			font-size:16px;
			line-height:16px;
			color:rgba(10,30,44,1);
			border-bottom: 1px solid #eee;
			font-size: 20px;
			background-color: #fff;
			margin-left: 0px;
			height: 50px;
			border-radius: 5px;
			line-height: 50px;
			padding-left: 16px;
			font-weight: 500;
			color: #000000;
		}
		.cobomType {
			width: 100%;
			height: 126px;
			background-color: #fff;
			.cobomImg{
				width: 90px;
				height: 90px;
				margin-right: 4px;
				float: left;
				img {
					margin: 14px 2px 13px 2px;
				}
			}
			.cobomDetail {
				.detailTop{
					.discount {
						width:38px;
						height:16px;
						display: inline-block;
						background:linear-gradient(90deg,rgba(240,197,80,1) 0%,rgba(255,141,40,1) 100%);
						opacity:1;
						border-radius:4px;
						font-size:10px;
						font-family: 'Source Han Sans CN';
						font-weight:400;
						line-height:16px;
						color:rgba(255,255,255,1);
						opacity:1;
						margin-top: 24px;
						margin-right: 6px;
						text-align: center;
					}
					.cobomText {
						font-size:18px;
						font-family:Source Han Sans CN;
						font-weight:bold;
						line-height:16px;
						color:rgba(10,30,44,1);
						opacity:1;
						margin-bottom: 10px;
					}
				}
				.type {
					font-size:10px;
					font-family:Source Han Sans CN;
					font-weight:400;
					line-height:16px;
					color:rgba(154,154,154,1);
					opacity:1;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin-bottom: 10px;
					margin-top: 10px;
				}
				.current-price {
					font-size:18px;
					font-family: 'Source Han Sans CN';
					font-weight:500;
					line-height:16px;
					color:rgba(255,43,0,1);
					opacity:1;
					margin-right: 10px;
				}
				.original-price {
					font-size:12px;
					font-family: 'Source Han Sans CN';
					font-weight:400;
					line-height:16px;
					color:rgba(154,154,154,1);
					opacity:1;
				}
			}
		}
	}
</style>
