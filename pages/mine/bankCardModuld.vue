<template>
	<div class="have-bank" ref="havebank">
		<!-- 当银行卡一张的时候全部信息显示齐全 -->
		<div  
		class="bank" 
		style="height: 120px;" 
		v-if="bankCardList.length ==1" 
		:ref="'bank${0}'" 
		:style="[
			{'background':'linear-gradient(to right,'+bankCardList[0].bank_card_color+','+bankCardList[0].bank_card_color2+')'},
			{'z-index':0}
			]">
			<div class="bank-name">
				<div class="bankFrame">
					<!-- 银行卡图标 -->
					<div class="bankImg">
						<div class="iconfont">
							<i :class="bankCardList[0].bank_short"></i>
						</div>
					</div>
					<!-- <i class="iconfont icon">&#xe97d;</i> -->
					<!-- <i class="iconfont iconccb"></i> -->
					<div class="bank-detail">
						<div class="bank-main">
							<span class="bank-type">{{bankCardList[0].opening_bank}}</span>
						</div>
						<div style="font-size: 16px;">{{bankCardList[0].card_code | hideMiddle}}</div>
					</div>
				</div>
				<!-- 右上角文字 -->
			</div>
			<!-- 显示卡号的类型 -->
			<div class="bank-date">
				<div >{{bankCardList[0].bank_card_type}}</div>
			</div>
		</div>
		<!-- 当银行张数大于一张的时候显示的张数 -->
		<div class="bank"
			v-else
			v-for="(item,index) in bankCardList" 
			:key="index" :ref="'bank${index}'"
			:style="[
				{'background':'linear-gradient(to right,'+item.bank_card_color+','+item.bank_card_color2+')'},
				{'z-index':index},
				{'height':'120'}]" 
				@click="clickBank(index,item)">
			<div class="bank-name">
				<div class="bankFrame">
					<!-- 银行卡图标 -->
					<div class="bankImg">
						<div class="iconfont">
							<i :class="item.bank_short"></i>
						</div>
					</div>
					<div class="bank-detail">
						<div class="bank-main">
							<span class="bank-type">{{item.opening_bank}}</span>
						</div>
						<div style="font-size: 16px;">{{item.card_code | hideMiddle}}</div>
					</div>
				</div>
			</div>
			<!-- 显示卡号的类型 -->
			<div class="bank-date">
				<div >{{item.bank_card_type}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import {getBankShort} from '../../api/addBankApi.js'
	export default{
		props:{
			bankCardList:{  // 银行卡信息列表
				type: Array,
				default: []
			}   
		},
		data() {
			return {
				
			}
		},
		created() {
			console.log("银行卡列表",this.bankCardList)
		},
		methods:{
			clickBank(index,item){
				console.log("我的索引",index)
				console.log("我所点击的银行卡名称",item.opening_bank)
				var that = this;
				this.open = true
				// this.$refs['bank${index}'][item.length-1].style.zIndex = 1;
				// 设置高度的样式
				// that.$refs['bank${index}'][index].style.height = 120+'px';
				//把点击的银行卡显示在最下面
				//把当前点击的放入数组的最后一个位置
					that.bankCardList.push(item);
					//删除当前点击的元素，然后添加到数组的最后一个元素
					that.bankCardList.splice(index,1);
					//在手机上不起效果（待续）
					// if(this.$refs['bank${index}'][index].style.height==60+'px'){
					// 	this.$refs['bank${index}'][index].style.height=110+'px';
					// }else if(index == this.bankCardList.length){
					// 	this.$refs['bank${index}'][index].style.height=110+'px';
					// }else{
					// 	this.$refs['bank${index}'][index].style.height=60+'px'
					// }
			},
			
		}
	}
</script>

<style lang="less" scoped>
	
	/* 有卡效果 */
	.have-bank{
		padding: 12px;
		box-sizing: border-box;
		width: 100%;
		color:rgba(255,255,255,1);
		margin-top: 40px;
		overflow: hidden;
		.newItem{
			transition: top linear .2s;
			top:-320px !important;
		} 
		// 展开整张卡
		.bank{
			padding: 8px 16px 10px 8px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 60px;
			box-shadow:0px 10px 20px rgba(0,0,0,0.23);
			border-radius: 5px;
			overflow: hidden;
			margin-top: -10px;
			.bank-name{
				padding-bottom: 10px;
				.bank-classy{
					font-size:16px;
					font-family:PingFang SC;
					color:rgba(255,255,255,1);
				}
				.bankFrame{
					align-items: center;
					display: flex;
					justify-content: space-between;
					.bankImg {
						width: 30px;
						height: 30px;
						border-radius:50%;
						background-color: #FFF!important;
						overflow: hidden;
						display: flex;
						justify-content: center;
						align-items: center;
						.iconfont {
							.CCB, .COMM, .CIB, .ABC,
							.iconzhoashang, .icongongshnag, .SPDB, .BOC, .PSBC,.CMB{
								font-style: normal;
								font-size: 20px;
								text-align: center;
							}
							// 建设银行icon
							.CCB {
								color: #003b8f;
							}
							// 交通银行icon
							.COMM {
								color: #1d2087;
							}
							// 兴业银行icon
							.CIB {
								color: #002e6c;
							}
							// 农业银行icon
							.ABC {
								color: #009174;
							}
							// 招商银行icon
							.CMB {
								color: red;
							}
							// 工商银行icon
							.ICBC {
								color: #e50012;
							}
							// 浦发银行icon
							.SPDB {
								color: #14377e;
							}
							// 中国银行icon
							.BOC {
								color: #c1383d;
							}
							// 邮政银行icon
							.PSBC{
								color: #007e3e;
							}
						}
					}
					// 修复银行卡后面添加的样式
					.bank-detail{
						display: flex;
						justify-content: space-between;
						flex: 1;
						width: 100%;
						align-items: center;
						.bank-main{
							display: flex;
							flex-direction: column;
							flex: 1;
							.bank-type{
								margin-left: 10px;
								font-size: 16px;
							}
						}
					}
				}
				
			}
			.bank-date{
				display: flex;
				justify-content: flex-end;
				padding-top: 30px;
				font-size:14px;
				font-family:PingFang SC;
				color:rgba(255,255,255,1);
			}
		}
		.bank:last-child{
			height: 120px;
		}
		
	}
</style>
