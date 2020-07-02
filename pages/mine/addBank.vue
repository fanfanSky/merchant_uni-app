<template>
	<div>
		<!-- 顶部信息效果 -->
		<div class="top"></div>
		<uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="添加银行卡"></uni-nav-bar>
		<div class="main-addbank">
			<div>
				<div class="bank-car">
					<div class="title">银行卡号</div>
					<input v-model="BankObject.card_code" @blur="addBankBlur" class="uni-input" type="number" placeholder="请输入您的银行卡号"/>
				</div>
				<div class="bank-car">
					<div class="title">开户行</div>
					<input type="text" class="uni-input" disabled="true" v-model="BankObject.opening_bank" placeholder="填写银行卡开户行"/>
				</div>
				
				<div class="bank-car">
					<div class="title">手机号码</div>
					<input v-model="BankObject.tel" class="uni-input" type="number" placeholder="请填写您的手机号码"/>
				</div>
				
				<div  class="phone">
					<div class="title">验证码</div>
					<div class="yanzhengma" style="display: flex;justify-content: space-between;">						
						<input v-model="BankObject.code"  class="uni-input" type="number" placeholder="请填写验证码" />
						<span @click="sendPhoneCode()" v-if="$store.state.updatePwdTime <= 0" style="color: #FFA801;font-size:16px;font-weight:400;opacity:1;">发送验证码</span>
						<span @click="noGetVcode()" v-if="$store.state.updatePwdTime > 0" style="color: #a8a8a8;font-size:16px;font-weight:400;opacity:1;">重新获取验证码({{$store.state.updatePwdTime}}s)</span>
					</div>
				</div>
				<div class="bottom" @click="addBank()">
					<div>添加</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {getBankCardMsg, isBankCardRight,addBankCardMsg} from '../../api/addBankApi.js'
	import {getForgetPwdCode,getStorePhone} from '../../api/forgetPwd.js'
	import {mapState} from 'vuex'
	export default {
		computed: {
		    ...mapState([
		        'storeInfo'
		    ])
		},
		data() {
			return {
				BankObject:{
					bank_adress:'',    // 开户行地址(暂时不传)
					opening_bank:'',   // 开户银行
					card_code:'',      // 银行卡号	
					store_name: '',    // 店铺名称
					tel:'',            // 绑定的手机号
					code:''            // 验证码
				},
				oldBankData:[],
				code: '',
				tipName: '获取验证码',
				isCountDown: false, //是否正在倒计时
				timer: -1, // 计时器
			}
		},
		created() {
			console.log("=====>",this.storeInfo)
			this.BankObject.store_name = this.storeInfo.name  // 取到店铺名
			getStorePhone(this.storeInfo.name).then(res=>{
				this.BankObject.tel = res.data  // 取到绑定到的手机号
			})
		},
		methods: {
			addBankBlur(){
				// console.log("银行卡号:",this.BankObject.card_code)
				if(this.BankObject.card_code != ''){
					isBankCardRight(this.BankObject.card_code).then(res=>{
						if(!res.is_right){
							this.PopShowToastTips('您输入的银行卡不正确');
						}
					})
				} else if(this.BankObject.card_code == ''){
					this.PopShowToastTips('请输入您的银行卡号');
					return
				}
				getBankCardMsg(this.BankObject.card_code).then(res=>{ 
					this.BankObject.opening_bank = res.bank_name
					console.log("this.opening_bank===>",this.BankObject.opening_bank) // 中国邮政储蓄银行
				});
			},
			
			// 倒计时未结束给个提示 多少秒再试
			noGetVcode(){
				if(this.$store.state.updatePwdTime > 0) {
					this.PopShowToastTips('请'+`${this.$store.state.updatePwdTime}`+'s后再试');
				}
			},
			
			// 获取验证码
			sendPhoneCode(){
				if(this.BankObject.card_code == ''){
					this.PopShowToastTips('请输入您的卡号');
					return
				} else if(this.BankObject.card_code != '') {
					// 判断是否是真的卡号
					isBankCardRight(this.BankObject.card_code).then(res=>{
						if(res.is_right == false){   // 银行卡号码不正确
							this.PopShowToastTips('您输入的银行卡号码不正确');
							return
						} else {
							this.code = ''   // 每次发送验证码时都会清空验证码内容
							if(this.code.length > 0 && this.code.length < 4) {
								this.PopShowToastTips('您输入的验证码不正确哦');
								return
							} else {
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
										clearInterval(self.timer)   // 清除定时器
										self.tipName = '获取验证码'
										self.isCountDown = false
										return
									}
									self.$store.state.updatePwdTime--;
									self.tipName = '重新获取验证码'+'('+`${self.$store.state.updatePwdTime}`+'s'+')'
								},1000)
								// 这里发送请求手机验证码接口
								getForgetPwdCode(this.BankObject.tel).then(res=>{  })
							}
						}
					})
				}
			},
			
			//添加银行卡按钮
			addBank(){
				// let title = ''
				// 验证码是否通过
				if(this.BankObject.card_code != '' && this.BankObject.code == ''){
					this.PopShowToastTips('请输入验证码');
					return
				} else if( this.BankObject.code.length != 4 ) {
					this.PopShowToastTips('验证码错误');
					return
				} else {
					// console.log(this.BankObject.store_name,this.BankObject.card_code,this.BankObject.opening_bank,this.BankObject.yanzhengma,this.BankObject.phone)
					console.log("对象信息==>",this.BankObject)
					console.log("验证码==>",this.BankObject.code)
					// 发送请求添加银行卡
					// 传一个 对象和验证码 回去
					addBankCardMsg(this.BankObject.bank_adress,
								   this.BankObject.opening_bank,
							       this.BankObject.card_code,
								   this.BankObject.store_name,
								   this.BankObject.tel,
								   this.BankObject.code).then(res=>{
						this.PopShowToastTips('添加银行卡成功');
						// 页面修改，让本页面数据同步到bankCard中
						uni.$emit('updateBankCard',{})
						// 过2秒返回2个页面
						setTimeout(function(){
							uni.navigateBack({
								delta:2
							})
						},2000);
					})
				}
				// 把提示信息抽取出来用个函数统一表示
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
	// 顶部信息效果
	.top{
		width: 100%;
		height: 44px;	
	}
	//主体部分样式
	.main-addbank{
		padding: 16px;
		box-sizing: border-box;
		.phone{
			border-bottom:1px solid rgba(225,225,225,1);
			.title{
				color:rgba(51,51,51,1);
				padding-bottom: 10px;
				font-size:18px;
				font-family:PingFang SC;
				font-weight:400;
			}
			.yangzhengma{
				display: flex;
				justify-content: space-between;
				.uni-input{
					color: #007AFF; 
					padding-bottom: 4px;
				}
			}
			
		}
		.bank-car{
			height: 65px;
			.title{
				font-size:18px;
				font-family:PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
			}
			.car{
				display: flex;
				font-size: 10px;
				border-bottom:1px solid rgba(225,225,225,1);
				input{
					border: none;
				}
				.right-date{
					width: 100%;
					font-size: 20upx;
					p{
						font-size:14px;
						font-family:PingFang SC;
						font-weight:400;
						color:rgba(153,153,153,1);
						padding-bottom: 10px;
					}
				}
				.selectBox_list{
					width: 100%;
					background-color: #FFFFFF;
					position: absolute;
					bottom: -70px;
					margin-top: 0px;
					z-index: 99;
					.selectBox_listLi{
						border-bottom: 1px solid #CCCCCC;
					}
					
				}
			}
			.uni-input{
				font-size:14px;
				font-family:PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
				border-bottom:1px solid rgba(225,225,225,1);
				padding:0px 6px;
			}
		}
		.bottom{
			margin: 40px auto;
			display: flex;
			justify-content: center;
			align-items: center;
			width:200px;
			height:40px;
			background:rgba(255,168,1,1);
			border-radius:10px;
			font-size:18px;
			font-family:PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
	}
</style>
