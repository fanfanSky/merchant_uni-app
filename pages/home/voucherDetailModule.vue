<template>
	<!-- 代金券详情组件 -->
	<view class="voucherDetailModule flex-center">
		<div class="voucherType flex-between">
			<div class="voucherLeft" @click="goToVoucherDetail()">
				<div class="fullMoney">
					<span class="rmb">￥</span>
					<span>{{info.price | foodCardFilter}}</span>
				</div>
				<div class="middle">
					<p class="moneyVoucher">{{info.name}}</p>
					<p class="limitTimeText" v-if="info.startTime == ''? isShow : !isShow">有效期: {{startTime}}--{{expireTime}}</p>
					<p class="limitTimeText" v-else>有效期: 不限</p>
				</div>

			</div>
			<div class="delete status-main">
				<!-- v-if="info.checkStatus != 0" -->
				<div v-if="info.checkStatus != 0"   @click="deleteVoucher" style="text-align: center; padding-right: 1px;">删除</div>
				<div v-if="info.checkStatus == 0"  style="text-align: center;padding-left: 1px;color: #00C777;">审核中</div>
				<!-- <div v-if="info.checkStatus == 1" class="passed">已通过</div> -->
				<div v-if="info.checkStatus == 2" style="text-align: center;padding-left: 1px;" class="unpassed">未通过</div>
				<!-- </div> -->
			</div>
		</div>
	</view>
</template>

<script>
	import useExplain from './useExplain'
	import { deleteGood,deletecoupon } from "../../api/goodsApi";
	import { timestampStart,timestampExpire } from  '../../timestamp/timestamp.js'
	export default {
		components:{
			"v-explain": useExplain
		},
		data() {
			return {
				isShow: false,   // 是否显示使用日期或者使用日期不限文字
				startTime:'',
				expireTime:''
			}
		},
		props: {
			info: {
				type: Object,
				default: {}
			},
			clickOpen: {
				type: Boolean,
				default: true
			}
		},
		created() {
			this.timestampToTime();
		},
		methods:{
			//下架事件	
			deleteVoucher() {
				let self = this;
				uni.showModal({
					title: '提示',
					content: '代金券删除后不可恢复，是否确认删除代金券？',
					success: function (res) {
						if (res.confirm) {
							for(let i = 0;i<self.info.couponPlatforms.length;i++){
								let qq = self.info.couponPlatforms[i].couponId;
								deletecoupon(qq).then(res => {
									console.log("res.data.message=====》",res.data.message)
									self.PopShowToastTips('代金券已删除');
									// 延迟跳转首页
									setTimeout(function(){ uni.reLaunch({url: '/pages/home/home'})},1000);
								});
								
							}
							
						}
					}
				});
			},
			// 时间戳转换成时间
			timestampToTime(){
				this.startTime = timestampStart(this.info.startTime)
				this.expireTime = timestampExpire(this.info.expireTime)
			},
			goToVoucherDetail(){
				if (!this.clickOpen) return;
				this.$store.state.vInfo = this.info;
				uni.navigateTo({
					url:'./voucherDetail'
				})

			}
		}
	}
</script>

<style lang="less" scoped>
	.voucherType {
		padding: 0px;
		box-sizing: border-box;
	}
	.voucherType{
		width: 100%;
		height: 70px;
		border-top: 1px solid #eee;
		.voucherLeft{
			display: flex;
			align-items: center;
			flex: 1;
		}
		.fullMoney {
			height: 100%;
			min-width: 150upx;
			text-align: center;
			line-height: 100%;
			padding:0px 12upx;
			span {
				font-size:28px;
				font-weight: bolder;
				font-weight:500;
				line-height:32upx;
				color:rgba(255,70,33,1);
			}
			.rmb {
				font-size:14px;
			}
		}
		.middle {
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-left: 6px;
			.moneyVoucher {
				color:rgba(10,30,44,1);
				font-size: 16px;
			}
			.limitTimeText{
				font-size: 14px;
				color:rgba(154,154,154,1);
			}
		}
		.delete {
			border-left: 1px dotted rgba(232,232,232,1);
			font-size:14px;
			color:rgba(255,43,0,1);
			text-align: center;
		}
		.status-main{
			display: flex;
			height: 100%;
			justify-content: center;
			align-items: center;
			padding: 0px 6px;
			box-sizing: border-box;
			width: 60px;
		}
		.examining {
			font-size:12px;
			color:rgba(20, 20, 20, 1.0);
			text-align: center;
		}
		.passed {
			font-size:12px;
			color:rgba(0, 85, 0, 1.0);
			text-align: center;
		}
		.unpassed {
			font-size:12px;
			color:rgba(144, 144, 144, 1.0);
			text-align: center;
		}
	}
</style>
