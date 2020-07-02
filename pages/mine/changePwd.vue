<template>
	<view class="changePwd">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="修改登录密码"></uni-nav-bar>
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
				<one-input @changePwd="parenInput"></one-input>
			</view>
			<input v-if="showTips" type="password" class="inputNewPwd" @focus="repwdonFocus" @blur="repwdonBlur" placeholder="请输入6-18位新密码"/>
			<input  v-else  style="font-size: 24px;" type="password" class="inputNewPwd"   @blur="repwdonBlur" @focus="repwdonFocus"  v-model="newPwdValue" />
			<input v-if="showConfirm"  type="password" class="inputNewPwd"  @focus="confirmpwdFocus" @blur="confirmpwdBlur" placeholder="请确认新密码"  />
			<input v-else type="password" style="font-size: 24px;" class="inputNewPwd" @focus="confirmpwdFocus"  @blur="confirmpwdBlur"   v-model="rePwdValue" />
			<button class="affirmChange" @click="changeNewPwd()">确认修改</button>
		</div>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import oneInput from '@/components/changePwdFrame/changePwdFrame.vue'   // 验证码格式框
	import {mapState} from 'vuex'
	import {getMsmVcode} from "../../api/smsApi.js"
	import {updatePwd} from "../../api/authApi.js"
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
				isCountDown: false, //是否正在倒计时
				timer: -1, // 计时器
				type: 2,   // 绑定手机号：1      修改密码：2
				smsVcode: '',   // 输入验证码
				newPwdValue: '', // 新密码的值
				rePwdValue: '', // 确认新密码的值
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
			//判断规则封装的函数
			test(val){
				if(val.trim().length <6 || val.trim().length>18 ){
					this.PopShowToastTips('请输入6-18位新密码哦');
					this.showTips = true
					val = ''
				}else{
					this.showTips = false
				}
			},
			repwdonBlur(){
				this.test(this.newPwdValue)
			},
			//获取焦点的时候
			repwdonFocus(){
				this.showTips = false
				this.newPwdValue = ''
			},
			confirmpwdBlur(){
				this.test(this.rePwdValue)
			},
			//获取焦点的时候
			confirmpwdFocus(){
				this.rePwdValue = ''
				this.showConfirm = false
			},
			//密码聚焦时候情况
			renewPwdFocous(){
				this.newPwdValue = ''
			},
			// val即是changePwdFrame.vue传过来的  inputValue  值
			parenInput(val){
				this.smsVcode = val;
			},
			goBack() {
				uni.navigateBack({
					delta: 1    // 返回多少个页面
				})
			},
			
			// 倒计时未结束给个提示 多少秒再试
			noGetVcode(){
				if(this.$store.state.updatePwdTime > 0) {
					this.PopShowToastTips('请'+`${this.$store.state.updatePwdTime}`+'s后再试');
				}
			},
			// 获取验证码
			getVcode() {
				// 判断是否已输入密码
				if(this.vcode.length == 0) {
					// 倒计时
					// 如果上一次正在倒计时没有结束的话，则直接返回
					if(this.$store.state.updatePwdTime > 0) return
					this.tipName = '重新获取验证码'+'('+`${this.$store.state.updatePwdTime}`+'s'+')'
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
						self.tipName = '重新获取验证码'+'('+`${self.$store.state.updatePwdTime}`+'s'+')'
					},1000)
					
					//这里开始请求获取短信验证码
					getMsmVcode(this.phone,this.type).then(res=>{})
					this.PopShowToastTips('验证码已发送，请注意查收');
					this.smsVcode = ''   // 验证码框置空
				}else{
					if(this.newPwdValue == ''){
						this.PopShowToastTips('请先输入6-18位新密码哦');
						return
					} else if(this.rePwdValue == ''){
						this.PopShowToastTips('请输入确认密码');
						return
					}
					if(this.newPwdValue != this.rePwdValue){
						this.PopShowToastTips('俩次输入的密码不一致');
						return
					} 
				}
			},
			
			
			// 修改密码
			changeNewPwd() {
				let message=""; 
				if(this.smsVcode.trim().length == 0){
					message = '亲！验证码不能为空！';
					uni.showToast({title: message,icon: 'none',duration: 2000,position: 'bottom'});
				} else if(this.smsVcode.trim().length < 4){
					message = '亲！请输入完整的验证码！';
					uni.showToast({title: message,icon: 'none',duration: 2000,position: 'bottom'});	
				} else if(this.newPwdValue.trim().length <6 || this.newPwdValue.trim().length>18 ){
					this.PopShowToastTips('请输入6-18位新密码哦');
					return
				}else if(this.rePwdValue == ''){
					this.PopShowToastTips('请输入确认密码');
					return
				}else if(this.newPwdValue != this.rePwdValue){
					this.PopShowToastTips('俩次输入的密码不一致');
					return
				}
				else {
					const reg = /^[\u4e00-\u9fa5]{0,}$/;  // 汉字
					if(reg.test(this.newPwdValue)){
						message = '密码不能为汉字!';
						uni.showToast({ title: message, icon: 'none', duration: 2000, position: 'bottom' });
					} else {
						updatePwd(this.$md5(this.newPwdValue),this.smsVcode).then(res=>{
							this.$store.state.updatePwdTime = 0;
							message = '修改成功!';
							uni.showToast({title: message,icon: 'none',duration: 2000,position: 'bottom'});
							// //过1.2秒后返回上一页
							setTimeout(function(){
								uni.navigateBack({
									delta:1
								})
							},1200)
						})
					}
				}
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
		font-family: 'Source Han Sans CN';
		font-weight:400;
		color:rgba(102,102,102,1);
	}
	.phoneAndVcode {
		margin-left: 16px;
		margin-right: 16px;
		margin-bottom: 10px;
		.phone {
			font-size:18px;
			font-family:'Source Han Sans CN';
			font-weight:500;
			line-height:20px;
			color:rgba(10,30,44,1);
		}
		.send-code {
			float: right;
			font-size:16px;
			font-family:'Source Han Sans CN';
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
			height: 45px;
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
		font-family: 'Source Han Sans CN';
		font-weight:400;
		line-height:18px;
		color:rgba(154,154,154,1);
		margin-top: 30px;
	}
	.affirmChange {
		margin: 30px 36px 0px 36px;
		height: 40px;
		line-height: 40px;
		background:rgba(255,168,1,1);
		border-radius:10px;
		font-size:19px;
		font-family:'PingFang SC';
		font-weight:bold;
		color:rgba(255,255,255,1);
		z-index:0;
	}
</style>
