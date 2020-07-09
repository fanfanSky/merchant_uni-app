	<template>
	<view class="changeTradePwd">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="修改交易密码"></uni-nav-bar>
			<div class="bind-phone">绑定手机号码：</div>
			<p class="phoneAndVcode">
				<span class="phone">{{phone}}</span>
				<view class="send-code" @click="getVcode()" v-model="vcode" v-if="$store.state.updatePwdTime <= 0"
				style="color: #00B1FF;">
				获取验证码
				</view>
				<view class="send-code" @click="noGetVcode()" v-if="$store.state.updatePwdTime > 0"
				style="color: #a8a8a8;">
				重新获取验证码({{$store.state.updatePwdTime}}s)
				</view>
			</p>
			<!-- 验证码输入框 -->
			<view>
				<one-input @changeTradePwd="parentInput"></one-input>
			</view>
			<input  
				v-if="showTips" 
				type="password" 
				class="inputNewPwd" 
				@focus="newPwdFocus"  
				placeholder="请输入6位新密码"
			/>
			<input  
				v-else  
				style="font-size: 24px;" 
				maxlength="6" 
				type="password" 
				class="inputNewPwd"   
				@blur="newPwdBlur" 
				@focus="newPwdFocus"  
				v-model="newPwd"
			 />
			<input  
				v-if="showConfirm"  
				type="password" 
				class="inputNewPwd"  
				@focus="confirmpwdFocus" 
				 placeholder="请确认新密码"  
			/>
			<input  
				v-else 
				type="password" 
				maxlength="6" 
				style="font-size: 24px;" 
				class="inputNewPwd"  
				@blur="confirmpwdBlur"  
				@focus="confirmpwdFocus"  
				v-model="rePwd" 
			/>
			<button class="affirmChange" @click="changeNewPwd()">确认修改</button>
		</div>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import oneInput from '@/components/changeTradePwdFrame/changeTradePwdFrame.vue'   // 验证码格式框
	import {mapState} from 'vuex'
	import {getMsmVcode} from "../../api/smsApi.js"
	import {updateTradePwd} from "../../api/authApi.js"
	import {getStorePhone} from '../../api/forgetPwd.js'
	export default {
		computed: {
		    ...mapState([
		        'storeInfo'    // 商家信息
		    ])
		},
		components: {
			uniNavBar,oneInput
		},
		data() {
			return {
				phone:'',   // 绑定的手机号
				vcode:'',
				tipName: '获取验证码',
				// count: 120, //倒计时的秒数
				isCountDown: false, //是否正在倒计时
				timer: -1, // 计时器
				type: 2,   // 绑定手机号：1      修改交易密码：2
				newPwd: '', // 新密码的值
				rePwd: '', // 确认新密码的值
				smsVcode:'',   // 验证码
				showTips:true,  //密码提示显示与否
				showConfirm:true, // 判断是否显示确定密码的提示
			}
		},
		created() {
			getStorePhone(this.storeInfo.name).then(res=>{
				this.phone = res.data  // 取到绑定到的手机号
			})
		},
		methods:{
			//新密码input
			newPwdBlur(){
				let message = '' // 显示错误信息
				if(this.newPwd.trim().length != 6 || this.newPwd.trim().length == 0){
					this.showTips = true
					this.PopShowToastTips('请输入6位数的交易密码!');
					return
				}else{
					this.showTips = false
				}
			},
			//获取焦点的时候
			newPwdFocus(){
				this.showTips = false
				this.newPwd = ''
			},
			//确认密码失去焦点的时候
			confirmpwdBlur(){
				 // 显示错误信息
				if(this.rePwd.trim() !=  this.newPwd.trim()){
					this.PopShowToastTips('两次输入的密码不一致请重新输入!');
					this.showConfirm = true
					this.rePwd = ''
					return
				}else{
					this.showConfirm = false
				}
			},
			//确认密码获取焦点的时候
			confirmpwdFocus(){
				this.showConfirm = false
				this.rePwd = ''
			},	
			// val即是changeTradePwdFrame.vue传过来的  inputValue  值
			parentInput(val){
				this.smsVcode = val;
			},
			// 倒计时未结束给个提示 多少秒再试
			noGetVcode(){
				if(this.$store.state.updatePwdTime > 0) {
					this.PopShowToastTips('请'+`${this.$store.state.updatePwdTime}`+'s后再试');
				}
			},
			// 获取验证码
			getVcode() {
				let title = '';
				if(this.vcode.trim().length == 0) {
					// 倒计时
					// 如果上一次正在倒计时没有结束的话，则直接返回
					if(this.$store.state.updatePwdTime > 0) return
					this.tipName = '重新获取验证码'+'('+`${this.$store.state.updatePwdTime}`+'s'+')'
					this.isCountDown = true  // 开始倒计时
					this.$store.state.updatePwdTime = 60
					let self = this;
					self.timer = setInterval(() => {
						// 在这判断是否小于0,小于0时清除定时器
						if(self.$store.state.updatePwdTime<=0){
							clearInterval(self.timer)
							self.tipName = '获取验证码'
							self.isCountDown = false
							return
						}
						self.$store.state.updatePwdTime--;
						self.tipName = '重新获取验证码'+'('+`${self.$store.state.updatePwdTime}`+'s'+')'
					},1000)
					
					//这里开始请求获取短信验证码
					getMsmVcode(this.phone,this.type).then(res=>{
						this.PopShowToastTips('验证码已发送，请注意查收');
					})
					this.smsVcode = ''   // 验证码框置空
				}
			},
			// 修改交易密码
			changeNewPwd() {
				// 非空校验
				if(this.smsVcode.trim().length == 0){
					this.PopShowToastTips('亲！验证码不能为空！');
				} else if(this.smsVcode.trim().length < 4){
					this.PopShowToastTips('亲！请输入完整的验证码！');
				} else if(this.smsVcode.trim().length == 4){
					if(this.newPwd.trim().length != 6){
						this.PopShowToastTips('请输入6位数的交易密码!');
					}else if(this.rePwd.trim().length != 6){
						this.PopShowToastTips('请输入确认密码');
					} else if(this.newPwd.trim() != this.rePwd.trim()){
						this.PopShowToastTips('两次密码输入不一致');
					} else {
						const reg = /^[\u4e00-\u9fa5]{0,}$/;  // 汉字
						if(reg.test(this.newPwd)){
							this.PopShowToastTips('密码不能为汉字!');
						} else {
							// this.newPwd = this.$md5(this.newPwd)
							updateTradePwd(this.$md5(this.newPwd),this.smsVcode).then(res=>{
								this.$store.state.updatePwdTime = 0; 
								this.PopShowToastTips('修改交易成功!');
								//过1.2秒后返回上一页
								setTimeout(function(){
									uni.navigateBack({
										delta:1
									})
								},1200)
							})
						}
					}
				}
			},
			goBack() {
				uni.navigateBack({
					delta: 1    // 返回多少个页面
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.bind-phone {
		line-height: 60px;
		margin-left: 16px;
		margin-right: 16px;
		font-size:16px;
		color:rgba(102,102,102,1);
	}
	.phoneAndVcode {
		margin-left: 16px;
		margin-right: 16px;
		.phone {
			font-size:18px;
			font-weight:500;
			line-height:20px;
			color:rgba(10,30,44,1);
		}
		.send-code {
			float: right;
			font-size:16px;
			line-height:20px;
			color:rgba(0,177,255,1);
		}
	}
	.accept {
		height: 45px;
		display: flex;
		justify-content: space-between;
		margin: auto;
		margin-left: 37px;
		margin-right: 37px;
		div {
			float: left;
			width: 45px;
			border-bottom: 2px solid #D1D1D1;
			text-align: center;
			line-height: 45px;
		}
	}
	.inputNewPwd {
		height:35px;
		background:rgba(245,248,247,1);
		border-radius:10px;
		margin: 0px 50px;
		text-align: center;
		font-size:14px;	

		line-height:18px;
		color:rgba(154,154,154,1);
		margin-top: 30px;
	}
	.affirmChange {
		margin: 45px 36px 0px 36px;
		height: 40px;
		line-height: 40px;
		background:#ffa801;
		border-radius:10px;
		font-size:19px;
		font-family:'PingFang SC';
		font-weight:bold;
		color:rgba(255,255,255,1);
		z-index:0;
	}
	.tradePwdHint {
		width: 100%;
		font-size: 14px;
		color: red;
		text-align: center;
	}
</style>
