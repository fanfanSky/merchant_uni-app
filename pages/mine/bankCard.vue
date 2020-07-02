<template>
	<div>
		<!-- 顶部信息效果 -->
		<div class="top-main">
			<div class="top"></div>
			<uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="我的银行卡"></uni-nav-bar>
		</div>
		<div class="main-banck" style="margin-top: 30px;">
			<!-- 无卡效果 -->
			<div class="no-bank" v-if="bankCardsMsg.length == 0">
				您还没有绑定银行卡，请添加新卡
			</div>
			<!-- 有卡效果 -->
			<!-- 银行卡组件 -->
			<bankCardModuld :bankCardList="bankCardsMsg" v-else/>
			<!-- 添加新卡按钮 -->
			<div class="add-bank"  @click="addBank()">
				<div>添加新卡</div>
				<div class="add-icon">+</div>
			</div>
		</div>
	</div>
</template>
<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import bankCardModuld from "./bankCardModuld"   // 银行卡组件
	import {mapState} from 'vuex'
	import {getBankCardsMsg} from "../../api/addBankApi.js"
	export default {
		components:{
			uniNavBar,
			bankCardModuld
		},
		computed: {
			...mapState([
				'storeInfo'
			])
		},
		data() {
			return {
				// showCard:false,    // 是否显示没有银行卡时的效果
				bankCardsMsg:[],   // 银行卡信息列表
				valCode: ''
			}
		},
		onLoad() {
			this.initData()
			// 在addBank页面添加银行卡后，在本页刷新
			let self = this;
			uni.$on('updateBankCard',function(data){
				// 从addBank页面回来之后，重新请求一下银行卡的数据进行刷新
				self.initData()
			})
		},
		methods: {
			initData(){
				this.requestBankCardMsg()
			},
			requestBankCardMsg(){
				let self = this;
				// 传递给子组件bankCardModuld
				getBankCardsMsg(self.storeInfo.name).then(res=>{ 
					self.bankCardsMsg = res.data
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1    // 返回多少个页面
				})
			},
			addBank(){
				uni.navigateTo({
					url: './fillPwd'
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.top-main{
		position: fixed;
		top: 0px;
		z-index: 20;
		// 顶部信息效果
		.top{
			width: 100%;
			line-height: 30px;
			background-color: #FFFFFF;
		}
	}
	// 顶部信息效果
	.main-banck{
		padding: 16px;
		box-sizing: border-box;
		// 无卡效果
		.no-bank{
			height:100px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:400;
			line-height:20px;	
			color:rgba(154,154,154,1);
		}
		// 无卡效果
		// 添加卡的效果
		.add-bank{
			display: flex;
			justify-content: space-between;
			font-size:14px;
			font-family:PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			.bank-type{
				font-size:20px;
				font-family:PingFang SC;
				font-weight:400;
				color:rgba(255,255,255,1);
			}
			.add-icon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 17px;
				height: 17px;
				border-radius: 50%;
				border: 1px solid rgba(144,144,144,1);
				color: rgba(144,144,144,1);
			}
		}
		// 添加新卡效果
	}


	
</style>
