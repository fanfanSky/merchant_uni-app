<template>
	<view class="fillPwd">
		<div class="top-div">
		    <div class="top"></div>
			<div class="back" @click="back()">
				<image src="../../static/mine/back.png" mode=""></image>
			</div>
			<div class="main">
				<p class="addBankText">添加银行卡</p>
				<p class="payPwdText">请输入支付密码，以验证身份</p>
				<!-- 密码输入框 -->
				<div class="payPwdFrame">
					<one-input @fillPwd="parentInput"></one-input>
				</div>
				
			</div>
		</div>
	</view>
</template>

<script>
	import oneInput from '@/components/addBankVerifyFrame/addBankVerifyFrame.vue'   // 验证码格式框
	import {mapState} from 'vuex'
	import { getTradePwd } from "../../api/addBankApi.js"
	export default{
		components: {
			oneInput
		},
		computed: {
			...mapState([
				'storeInfo'
			])
		},
		data() {
		    return {
				Password:''
			}
		},
		methods:{
			// val即是fillPwdFrame.vue传过来的 inputValue  值
			parentInput(val){
				this.Password = val;
				this.Password = this.$md5(this.Password)
				var self = this;
				console.log("添加银行卡加密密码===>",this.Password)
				// 携带 用户名+输入的交易密码的值请求后台
				getTradePwd(self.storeInfo.name,this.Password).then(res=>{
					console.log("加密后的密码",self.$md5(this.Password))
					// 输入正确的提现交易密码后去到添加银行卡页面
					uni.navigateTo({url:'./addBank'})
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
		
	}
</script>

<style lang="less" scoped>
	.fillPwd {
		.back {
			width: 16px;
			height: 16px;
			margin-left: 10px;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.main {
			width: 100%;
			height: 300px;
			margin-top: 70px;
			.addBankText {
				text-align: center;
				font-size:18px;
				font-family:PingFang SC;
				font-weight:500;
				margin-bottom: 20px;
			}
			.payPwdText {
				text-align: center;
				font-size:16px;
				font-family:PingFang SC;
				font-weight:400;
				margin-bottom: 70px;
			}
			.payPwdFrame {
				position: relative;
				float: left;
				width: 100%;
				height: 65upx;
				left: 50%;
				margin-left: -50%;
				display: flex;
				justify-content: center;
			}
		}	
	}
</style>
