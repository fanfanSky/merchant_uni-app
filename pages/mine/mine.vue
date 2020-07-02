<template>
	<div class="mine home">
	        <div class="top-style">
	        </div>
			<div class="userName-div">
					<span class="userName">{{storeInfo.name}}</span>
				</div>
				<div class="wallet" @click="goToCollectExpend()">
					<div class="examineDetailFrame">
						<p class="examineText">点击查看详情</p>
					</div>
					<p class="balance">
						<span class="balance-text">余额</span>
						<span class="sum">￥{{$store.state.balance}}</span>
					</p>
				</div>
				<div class="mineList" style="background-color: #f2f5f7;">
					<!-- 我的银行卡 -->
					<div class="changePassword">
						<div class="interior pwd" @click="goTobankCar()" >
							<span class="change-pwd" >我的银行卡</span>
							<span class="go">
								<cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image>
							</span>
						</div>
					</div>
					<!-- 密码修改 -->
					<div class="changePassword">
						<div class="interior" @click="goToChangePwd()">
							<span class="change-pwd">修改登录密码</span>
							<span class="go">
								<cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image>
							</span>
						</div>
					</div>
					<!-- 交易密码修改 -->
					<div class="changePassword">
						<div class="interior" @click="goToChangeTradePwd()">
							<span class="change-pwd">修改交易密码</span>
							<span class="go"><cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image></span>
						</div>
					</div>
					<div class="changePassword">
						<div class="interior" @click="goToChangeMsg()">
							<span class="change-msg">信息修改</span>
							<span class="go"><cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image></span>
						</div>
					</div>
					<div class="changePassword">
						<div class="interior" @click="goToFeedback()">
							<span class="change-opinion">意见反馈</span>
							<span class="go"><cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image></span>
						</div>
					</div>
					<div class="changePassword">
						<div class="interior" @click="confirmLogout">
							<span class="exit-login">退出登录</span>
							<span class="go">
								 <cover-image class="controls-play img" @click="play" src="/static/mine/go.png"></cover-image>
							</span>
						</div>
					</div>
				</div>
		</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {logout} from '../../util/auth'
	import {inquire} from "../../api/merchantsPurseApi.js"
	export default {
		computed: {
		    ...mapState([
		        'storeInfo', 'balance'
		    ])
		},
		data() {
			return {

			}
		},
		onShow() {
			var self = this;
			inquire().then(res=>{
				self.$store.state.balance = res.data;
			});
		},
		onLoad() {
			var self = this;
			inquire().then(res=>{
				self.$store.state.balance = res.data
			});
			uni.$on('updateBalance',(balance)=>{
				inquire().then(res=>{
					self.$store.state.balance = res.data
				});
			});
		},
		methods: {
			goTobankCar(){
				uni.navigateTo({
					url: './bankCard'
				})
			},

			goToChangePwd() {
				uni.navigateTo({
					url: './changePwd'
				})
			},
			
			goToChangeTradePwd() {
				uni.navigateTo({
					url: './changeTradePwd'
				})
			},
			goToFeedback() {
				uni.navigateTo({
					url:'./feedback'
				})
			},
			goToChangeMsg() {
				uni.navigateTo({
					url:'./changeCommercialMsg'
				})
			},
			goToCollectExpend(){
				uni.navigateTo({
					url:'./collectExpend'
				})
			},
			// 登出商家端
			confirmLogout() {
				uni.showModal({
					title: '提示',
					content: '是否确认退出登陆',
					success: function (res) {
						if (res.confirm) {
							logout();
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.top-style{
		position: fixed;
		height: 30px;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 99999;
	}
	.userName-div {
		width: 100%;
		height: 88px;
		background:rgba(255,168,1,1);
		margin-top: 30px;
		.userName {
			margin-left: 16px;
			display: inline-block;
			margin-top: 15px;
			font-size:16px;
			font-family: 'Source Han Sans CN';
			font-weight:bold;
			line-height:18px;
			color:rgba(255,255,255,1);

		}
	}
	.wallet {
		width: 90%;
		height:98px;
		background:rgba(253,204,194,1);
		border-radius:8px;
		position: absolute;
		left: 0; 
		right: 0; 
		margin-left: auto; 
		margin-right: auto; 
		top: 78px;
		background: url(../../static/mine/wallet.png) no-repeat;
		background-size: cover;
		.examineDetailFrame {
			width: 110px;
			height: 20px;
			float: right;
			display: flex;
			justify-content: center;
			// background-color: pink;
			padding-top: 75px;
			// 点击查看详情样式
			.examineText {
				font-size: 12px;
				color:#999999;
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			}
		}
		.balance {
			.balance-text {
				font-size:16px;
				font-family: 'Source Han Sans CN';
				font-weight:400;
				line-height:16px;
				color:rgba(102,102,102,1);
				margin-left: 6px;
				margin-top: 17px;
				display: inline-block;
				margin-right: 10px;
				padding-left: 15px;
			}
			.sum {
				font-size:27px;
				font-family: 'Source Han Sans CN';
				font-weight:400;
				line-height:44px;
				color:rgba(252,108,79,1);
			}
		}
	}
	.mineList {
		// height: 500px;
		// margin-top: 62px;
		padding-top: 62px;
		.changePassword {
			height:50px;
			background:rgba(255,255,255,1);
			.interior {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 91.5%;
				margin: auto;
				border-top: 1px solid rgba(225,225,225,1);   // 上面修改密码的横线
				line-height: 50px;
				.change-pwd, .change-msg, .change-opinion, .exit-login {
					font-size:14px;
					font-family: 'Source Han Sans CN';
					line-height:50px;
					color:rgba(10,30,44,1);
				}
				.go {
					width:8px;
					height:18px;
					float: right;
					margin-right: 6px;
					color:rgba(144,144,144,1);
				}
			}
			.pwd {
				border: none;
			}
		}
	}
</style>
