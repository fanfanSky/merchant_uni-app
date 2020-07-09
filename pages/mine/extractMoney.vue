<template>
	<view class="extractMoney">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="提现"></uni-nav-bar>
			<p class="extractMoney-text">提现账号</p>
			<xfl-select class="xfl-select" 
				:list="bankNameNumberType"
				:cardCodeLists="bankCardNumber"
				@cardCode="getCardCode"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"
				:isCanInput="true"  
				:style_Container="'height: 35px; font-size: 16px;'"
				:placeholder="'请选择银行卡或输入您的银行卡号码'"
				:selectHideType="'hideAll'"
				@blur="cardCodeBlur"
			>
			</xfl-select>
			<p class="extractMoney-text">提现金额</p>
			<div class="extMon">
				<input class="amount" type="number" v-model="cardCodeAndMoney.money">
				<span>元</span>
			</div>
			<div class="Cash">
				<span class="canCash">可提现金额：{{balance}}</span>
				<span class="allCash" @click="allExtract()">全部提现</span>
			</div>
			<div style="display: flex; width: 100%; justify-content: center;">
				<button plain="true" class="affirmCash" @click="extract()">确认提现</button>
			</div>
			<!-- 弹出交易密码框 -->
			<tradepwd-modal :show="show" @confirm="confirmTrade" @cancel="cancelTrade" @close="closeModal" title="请输入交易密码">
			    <view class="input-view">
			        <view class="input-password">
			            <input v-model="cardCodeAndMoney.tradePassword" maxlength="6" type="password" class="tradePwdModal" placeholder="请输入密码" />
			        </view>
			    </view>
			</tradepwd-modal>
		</div>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {inquire,moneyOut} from "../../api/merchantsPurseApi"
	import {isBankCardRight} from '../../api/addBankApi'
	import xflSelect from '../../components/xfl-select/xfl-select'    //导入下拉列表
	import {getBankCardsMsg} from "../../api/addBankApi"
	// import bus from '../../eventBus/bus'
	import tradePwdModal from '@/components/tradepwd-modal/tradepwd-modal'    // 提现交易密码 
	export default {
		//注册为子组件
		components: { xflSelect,tradePwdModal },  
		data() {
			return {
				balance:'',  			  // 余额
				type: 3,
				isShow: false,
				bankCardDatas:[],         // 每张银行卡里面的数据
				bankCardName: [],         // 银行卡名称
				bankCardNumber:[],        // 银行卡号码
				bankCardType:[],          // 银行卡类型
				cardEndFour:[],           // 卡号后四位集合
				bankNameNumberType:[],    // 银行卡 名称+号码+类型
				cardCodeAndMoney:{        // 把cardCode和money保存到这个数组
					money:'',             // 想要提取的金额
					cardCode:'',          // 拿到卡号
					tradePassword:''      // 拿到交易密码
				},
				show: false
			}
		},
		computed: {
		    ...mapState([
		        'storeInfo'    // 商家信息
		    ])
		},
		created(){
			inquire().then(res=>{
				this.balance = res.data
			});
			// 请求银行卡数据
			getBankCardsMsg(this.storeInfo.name).then(res=>{ 
				var self = this;
				this.bankCardData = res.data
				for(let i in self.bankCardData){
					self.bankCardDatas.push(self.bankCardData[i])   // 每张银行卡里面的数据集合     
					self.bankCardName.push(self.bankCardData[i].opening_bank) // 银行卡名称
					self.bankCardNumber.push(self.bankCardData[i].card_code)  // 银行卡卡号
					self.bankCardType.push(self.bankCardData[i].bank_card_type) // 银行卡类型
					self.cardEndFour.push(self.bankCardData[i].card_code.substring(self.bankCardData[i].card_code.length-4))  // 卡号后四位
					self.bankNameNumberType.push(self.bankCardData[i].opening_bank + '(' + '尾号' + self.bankCardData[i].card_code.substring(self.bankCardData[i].card_code.length-4) + '\xa0\xa0' + self.bankCardData[i].bank_card_type + ')') 
				}
				
				console.log("每条银行卡数据集合",self.bankCardDatas)
			})
		},
		
		methods:{
			// 接收子组件传回来的值
			getCardCode(cardCode) {
				this.cardCodeAndMoney.cardCode = cardCode
			},
			goBack() {
				uni.navigateBack({delta:1})
			},
			// 点击全部提现
			allExtract() {
				this.cardCodeAndMoney.money = this.balance
			},
			// 银行卡输入失焦
			cardCodeBlur() {
				let title = ''
				if(this.cardCodeAndMoney.cardCode == ''){
					title = '银行卡号不能为空哦';
					cardCodeBlurHint();
					return
				} else if(this.cardCodeAndMoney.cardCode != ''){
					let self = this;
					isBankCardRight(this.cardCodeAndMoney.cardCode).then(res=>{
						if(res.is_right == false){   // 银行卡号码不正确
							title = '银行卡号码不正确哦';
							cardCodeBlurHint();
							return
						}
					})
				}
				function cardCodeBlurHint() { uni.showToast({ title:title, icon:'none', duration:1500, position:'bottom' }) }
			},
			// 提取现金
			extract() {
				console.log("银行卡号===>",this.cardCodeAndMoney.cardCode,"提现金额===>",this.cardCodeAndMoney.money)
				let title = ''
				if(this.cardCodeAndMoney.cardCode == ''){
					title = '银行卡号不能为空哦'
					extractHint();  // 银行卡号不能为空
					return
				} else if(this.cardCodeAndMoney.money > this.balance){
					title = '提现金额不能大于可提现金额哟'
					extractHint();
					return
				} else if(this.cardCodeAndMoney.money == '' || this.cardCodeAndMoney.money == 0) {
					title = '提现金额必须大于0'
					extractHint();
					return
				} else if(this.cardCodeAndMoney.money < 0.01){
					title = '最低只能提现0.01元哦!'
					extractHint();
					return
				} else if(this.cardCodeAndMoney.cardCode != '' && this.cardCodeAndMoney.money != ''){
					let self = this;
					isBankCardRight(this.cardCodeAndMoney.cardCode).then(res=>{
						if(res.is_right == false){   // 银行卡号码不正确
							title = '银行卡号码不正确哦'
							extractHint();
							return
						} else {   // 银行卡号码正确
							// 弹出输入交易密码框
							this.show = true
							this.cardCodeAndMoney.tradePassword = ''
						}
					})
				}
				function extractHint(){ uni.showToast({ title:title, icon:'none', duration:1500, position:'bottom' }) }
			},
			// 输入密码确认后开始请求提现
			confirmTrade(){
				let title = ''
				if(this.cardCodeAndMoney.tradePassword == ''){
					title = '请输入交易密码';
					confirmTradeHint();
					return
				} else {
					console.log("拿着3个参数去请求",this.cardCodeAndMoney)
					this.cardCodeAndMoney.tradePassword = this.$md5(this.cardCodeAndMoney.tradePassword)
					// 发送提现请求
					moneyOut(this.cardCodeAndMoney.money,
							 this.cardCodeAndMoney.cardCode,
							 this.cardCodeAndMoney.tradePassword).then(res=>{
						title = '提现成功';
						confirmTradeHint();
						// 同步刷新mine页面
						uni.$emit('refreshCollectExpend',{})
						// 1.5秒后返回收支明细页面
						setTimeout(()=>{
							uni.navigateTo({ url:'./collectExpend' })
						},1500)
					});
					this.closeModal()
				}
				function confirmTradeHint() { uni.showToast({title:title, icon:'none',duration:1500,position:'bottom'}) }
			},
			// 点击模态框取消按钮
			cancelTrade(){
				this.show = false
			},
			// 关闭模态框
			closeModal() {
			    this.show = false
			},
		},
	}
</script>

<style lang="less" scoped>
	.extractMoney-text {
		font-size:18px;
		font-family: 'Source Han Sans CN';
		line-height:18px;
		color:rgba(51,51,51,1);
		margin: 10px 0px 15px 16px;
	}
	// 不可选输入框
	.inputExtractId {
		height:35px;
		background:rgba(245,248,247,1);
		border-radius:10px;
		margin: 0px 16px;
		text-align: center;
		font-size:14px;	
		font-family: 'Source Han Sans CN';
		font-weight:400;
		line-height:18px;
		color:rgba(154,154,154,1);
		opacity:1;
		margin-bottom: 23px;
	}
	.cardNum {
		width: 100%;
		height: 20px;
		font-size: 14px;
		text-align: center;
		color: #ff0000;
	}
	.extMon {
		height:35px;
		margin: 0px 16px;
		font-weight:400;
		color:rgba(154,154,154,1);
		border-bottom: 1px solid #e2e2e2;
		font-size:24px;
		font-family: 'Source Han Sans CN';
		line-height:24px;
		margin-bottom: 10px;
		.amount {
			font-size: 24px;
			font-weight:bold;
			color:rgba(51,51,51,1);
			width: 80%;
			float: left;
			margin-left: 8px;
		}
		span {
			font-weight:400;
			color:rgba(102,102,102,1);
			float: right;
			margin-right: 8px;
			margin-top: 3px;
		}
	}
	.Cash {
		margin-right: 16px;
		float: right;
		.canCash {
			font-size:14px;
			font-family: 'Source Han Sans CN';
			line-height:14px;
			color:rgba(102,102,102,1);
			margin-right: 24px;
		}
		.allCash {
			font-size:14px;
			font-family: 'Source Han Sans CN';
			line-height:14px;
			color:rgba(69,213,162,1);
		}
	}
	.input-view {
		.tradePwdModal {
			height: 35px;
			// background-color: orange;
			text-align: center;
			padding-top: 12.5px;
		}
	}
	.xfl-select {
		width: 90%;
		border-radius:10px;
		display: flex;
		margin: auto;
		border: none;
		background-color: #f5f8f7;
	}
	.affirmCash {
		height: 39px;
		background-color: #FFA801;
		font-size:18px;
		font-family: 'Source Han Sans CN';
		line-height:18px;
		color:rgba(255,255,255,1);
		line-height: 39px;
		flex: 1;
		margin:0 87px;
		margin-top: 40px;
		border: 1px solid #FFA801;
	}
</style>
