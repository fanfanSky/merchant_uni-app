<template>
	<div class="rowNumber">
		<div class="rowCard">
			<div class="rowCardNum"  v-show="numberStatus == 0">
				<span style="padding-right: 20px;">订单来源：{{info.platformName}}</span>
				<span  class="num">{{info.book_id}}</span>
			</div>
			<div class="rowCardNum-2" v-show="numberStatus == 1">
				<span class="date" >完成时间: {{$moment(info.use_time * 1000).format('YYYY.M.D H:mm')}}</span>
				<span class="num-id">{{info.bookId}}号</span>
			</div>
			<!-- 预约中组件 -->
			<cobommodule :idStatus="numberStatus" :info="info"  />
			<div class="two-btn" v-show="numberStatus == 0">
				<button class="table-no" @click.stop="refuseForward()">拒绝预约</button>
				<!-- <button class="table-no" @click="addOdd()">已出餐</button> -->
				<!-- 弹出设置餐号模态框 -->
				<uni-popup ref="setOdd">
					<div class="setOdd-frame">
						<div class="popup-topText">请设置单号</div>
						<input class="input-odd" type="text" v-model="oddValue" />
						<button @click="oddConfirm">确定</button>
					</div>
					<div class="close">
						<img src="static/chunLei-modal/close.png" @click="closePopup()">
					</div>
				</uni-popup>
				<!-- 弹出设置餐号模态框 -->
				<uni-popup ref="setRefuse" type="bottom">
					<div class="setRefuse-frame">
						<div class="reason">请选择理由</div>
						<div class="full" value="今日预约已满" v-model="value1" @click="dayFull">今日预约已满</div>
						<div class="full" value="今日门店已打烊" v-model="value2" @click="colDoor">今日门店已打烊</div>
						<div class="full" value="套餐部分商品已售罄" v-model="value3" @click="sellOut">套餐部分商品已售罄</div>
						<textarea class="refuseContent" v-model="inputValue" placeholder="填写理由:" />
						<div class="confirm-frame">
							<span class="confirm" @click="confirmRefuse">确定婉拒</span>
						</div>
					</div>
				</uni-popup>
			</div>
		</div>
	</div>
</template>

<script>	
	// Popup 弹出层
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	// 引入套餐组件
	import cobommodule from '../home/cobomModule'

	import {rejectPre,getStoreOrder,setMealNumber,preOver} from '../../api/orderApi.js'
	import {deleteGood} from "../../api/goodsApi";

	export default {
		// 注册组件
		components: {uniPopup,cobommodule},
		props:{
			numberStatus:{   // 从父组件中拿index值用于改变   ['待排号','已排号','已进账'] 三者状态
				type: Number,
				default: 0
			},
			info: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				index: 0,
				oddValue:'',   // 餐号值
				value1: '今日预约已满',  //理由选项值
				value2: '今日门店已打烊',
				value3: '套餐部分商品已售罄',  
				inputValue: '',// 理由框中的值
				num:'',
				bankType:'',
			}
		},

		mounted(){
			console.log("infoinfoinfoinfo",this.info)
			//判断是否存在book_id（报错中）
			console.log("ssss",this.info)
			if(this.info.book_id!=undefined){
				this.num = this.info.book_id.split("行")[1]
				this.bankType = this.info.book_id.split("行")[0]	
			}
		},
		methods:{
			// 设置餐号 
			addOdd(){
				var self = this;
				uni.showModal({
					title: '提示',
					content: '是否确认出餐？请务必确认该菜品已制作完成再出餐。',
					success: function (res) {
						if (res.confirm) {
						//	确认出餐
							uni.showLoading({
								title: '设置出餐中，请稍候...'
							});
							preOver(self.info.history_id).then(res => {
								uni.showToast({
									title: "出餐成功",
									duration: 3000
								});
							}).finally(() => {
								uni.hideLoading();
							});
						}
					}
				});
			},
			// 关闭设置单号
			closePopup(){
				this.$refs.setOdd.close()
				this.oddValue = ''
			},
			// 拒绝预约
			refuseForward(){
				this.$refs.setRefuse.open()
				this.inputValue = ''
			},
			dayFull(){
				this.inputValue = this.value1
			},
			colDoor(){
				this.inputValue = this.value2
			},
			sellOut(){
				this.inputValue = this.value3
			},
			// 确认拒绝预约
			confirmRefuse(){
				// 判断是否已经填入理由
				if(this.inputValue == ''){
					this.PopShowToastTips("请先填写拒绝理由!")
					return
				} else {
					this.$refs.setRefuse.close()
					rejectPre(this.info.history_id,this.inputValue).then(res=>{
						this.PopShowToastTips("婉拒成功:" +`${this.info.name}`)
					})
				}
			},
			oddConfirm() {
				setMealNumber(this.info.history_id,this.oddValue).then(res=>{

				})
				setTimeout(()=>{
					this.$refs.setOdd.close()
				},500)
			},

			
		}
	}
</script>

<style lang="less" scoped>
	.rowCard {
		background-color: #fff;
		margin: 4px 8px 0px 8px;
		padding-bottom: 4px;
		border-radius: 5px;
		overflow: hidden;
		box-sizing: border-box;
		.rowCardNum {
			height: 45px;
			border-bottom:1px solid #E1E1E1;
			margin: 0 8px;
			line-height: 45px;
			margin-bottom: 10px;
			font-size:16px;
			font-weight:bold;
			color:rgba(10,30,44,1);
			.num{
				font-size:16px;
				font-weight:bold;
				color:rgba(252,108,79,1);
			}
		}
		.rowCardNum-2 {
			display: flex;
			justify-content: space-between;
			border-bottom:1px solid #E1E1E1;
			margin: 0 8px;
			line-height: 45px;
			margin-bottom: 10px;
			.date, .time {
				font-size:14px;
				color:#0A1E2C;
			}
			.num-id{
				font-size:16px;
				color:rgba(10,30,44,1);
			}
			.time {
				margin-left: 10px;
			}
			.number {
				float: right;
				font-size:16px;
				font-weight:400;
				color:rgba(10,30,44,1);
			}
			
		}
		
		button {
			width: 81px;
			height: 30px;
		}
		// 已出餐
		.already {
			background-color: #45D5A2;
			line-height: 30px;
			font-size:12px;
			color:rgba(255,255,255,1);
			margin-top: 17px;
			margin-right: 9px;
		}
		.two-btn {
			height: 30px;
			margin-top: 17px;
			padding-bottom: 5px;
			position: relative;
			.no-forward {
				line-height: 30px;
				background:rgba(246,246,246,1);
				font-size:12px;
				color:rgba(154,154,154,1);
				position: absolute;
				top: 0;
				right: 100px;
			}
			.table-no {
				background:rgba(255,168,1,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				font-size:12px;
				line-height: 30px;
				color:rgba(255,255,255,1);
				position: absolute;
				right: 9px;
			}
			.setOdd-frame {
				width: 300px;
				height: 180px;
				background-color: #fff;
				border-radius: 5px;
				.popup-topText {
					width: 100%;
					font-size:14px;
					color:rgba(10,30,44,1);
					text-align: center;
					line-height: 40px;
					margin-bottom: 20px;
				}
				.input-odd {
					width: 240px;
					height: 40px;
					border-radius: 5px;
					background-color: #F2F5F7;
					margin: auto;
					margin-bottom: 31px;
				}
				button {
					width: 200px;
					background-color: #45D5A2;
					line-height: 39px;
					font-size:18px;
					color:rgba(255,255,255,1);
				}
			}
			.close {
				width: 100%;
				height: 32px;
				text-align: center;
				margin-top: 30px;
			}
			.setRefuse-frame {
				height:353px;
				background-color: #fff;
				font-weight:500;
				font-size:18px;
				// margin-bottom: 100px;
				.reason {
					width: 100%;
					line-height: 50px;
					color:rgba(51,51,51,1);
					text-align: center;
				}
				.full {
					width: 100%;
					line-height: 50px;
					font-weight:400;
					color:rgba(102,102,102,1);
					text-align: center;
					height: 50px;
				}
				// 骚气渐变色
				// .full:focus{
				// 	background-image: linear-gradient(to right, #FFF3B0 0%, #CA26FF 100%);
				// }
				.refuseContent {
					height: 101px;
					background-color: #F2F5F7;
					margin: auto;
					text-indent: 1em;
					margin-bottom: 15px;
				}
				.confirm-frame {
					width: 100%;
					text-align: center;
				}
				.confirm {
					font-size:18px;
					color:rgba(69,213,162,1);
				}
			}
		}
		
	}
</style>
