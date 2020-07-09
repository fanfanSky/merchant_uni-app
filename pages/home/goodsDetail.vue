<template>
	<view class="goodsDetail home" >
		<div class="top-div" >
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回"  color="#000000" title="商品详情" @clickLeft="goBack()"></uni-nav-bar>
		</div>
		<div style="overflow-y: scroll; flex: 1; margin-top: 74px;">
			<div class="top-Detail">
				<div class="goodsPic">
					<div class="centerPic">
						<div style="width: 100%; overflow: hidden; height: 100%;">
							<swiper :indicator-dots="true" indicator-active-color="#00ffff" easing-function="easeInOutCubic" :autoplay="true" :circular="true" :interval="3000" :duration="1000">
								<swiper-item v-for="(item,index) in gInfoUp.imgUrlList" :key="index" @click="picBanner(index)">
									<img lazy-load mode="scaleToFill" :src="item" width="100%" />
								</swiper-item>
							</swiper>
						</div>
					</div>
				</div>
				<div class="goods">
					<div class="left">
						<div class="goodsName">{{gInfoUp.name}}</div>
						<div>
							<span class="goods-price">¥{{gInfoUp.price | foodCardFilter}}</span>
							<span class="goods-value">¥{{gInfoUp.value | foodCardFilter}}</span>
						</div>
						<div class="month-sell">
							<span>月售{{gInfoUp.monSoldNum }}</span>
							<span style="margin-left: 20px;">
								<span class="mon-l" v-if="gInfoUp.buyTimeLimit != ''">库存：{{gInfoUp.buyTimeLimit}}</span>
								<span  class="mon-l" v-else>不限购</span>
							</span>
						</div>
					</div>

					<div class="right">
						<div class="rightEdit" @click="updateFood">
							<span>编辑</span>
						</div>
						<div class="rightDowload" @click="deleteFood">
							<span>下架</span>
						</div>
					</div>
				</div>
				<div class="cabomContent">
					<v-cobomcontent :foods="foods" />
				</div>

				<div style="width: 100%; background: #fff; margin-top: 6px;">
					<div style="font-size:16px; font-family:Source Han Sans CN; font-weight:bold; color:rgba(0,0,0,1); padding-top: 15px; margin-left: 16px;">
						售价信息
					</div>
					<div style="height:0px; background:rgba(238,238,238,1); border-bottom:1px solid rgba(225,225,225,1); margin: 13px 16px 0 16px;"></div>
					<div style="display: flex; height: 50px;">
						<div style="flex: 1;" class="platform-title flex-center">
							平台名称
						</div>
						<div style="flex: 1;" class="platform-title flex-center">
							商家让利
						</div>
						<div style="flex: 1;" class="platform-title flex-center">
							售价
						</div>
					</div>
					<div style="height: 50px;" class="flex-center" v-for="item in couponPlatforms" >
						<div style="flex: 1;height: 100%;" class="flex-center platform-item">
							{{ item.platformName }}
						</div>
						<div style="flex: 1;height: 100%;" class="flex-center platform-item">
							￥{{ item.storeSubsidy | foodCardFilter}}
						</div>
						<div style="flex: 1;height: 100%; color:rgba(252,108,79,1);" class="flex-center platform-item">
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
	import cobomcontent from './cobomcontent'
	import useExplain from './useExplain'
	import {mapState} from 'vuex'
	import {logout} from "../../util/auth";
	import {deleteGood} from "../../api/goodsApi";

	export default {
		components:{
			"v-cobomcontent": cobomcontent,
			"v-explain": useExplain
		},
		computed: {
			...mapState([
				'gInfoUp'
			])
		},
		data() {
			return {
				couponPlatforms:[],
				foods:[],
				bannerlist: [],   // 轮播图列表
			}
		},
		onLoad(options) {
			console.log("options",options.item)
			// 取得平台信息
			this.couponPlatforms = this.gInfoUp.couponPlatforms;
			this.foods = JSON.parse(this.gInfoUp.foodsJson)
			//订单中预约传过来的值
			console.log("vuex==>",this.gInfoUp)
			
		},
		methods:{
			//实现轮播图方法
			picBanner(index){
				console.log(index)
		        for(var i = 0; i < this.gInfoUp.imgUrlList.length; i++) {
		          this.bannerlist[i] = this.gInfoUp.imgUrlList[i];
		        }
				// 图片预览
				uni.previewImage({
					urls:this.bannerlist,
					current: index,     // 当前索引图片的链接
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							
						},
						fail: function(err) {
							console.log("图片预览错误:",err.errMsg);
						}
					}
				})
			},
			// 返回上一页
			goBack(){ uni.navigateBack({ delta:1 }) },
			//编辑商品
			updateFood(){
				uni.navigateTo({
					url: './updateNewProducts'
				})
			},
			//下架商品
			deleteFood() {
				var self = this;
				uni.showModal({
					title: '提示',
					content: '下架后不可恢复，是否确认下架商品？',
					success: function (res) {
						if (res.confirm) {
							deleteGood(self.gInfoUp.id).then(res => {
							console.log('商品的id',self.gInfoUp.id)
								// 删除成功后同时刷新首页
								self.PopShowToastTips('商品已下架');
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/home/home'
									})
								},1000)
							});
						}
					}
				});
			},
			
		}
	}
</script>

<style lang="less" scoped>
	page{
		background-color: #f2f5f7;
	}
	.goodsDetail{
		background:rgba(242,245,247,1);
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
			padding: 0px 10px;
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
				.month-sell {
					font-size:12px;
					font-family:'Source Han Sans CN';
					font-weight:400;
					line-height:16px;
					color:rgba(154,154,154,1);
					margin-top: 4px;
				}
			}
			.right {
				display: flex;
				justify-content: space-around;
				justify-content: center;
				width: 80px;
				height: 100%;
				line-height: 100px;
				margin-right: 15px;
				font-family:'Source Han Sans CN';
				font-weight:400;
				color:rgba(255,43,0,1);
				font-size: 14px;
				.rightEdit, .rightDowload {
					width: 40px;
					height: 100%;
				}
			}
		}
		.cabomContent {
			width: 100%;
			background-color: #fff;
		}
	}

</style>
