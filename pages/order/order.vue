<template>
	<view class="order home">
		<div style="position: fixed;top: 0px;z-index: 888;left: 0px;height: 60px;">
			<uni-nav-bar title="我的订单" @clickLeft="goBack()" ></uni-nav-bar>
			<div class="order-tab" >
				<span :class="idx==index?'hover':''" @click="son(item,idx)" v-for="(item,idx) in tabbarMenu" :key="idx">
					{{item}}
				</span>
			</div>
		</div>
		<div class="order-main"  :class="{'scroll-view-mb': !loading}">
			<scroll-view class="order-scroll"  v-if="index == 1" @scrolltolower="loadList" scroll-y="true">
			<div class="order-content" v-if="index != 0">
				<div v-for="item in orderList" @click="goToorderDetail(item,index)">
					<rownumber :numberStatus="index" :info="item" />
				</div>
				<div class="order-bottom"></div>
			</div>
			</scroll-view>
			<div class="order-list" v-if="index == 0">
				<div v-for="item in xOrderList"  @click="goToGoodsDetail(item)" >
					<rownumber :numberStatus="index" :info="item"  />
				</div>
				<div class="order-listbottom"></div>
			</div>
		</div>
		
		<div  class="flex-center loader" v-if="loading">
			正在加载更多数据...
		</div>
	</view>
</template>

<script>
	import rownumber from './rowNumber'
	import { getStoreOrder,getClientOrder,rejectPre } from '../../api/orderApi.js'
	import {mapState} from 'vuex'
	import store from "../../store";

	export default {
		components:{
			rownumber
		},
		computed: {
		    ...mapState([
		        'storeInfo', 'xOrderList'
		    ])
		},
		data() {
			return {
				tabbarMenu:['预约中','已进账'],
				index: 0,
				statusArr: [2,3],
				orderList: [],
				lastId: null,
				loading: false,
				allOver: false
			}
		},
		onLoad() {
			this.initData();
		},
		methods: {
			initData() {
				this.loadList();
			},
			//默认排号
			son(item,idx){
			    this.index = idx;
				console.log(item,idx)
			},
			//预约详情页面的跳转
			goToGoodsDetail(item){
				console.log("res===>",item.id)
				uni.navigateTo({
					url:'./detailsAppointment?id='+ item.id
				})
			},
			//已进账详情页面的跳转
			goToorderDetail(item){
				console.log("item======",item)
				const res = JSON.stringify(item)
				uni.navigateTo({
					url:'./orderDetails?item='+ res
				})
			},
			//返回上一级目录
			goBack() {
				uni.navigateBack({
					delta:1
				})
			},
			loadList() {
				if (this.loading)
					return;
				if (this.allOver)
					return;
				console.log('loadList',this.index);
				var self = this;
				if (this.index == 0) {
					// this.orderList = this.xOrderList;
					getStoreOrder(this.storeInfo.id, 2).then(res => {
						let oldId = self.$store.state.xOrderList.length > 0 ? parseInt(self.$store.state.xOrderList[0].sort_id) : 0;
						let newId = res.data.length > 0 ? parseInt(res.data[0].sort_id) : 0;
						self.$store.state.xOrderList = res.data;
					}).catch((err) => {
						console.error('loadOrder error');
						console.error(err);
					});
				} else {
					this.loading = true;
					if (this.lastId == null)
						getStoreOrder(this.storeInfo.id, this.statusArr[this.index]).then(res => {
							self.orderList = self.orderList.concat(res.data);
							if (self.orderList.length > 0)
								self.lastId = self.orderList[self.orderList.length - 1].sort_id;
							if (res.data.length == 0)
								self.allOver = true;
						}).finally(() => {
							self.loading = false;
						});
					else
						getStoreOrder(this.storeInfo.id, this.statusArr[this.index], this.lastId).then(res => {
							self.orderList = self.orderList.concat(res.data);
							if (self.orderList.length > 0)
								self.lastId = self.orderList[self.orderList.length - 1].sort_id;
							if (res.data.length == 0)
								self.allOver = true;
						}).finally(() => {
							self.loading = false;
						});
				}
			}
		},
		watch: {
			index: function (val) {
				this.allOver = false;
				this.loading = false;
				this.lastId = null;
				this.orderList = [];
				this.loadList();

			}
		}
	}
</script>

<style lang="less" scoped>
	.pages-order-order{
		background:rgba(242,245,247,1);
	}
	.loader{
		margin-bottom: 90px;
		height: 45px;
	}
	.order{
		display: flex;
		flex-flow: column;  
		background:rgba(242,245,247,1);
		width: 100%;
	}
	.order-main{
		flex: 1; 
		margin-top: 90px;
		.order-scroll{
			height: 100%;
			.order-content{
				height: 100%;
				 overflow-y: scroll;
				 .order-bottom{
					width: 100%; 
					height: 50px;
				 }
			}
			.order-list{
				overflow-y: scroll;
				.order-listbottom{
					width: 100%; 
					height: 30px;
				}
			}
		}
	}
	.order-tab {
		width: 100%;
		height: 44px;
		background-color: #fff;
		span {
			font-size:14px;
			line-height:16px;
			color:rgba(154,154,154,1);
			padding: 0 5px 17px 0px ;
			display: inline-block;
			margin-left: 10px;	
		}	
		
		span:first-child.hover,span:nth-child(2).hover,span:last-child.hover{
			font-size:18px;
			line-height:16px;
			color:rgba(10,30,44,1);
			border-bottom: 5px solid rgba(255,168,1,1);
			margin-left: 10px;
		}
	}
</style>
