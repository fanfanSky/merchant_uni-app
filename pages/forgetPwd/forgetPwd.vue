<template>
	<!-- 忘记密码页 -->
	<view class="forgetPwd">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="修改密码"></uni-nav-bar>
			<view class="changeContent">
				<!-- 账号、手机号 -->
				<view class="acountAndphone">
					<!-- 账号 -->
					<div>
						<div class="acount">
							<input type="text"  @blur="getUserPhone" v-model="acount" placeholder="请输入您的账号">
						</div>
					</div>
					<div>
						<div class="phone">
							<input type="text" :disabled="true" v-model="phone" placeholder="请输入您的手机号">
							<view class="send-code">
								<span class="sendVcode" @click="sendPhoneCode()" v-if="$store.state.updatePwdTime <= 0" style="color: #00B1FF;">发送验证码</span>
								<span class="sendVcode" @click="noGetVcode()" v-if="$store.state.updatePwdTime > 0" style="color: #a8a8a8;">重新获取({{$store.state.updatePwdTime}}s)</span>
							</view>
						</div>
					</div>
					<!-- 验证码输入框 -->
					<view>
						<one-input @forgetPwd="parentInput"></one-input>
					</view>
				</view>
				
				<!-- 修改新密码 -->
				<view class="changeNewPwd">
					<!-- <p class="newPwd-text">请输入新密码:</p> -->
					<div>
						<div class="inputNewPwd">
							<input   autocomplete="new-password" v-if="showPwd" @focus="pwdonFocus" type="password" @blur="pwdonBlur" placeholder="请输入6-18位新密码" />
							<input style="font-size: 24px;"  autocomplete="new-password" v-else type="password" @focus="pwdFocus"  @blur="pwdonBlur" v-model="password"  />
						</div>
					</div>
					<p class="pwdHintText" v-show="isShowPwdHint">*请输入6-18位新密码哦</p>
					<div>
						<div class="inputNewPwd">
							<input   autocomplete="new-password" v-if="showReNewPwd" @focus="repwdonFocus" type="password" @blur="repwdonBlur" placeholder="请确认新密码" />
							<input style="font-size: 24px;"  autocomplete="new-password" v-else type="password" @focus="repwdFocus"  @blur="repwdonBlur" v-model="rePassword"  />
						</div>
					</div>
				</view>
				<button class="affirmChange" @click="affirmChange">确定修改</button>
			</view>
			
		</div>
	</view>
</template>

<script>
import oneInput from '@/components/forgetPwdCodeFrame/forgetPwdCodeFrame.vue'   // 验证码格式框
import {mapState} from 'vuex'
import {getStorePhone,getForgetPwdCode,affirmNewPwd} from '../../api/forgetPwd.js'
import {getStoreInfo} from '../../api/authApi.js'

export default {
	computed: {
	    ...mapState([
	        'storeInfo'    // 商家信息
	    ])
	},
	components:{
		oneInput
	},
	data() {
		return {
			acount:'',
			phone:'',
			password:'',
			rePassword:'',
			code: '',
			vcode:'',
			tipName: '获取验证码',
			// count: 120, //倒计时的秒数
			isCountDown: false, //是否正在倒计时
			timer: -1, // 计时器
			isShowPwdHint: false,   // 是否显示密码提示
			verificationCode:'',   // 忘记密码输入的验证码
			showPwd:true,  //控制是否密码输入的大小
			showReNewPwd:true,   //开始让
			showAcount:true,     //控制账号输入的大小
		}
	},
	methods:{
		//当忘记密码的时候失去焦点的时候(判断密码框是否有值）
		//有值（将值保留）
		//无值（给出提示）
		pwdonBlur(){
			//当输入密码的框失去焦点的时候判断输入密码的位数
			if(this.password.trim().length<6 || this.password.trim().length >18){
				//如果密码位数不够，则给出相应的提示
					this.showPwd = true
					this.PopShowToastTips('请输入6-18位数的密码!');
					this.password = ''
			}else{
				//否则的话提示关掉
				this.showPwd = false
			}
		},
		//获取焦点的时候
		pwdonFocus(){
			this.showPwd = false
			this.password = ''
		},
		//确认密码框的失去焦点事件，判断位数
		repwdonBlur(){
			if(this.rePassword.trim().length<6 || this.rePassword.trim().length >18){
					this.showReNewPwd = true
					this.PopShowToastTips('两次密码不一致请重新输入');
			}else{
				this.showReNewPwd = false
			}
		},
		//获取焦点的时候
		repwdonFocus(){
			this.showReNewPwd = false
			this.rePassword = ''
		},
		// forgetPwdCodeFrame.vue传过来的数据
		parentInput(res){
			this.verificationCode = res
		},
		// 新密码聚焦
		pwdFocus(){
			this.isShowPwdHint = false
			this.password = ''
			this.showPwd = false
		},
		//确认密码聚焦
		repwdFocus(){
			this.isShowPwdHint = false
			this.rePassword = ''
			this.showReNewPwd = false	
		},
		goBack(){
			uni.navigateBack({
				delta:1
			})
		},
		// 倒计时未结束给个提示 多少秒再试
		noGetVcode(){
			
			if(this.$store.state.updatePwdTime > 0) {
				uni.showToast({
					title: '请'+`${this.$store.state.updatePwdTime}`+'s后再试',
					icon: 'none',
					duration: 2000
				})
			}
		},
		// 失焦获取店主手机号
		getUserPhone(){
			if(this.acount.trim().length == 0){
				this.PopShowToastTips('账号不能为空哦');
			} else {
				getStorePhone(this.acount).then(res=>{
					this.phone = res.data
				})
			}
		},
		// 获取验证码
		sendPhoneCode(){
			this.verificationCode = ''   // 每次发送验证码时都会清空验证码内容
			let message = '' // 显示错误信息
			if(this.acount.trim().length == 0){
				this.PopShowToastTips('请输入您的账号');
				return
			} else if(this.verificationCode.length > 0 && this.verificationCode.length < 4){
				this.PopShowToastTips('您输入的验证码不正确');
				return
			}
			
			// 倒计时
			// 如果上一次正在倒计时没有结束的话，则直接返回
			if(this.$store.state.updatePwdTime > 0) return
			this.tipName = '重新获取'+'('+`${this.$store.state.updatePwdTime}`+'s'+')'
			this.isCountDown = true  // 开始倒计时
			this.$store.state.updatePwdTime = 60
			var self = this;
			this.timer = setInterval(() => {
				// 在这判断是否小于0,小于0时清除定时器
				if(self.$store.state.updatePwdTime<=0){
					clearInterval(self.timer)
					self.tipName = '获取验证码'
					self.isCountDown = false
					return
				}
				self.$store.state.updatePwdTime--;
				self.tipName = '重新获取'+'('+`${self.$store.state.updatePwdTime}`+'s'+')'
			},1000)
			
			//这里开始请求获取忘记密码的短信验证码
			getForgetPwdCode(this.phone).then(res=>{})
			uni.showToast({
				title: '验证码已发送，请注意查收',
				icon: 'none',
				duration: 2000,
				position: 'bottom'
			})
		},
		
		// 确认修改密码
		affirmChange(){
			let title = '';
			let self = this;
			if(this.acount.trim().length == 0){
				this.PopShowToastTips('请输入您的账号');
				return 
			}else if(this.verificationCode.trim().length == 0 ){
				this.PopShowToastTips('请输入您的验证码');
				return 
			}
			else if( this.password.trim().length == 0 || this.password.trim().length<6 || this.password.trim().length>18){
				this.PopShowToastTips('请先输入6-16位数新密码');
				return 
			} 
			else if(this.rePassword.trim().length == 0) {
				this.PopShowToastTips('请确认您的密码');
				return 
			} else if(this.password.trim() != this.rePassword.trim()) {
				this.PopShowToastTips('两次输入的密码不一致');
				return 
			} else {
				this.password = this.$md5(this.password)
				this.rePassword = this.$md5(this.rePassword)
				let self = this;
				affirmNewPwd(this.acount,this.password,this.verificationCode,this.phone).then(res=>{
					uni.showModal({
						title:'温馨提示',
						content:'修改成功,请返回登录页登录吧!',
						success: res => {
							console.log("打印res的值看看",res)
							if (res.confirm) {
								uni.navigateBack({
									delta:1
								})
							} else if (res.cancel) {
								return
							}
						}
					})
				})
			}
		}
	}
	
}
</script>

<style lang="less" scoped>
	.changeContent {
		margin-top: 40px;
		.acountAndphone {
			margin-bottom: 19px;
			div {
				width: 100%;
				display: flex;
				justify-content: center;
				margin-bottom: 10px;
				line-height: 46px;
				.acount, .phone {
					width: 324px;
					height: 100%;
					border-bottom: 1px solid #FFE8BD;
					display: flex;
					align-items: center;
					input {
						width: 60%;
						height: 100%;
						text-align: center;
						line-height:18px;
						color: #000000;
						font-size: 14px;
					}
				}
				.phone {
					position: relative;
					.send-code {
						height: 25px;
						position: absolute;
						right: 0;
						.sendVcode {
							float: right;
							font-size:14px;
							line-height:25px;
							color:rgba(0,177,255,1);
							margin-right: 0;
						}
					}
				}
			}
		}
		.changeNewPwd {
			.pwdHintText{
				width: 100%;
				font-size:12px;
				color:red;
				text-align: center;
			}
			div {
				width: 100%;
				height: 46px;
				display: flex;
				justify-content: center;
				margin-bottom: 10px;
				line-height: 46px;
				.inputNewPwd {
					width: 324px;
					height: 100%;
					border-bottom: 1px solid #FFE8BD;
					display: flex;
					align-items: center;
					text-align: center;
					input{
						font-size: 14px;
					}
				}
				.inputReNewPwd {
					width: 324px;
					height: 100%;
					border-bottom: 1px solid #FFE8BD;
					display: flex;
					align-items: center;
					text-align: center;
					input{
						font-size: 14px;
					}
				}
			}
		}
		.affirmChange {
			width: 324px;
			background:rgba(255,168,1,1);
			border:1px solid rgba(255,168,1,1);
			border-radius:10px;
			margin-top: 78px;
			font-size:19px;
			font-family:PingFang SC;
			font-weight:bold;
			line-height:40px;
			color:rgba(255,255,255,1);
		}
		.tips {
			text-align: center;
			margin-top: 10px;
			color: #ff0000;
		}
	}
	
</style>
