<template>
	<div class="home">
		<div class="home-top">
			<div class="top" ></div>
			<!-- 顶部导航栏 开始-->
			<uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="新增商品" ></uni-nav-bar>
		</div>
		<!-- 主体部分开始 -->
		<div class="main">
			<!-- 套餐类型开始 -->
			<view class="new-produce">
				<!-- 完成 -->
				<div class="flex-between">
					<div class="title-style" >商品类型</div>
					<div class="flex-l">
						<radio-group @change="typeChange" class="radio-type">
							<radio value="2" :checked="goodInfo.goodsType == 2" color="#ffa801" />
							<div class="radio-title">
								团购套餐
							</div>
							<radio value="1" :checked="goodInfo.goodsType == 1" style="margin-left: 15px;" color="#ffa801" />
							<div class="radio-title">
								代金券
							</div>
						</radio-group>
					</div>
				</div>
				<!-- 代金券时显示-->
			</view>
				<!-- 套餐组件 显示哪个组件是根据type来决定的-->
			<valueMeals v-if="goodInfo.goodsType == 2" 
				:templatesList="templatesList"
				:selectedIndex="selectedIndex"
				:goodsType="goodInfo.goodsType"
			/>
			<!-- 代金券组件 -->
			<cashCoupon v-else :selectedIndex="selectedIndex"/>
		</div>
		<!-- 主体部分结束 -->
	</div>
</template>
<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import cashCoupon from "./cashCoupon.vue"
	import valueMeals from "./valueMeals.vue"
	import {mapState} from 'vuex'
	export default {
			computed: {
			    ...mapState([
			        'storeInfo'    // 商家信息
			    ])
			},
			components: {
				 uniNavBar,cashCoupon,valueMeals
			},
			data() {
				return {
					// 已选择模板列表下标
					selectedIndex:'',
					//接收后端返回来的模板列表的数组
					templatesList: [],
					// 1.新增商品，2.编辑商品
					routeID:'1',
					goodInfo: {
						storeId:'',	  // 商家ID
						goodsType: 2,	 // 1.代金券 2.套餐
					},
				};
			},
			onLoad(defaultOptions) {
				this.selectedIndex = defaultOptions.selectedIndex;
				// 根据返回的type类型确定显示Radio的位置：1.代金券，2.套餐
				if (!isNaN(defaultOptions.goodsType) && defaultOptions.goodsType != '') {
					this.goodInfo.goodsType = defaultOptions.goodsType;
				} else {
					this.goodInfo.goodsType = 2;
					this.goodInfo.storeId = this.storeInfo.id;
				}
			},
			methods: {
				typeChange(evt) {
				   this.goodInfo.goodsType = evt.detail.value;
				},

				goBack() {
					uni.showModal({
						title:'离开此页面?',
						content:'商品未保存，可能不会保存您所做的更改。',
						confirmText:'离开',
						success: function (res) {
							if (res.confirm) {
								uni.switchTab({
									url:'./home'
								})
							}
						}
					})
				},

		   },
		}
	</script>

<style lang="less" scoped>
	// !-- 主体部分开始 -->
	.home{
		.home-top{
			width: 100%;
			position: fixed;
			top: 0px;
			background-color: #fff;
			z-index: 9;
			.top{
				height: 30px;
				width: 100%;
			}
		}
	}
	.main{
		width: 100%;
		background:rgba(242,245,247,1);
		padding:4px 8px;
		box-sizing: border-box;
		margin-top: 75px;
		margin-bottom: 50px;
		.new-produce{
			padding:0px 9px 10px 10px;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius:10px;
			.flex-between{
				line-height: 30px;
				display: flex;
				flex-direction: space-between;
				.flex {
					display: flex;
					justify-content: space-between;
				}
				.title-style{
					width: 80px;
					line-height: 30px;
					font-size: 14px;
				}
				.flex-l{
					flex: 1;
					height:30px;
					margin-left: 10px;
					background:rgba(255,255,255,1);
					border-radius:5px;
					border: none;
					background:rgba(255,255,255,1);
					border:1px solid rgba(221,221,221,1);
					border: 0;
					.radio-type{
						display: flex; 
						align-items: center;
						.radio-title{
							font-size: 0.75rem;
						}
					}
				}
				.voucherSub {
					width: 30px; 
					line-height: 30px;
					background-color: #ddd; 
					text-align: center;
					border-radius:4px 0px 0px 4px;
				}
				.voucherAdd {
					width: 30px; 
					line-height: 30px;
					background-color: #ddd; 
					text-align: center;
					border-radius:0px 4px 4px 0px;
				}
				.store-1,.store-2 {
					width: 30px;
					height: 30px; 
					background-color: #ddd; 
					text-align: center; 
					border-radius:4px 0px 0px 4px;
				}
			}

			.flex{
				display: flex;
				font-size: 14px;
				.flex-btn{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border:1px solid #ccc;
					border-radius: 5px;

				}
			}
		}
		// <!-- 套餐类型开始 -->
		.package-type{
			padding: 10px 9px;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			.type{
				height: 30px;
				width: 80px;
				text-align: left;
				line-height: 30px;
				font-size:14px;
				color:rgba(51,51,51,1);
				span:first-child{
					padding-right: 6px;
					color:rgba(255,62,62,1);
				}
			}
			.package-name{
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				flex: 1;
				width: 100%;
				margin-left: 10px;
				border: none;
			}
		}
		// <!-- 套餐类型结束 -->
	}

</style>
