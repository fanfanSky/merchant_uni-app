<template>
	<view class="goodsDetail home" >
		<div class="top-div" >
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回"  color="#000000" title="商品详情" @clickLeft="goBack()"></uni-nav-bar>
		</div>
		<div class="goods-main">
			<div class="top-Detail">
				<div class="goodsPic">
					<div class="centerPic">
						<div class="swiper-main">
							<swiper :indicator-dots="true" indicator-active-color="#00ffff" easing-function="easeInOutCubic" :autoplay="true" :circular="true" :interval="3000" :duration="1000">
								<swiper-item v-for="(item,index) in gInfoUp.imgUrlList" :key="index">
									<img lazy-load mode="scaleToFill" :class="{'active':isChoose}" @click="imgScc" :src="item" width="100%" />
								</swiper-item>
							</swiper>
						</div>
					</div>
				</div>
				<div class="goods">
					<div class="left">
						<div class="goodsName">{{gInfoUp.name}}</div>
						<div class="price-main">
							<span class="goods-price" style="flex: 1;">¥{{gInfoUp.price | foodCardFilter}}</span>
							<span class="goods-value" style="flex: 1;">¥{{gInfoUp.value | foodCardFilter}}</span>
							<span class="month-sell" style="flex: 1;">月售{{Math.floor(Math.random(0,1) * 100 + 1) }}</span>
						</div>
					</div>
				</div>
				<div class="cabomContent">
					<v-cobomcontent :foods="foods" />
				</div>
				<!-- 售价信息 -->
				<div class="price-information">
					<div class="price-title">
						售价信息
					</div>
					<div class="information-line"></div>
					<div class="platform-name">
						<div  style="flex: 1;" class="platform-title flex-center">
							平台名称
						</div>
						<div style="flex: 1;" class="platform-title flex-center">
							商家让利
						</div>
						<div style="flex: 1;" class="platform-title flex-center">
							售价
						</div>
					</div>
					<div   class="flex-center platform-information" v-for="item in couponPlatforms" >
						<div style="flex: 1;height: 100%;" class="flex-center platform-item">
							{{ item.platformName }}
						</div>
						<div style="flex: 1;height: 100%;" class="flex-center platform-item">
							￥{{ item.storeSubsidy | foodCardFilter}}
						</div>
						<div class="flex-center platform-item platform-storeSubsidy">
							¥{{ parseFloat(gInfoUp.value) - (parseFloat(item.storeSubsidy) + parseFloat(item.platformSubsidy) + parseFloat(item.rbSubsidy)) | foodCardFilter}}
						</div>
					</div>
				</div>
				<!-- 使用说明组件 -->
				<v-explain :mDesc="gInfoUp.mDesc" />
			</div>
		</div>
	</view>
</template>

<script>
	import cobomcontent from '../home/cobomcontent'
	import useExplain from '../home/useExplain'
	import {mapState} from 'vuex'
	import {logout} from "../../util/auth"
	import {getGoodsDetail} from "../../api/goodsApi"  //获取商品详情数据

	export default {
		components:{
			"v-cobomcontent": cobomcontent,
			"v-explain": useExplain
		},
		data() {
			return {
				isChoose:false,
				couponPlatforms:[],
				foods:[],
				goodsDetail:[],
				gInfoUp:{},
				arr:[]
			}
		},
		onLoad(options) {
			const res = getGoodsDetail(options.id).then(res=>{
				this.gInfoUp = res.data
				this.couponPlatforms = this.gInfoUp.couponPlatforms;
				this.foods = JSON.parse(this.gInfoUp.foodsJson)
				this.gInfoUp.imgUrlList = JSON.parse(this.gInfoUp.imgUrls);
				//实际价格的计算
				this.gInfoUp.price = parseFloat(this.gInfoUp.value) - parseFloat(this.gInfoUp.storeSubsidy)
			})		
		},
		methods:{		
			// 返回上一页
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			//轮播图数据请求
			imgScc:function () {                     
				this.isChoose = !this.isChoose  
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		background-color: #f2f5f7;
	}
	.goodsDetail{
		background:rgba(242,245,247,1);
		.goods-main{
			overflow-y: scroll; 
			flex: 1; 
			margin-top: 74px;
		}
	}
	.platform-title {
		font-size:14px;
		font-family:Source Han Sans CN;
		font-weight:500;
		color:rgba(10,30,44,1);
	}
	.platform-item {
		font-size:14px;
		font-family:Source Han Sans CN;
		font-weight:400;
		color:rgba(130,130,130,1);
	}
	// 商家让利
	.platform-storeSubsidy{
		flex: 1;
		height: 100%;
		color:rgba(252,108,79,1);
	}
	.top-Detail {
		overflow-x: hidden;
		overflow-y: scroll;
		.goodsPic {
			width: 100%;
			height: 525upx;
			background-color: #fff;
			margin-bottom: 6px;
			.centerPic{
				width: 100%;
				height: 100%;
				margin: auto;
				position: relative; 
				background-size: cover;
				.swiper-main{
					width: 100%; 
					overflow: hidden; 
					height: 100%;
				}
				uni-swiper{
					height: 100%;
				}
				img {
					height: 100%;
					transform: scale(1);   /*图片原始大小1倍*/
					transition: all ease 0.5s;	/*图片放大所用时间*/	
					
				}
				img.active {
					transform: scale(1.5);   /*图片需要放大3倍*/
					position: absolute;      /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
					z-index: 100;
				}
			}
		}
		.goods {
			width: 100%;
			background-color: #fff;
			margin-bottom: 6px;
			display: flex;
			justify-content: space-between;
			padding: 8px;
			box-sizing: border-box;
			.left {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				.goodsName {
					font-size:16px;
					font-family:'Source Han Sans CN';
					font-weight:bold;
					color:rgba(0,0,0,1);
					text-overflow:ellipsis;

				}
				.price-main{
					display: flex;
					justify-content: center;
					align-items: center;
					.month-sell {
						font-size:12px;
						font-family:'Source Han Sans CN';
						line-height:16px;
						color:rgba(154,154,154,1);
						text-align: right;
					}
				}
				.goods-price{
					font-size:22px;
					font-family:Source Han Sans CN;
					font-weight:bold;
					color:rgba(252,108,79,1);
					flex: 1;
				}
				.goods-value{
					font-size:12px;
					font-family:Source Han Sans CN;
					font-weight:400;
					color:rgba(154,154,154,1);
					padding-left: 20px;
					text-decoration: line-through;		
				}
				
				div {
					font-family:'Source Han Sans CN';
					.sell-price {
						font-size:22px;
						font-weight:bold;
						line-height:37px;
						color:rgba(252,108,79,1);
						margin-right: 13px;
					}
					.original-price {
						font-size:12px;
						font-weight:400;
						line-height:20px;
						color:rgba(154,154,154,1);
						text-decoration:line-through;
					}
				}

			}
		}
		.cabomContent {
			width: 100%;
			background-color: #fff;
		}
		// 售价信息
		.price-information{
			width: 100%; 
			background: #fff;
			margin-top: 6px;
			.price-title{
				font-size:16px; 
				font-family:Source Han Sans CN; 
				font-weight:bold; 
				color:rgba(0,0,0,1); 
				padding-top: 15px; 
				margin-left: 16px;
			}
			.information-line{
				height:0px; 
				background:rgba(238,238,238,1); 
				border-bottom:1px solid rgba(225,225,225,1); 
				margin: 13px 16px 0 16px;
			}
			.platform-name{
				display: flex; 
				height: 50px;
			}
			.platform-information{
				height: 50px;
			}
		}
		
	}

</style>
