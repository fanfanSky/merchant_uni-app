<template>
	<!-- 中间的套餐组件 -->
	<view class="cobomModule">
		<div class="middle">
			<div class="left-img">
				<image v-if="info.img_url.length!=0" lazy-load mode="widthFix"  :fade-show="true" :src="info.img_url" />
				<span v-else>￥{{info.add_money}}</span>
			</div>
			<div class="right">
				<p class="cobomName">{{info.name}}</p>
				<div class="time-orderNum" v-show="idStatus == 0">
					<span>预约时间: {{$moment(info.use_time * 1000).format('YYYY.M.D H:mm')}}</span>
				</div>
				<div class="two">
					<p class="orderNumber" v-show="idStatus == 1">订单号：{{info.orderCode}}</p>
<!-- 					<p class="finishTime" v-show="idStatus == 1">
						<span>完成时间：{{$moment(info.use_time * 1000).format('YYYY.M.D H:mm')}}</span>
					</p> -->
					<div class="price-div" >
						<span class="price" >￥{{info.add_money}}</span>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>
<script>
	export default {
		props:{
			idStatus:{
				type: Number,
				default: 0
			},
			info: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				
			}
		},
		onLoad() {
			console.log("this.idStatus",this.idStatus)
		},
		methods:{

		}
	}
</script>

<style lang="less" scoped>
	.middle {
		margin: 0 8px;
		padding-top: 9px;
		.left-img{
			width: 60px;
			height: 60px;
			margin-left: 7px;
			float: left;
			border-radius:4px;
			text-align: center;
			margin-right: 21px;
			overflow: hidden;
			background-color: #FFFFFF;
			image{
				width: 100%; 
				height: 60px; 
				background-size: cover;
			}
			span{
				color: #ff4621;
				font-size: 20px;
				font-weight: 600;
			}
		}
		.right{
			.cobomName {
				width: 100%;
				font-size:16px;
				font-weight:550;
				line-height:16px;
				color:rgba(10,30,44,1);
			}
			.time-orderNum {
				margin-top: 10px;
				font-size:14px;
				line-height:16px;
				color:rgba(252,108,79,1);
				span{
					color:rgba(154,154,154,1);
				}
			}
			.time-orderNum span:nth-child(2){
				margin-left: 10px;
			}
			
			.time {
				span:last-child{
					margin-left: 9px;
				}
			}
			.two {
				.price-div {
					display: flex;
					justify-content: flex-end;
					.price {
						font-size:16px;
						color:rgba(10,30,44,1);
						font-weight: 450;
					}
				}
				.orderNumber,.finishTime {
					font-size:14px;
					color:rgba(154,154,154,1);
					margin-top: 10px;
				}
				.finishTime {
					span:last-child{
						margin-left: 10px;
					}
				}
			}
			
			
		}
	}
</style>
