<template>
	<view class="collectExpend">
		<div class="top-fixed">
			<div class="top-div">
			    <div class="top"></div>
			    <uni-nav-bar class="nav-bar" left-icon="back" left-text="返回" @clickLeft="goBack()" title="钱包" background-color="orange"></uni-nav-bar>
				<!-- 钱包余额 -->
				<div class="residue">
					<div>
						<span class="usable-balance">可用余额</span>
						<button class="put-money" @click="goToExtractMoney()">提现</button>
					</div>
					<span class="surplus-money">￥{{balance}}</span>
				</div>
			</div>
		</div>
		<!-- 收支明细组件 -->
		<div class="collectExpendDetail">
			<collectExpendDetail :collectExpendListData="collectExpendList" />
		</div>
	</view>
</template>

<script>
	// 引入收支明细组件
	import collectExpendDetail from './collectExpendDetail'
	// 引入商家钱包请求接口
	import {accountHistory,inquire} from "../../api/merchantsPurseApi.js"
	export default {
		// 注册组件
		components:{
			collectExpendDetail
		},
		data() {
			return {
				collectExpendList:[],   // 收支明细列表
				balance:'',  // 可用余额
			}
		},
		onLoad(){
			this.initData();
			this.getAccountHistory();
			
			let self = this;
			// 从cashPwd.vue中传递过来的数据刷新
			uni.$on('refreshCollectExpend',function(data){
			    self.initData();
			})
		},	
		methods:{
			initData() {
			    this.getAccountHistory();
				this.getBalance();
			},
			getAccountHistory(){
				let self = this;
				// 请求商户收支明细历史详情
				accountHistory().then(res => {
					self.collectExpendList = res.data
					// 做个判断,如果数据库返回有数据,则执行以下语句
					if(res.data.length != 0){
						self.balance = res.data[0].balance
					}
				})
			},
			// 更新提现后的余额
			getBalance(){
				let self = this;
				inquire().then(res=>{
					self.balance = res.data
				});
			},
			// 返回上一页
			goBack() {
				uni.switchTab({url:'./mine'})
			},
			// 调转到提现页面
			goToExtractMoney() {
				uni.navigateTo({
					url:'./extractMoney'
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #f2f5f7;
	}
	.residue {
		width: 100%;
		background-color: #45D5A2;
		background: url(../../static/mine/wallet-balance.png) no-repeat;
		background-size: cover;
		.usable-balance {
			display: inline-block;
			margin-left: 16px;
			margin-top: 21px;
			font-size:16px;
			line-height:16px;
			color:rgba(255,255,255,1);
		}
		.put-money {
			width: 72px;
			height: 27px;
			background-color: #fff;
			float: right;
			margin-top: 16px;
			margin-right: 16px;
			border-radius: 9px;
			font-size:16px;
			line-height: 27px;
			color:rgba(10,30,44,1);
		}
		.surplus-money {
			font-size:27px;
			line-height:44px;
			color:rgba(255,255,255,1);
			display: inline-block;
			margin-top:  8upx;
			margin-left: 32upx;
		}
	}
	.collectExpendDetail {
		margin-top: 310upx;
		margin-left: 8upx;
		margin-right:  8upx;
	}
</style>
