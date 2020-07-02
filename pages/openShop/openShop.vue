<template>
	<view class="changeCommercialMsg">
		<div class="top-div">
			<div class="top"></div>
			<uni-nav-bar class="edit" left-icon="back" left-text="返回" @clickLeft="goBack()" title="申请开店"></uni-nav-bar>
		</div>
		<!-- 信息提交成功之后弹出来的信息 -->	
		<div class="top-changeMsg">
			<view class="CommercialMsg">
				<div class="MsgList">
					<!-- 商铺名称 -->
					<div class="commercialName">
						<span class="name">商铺名称</span>
						<div class="inputValue">
							<input type="text" maxlength="20" v-model="storeMsg.store_name" placeholder="请填写您的店铺名称" />
						</div>
					</div>
					<!-- 店铺详细地址 -->
					<div class="commercialName">
						<span class="name">店铺详细地址</span>
						<div class="inputValue">
							<input type="text" maxlength="200" v-model="storeMsg.address" placeholder="请填写店铺详细地址"/>
							<span class="openMap" @tap="openMap">
								<image src="@/static/openShop/mapLocation.png" mode=""></image>
							</span>
						</div>
					</div>
					<!-- 是否连锁 -->
					<div class="commercialName">
						<span class="name">是否品牌连锁</span>
						<div class="radioValue">
							<radio class="radioSelect" @click="radioChange(1)" :checked="isChecked===true" color="#ffa801" />
							<span class="name yes">是</span>
							<radio class="radioSelect" @click="radioChange(2)" :checked="isChecked===false" color="#ffa801" />
							<span class="name">否</span>
						</div>
					</div>
					<!-- 店铺分类 -->
					<div class="commercialName">
						<span class="name">店铺分类</span>
						<div class="inputValue">
							<div style="flex: 1;">
								<select  :label-in-value="true" class = "selectType" @change="selectTypeChange" ref="addRequestState">
									<!-- 不起作用待做 -->
									<option selected="selected">请选择店铺类型</option>
									<option v-for="(item,index) in selectTypeLists" :key="index" :value = "item.name">{{item.name}}</option>
								</select>
							</div>
						</div>
					</div>
					<!-- 负责人 -->
					<div class="commercialName">
						<span class="name">负责人</span>
						<div class="inputValue">
							<input type="text" maxlength="20" v-model="storeMsg.leader_name" placeholder="请填写负责人姓名" />
						</div>
					</div>
					<!-- 负责人手机号码 -->
					<div class="commercialName">
						<span class="name">负责人联系方式</span>
						<div class="inputValue">
							<input type="text" maxlength="12" v-model="storeMsg.leader_tel" placeholder="请填写负责人联系方式" />
						</div>
					</div>
				</div>
			</view>
			<div class="submit-affirm" @click="affrimSubmit()">确认提交</div>
		</div>
	</div>
	</view>
</template>

<script>
	import {applyForShop,getCategories} from "../../api/openShopApi.js";
	export default {
		data() {
			return {
				selected:true,
				selectTypeLists:[],//选择下拉列表
				wxDepositShow:false,//控制列表是否显示
				//需要返回给后台的数据
				storeMsg:{
					store_name:'',  // 店铺名称
					address:'', // 店铺地址
					isChain:'', // 是否连锁
					category: '',  //  店铺分类
					leader_name: '',//负责人姓名
					leader_tel:'' // 负责人电话
				}
			}
		},
		onLoad(){
			//一进入页面就调用店铺类型的接口
			this.getCate()
		},
		created() {
		},
		computed:{
			isChecked() {
				if (this.storeMsg.isChain == '1') {
					return true;
				} else if (this.storeMsg.isChain == '2') {
					return false;
				}
			}
		},
		methods:{
			// 开启地图
			openMap(){
				let self = this;
				uni.chooseLocation({
					success: function (res) {
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
						self.storeMsg.address = res.address
					}
				})
				
			},
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta:1
				})
			},
			//店铺类型数据请求：如：火锅，小吃等
			getCate(){
				getCategories().then(res=>{
					this.selectTypeLists = res.data
				})
			},
			//选择店铺
			selectTypeChange(){
				 let index = this.$refs.addRequestState.value
				 for(let i = 0;i < this.selectTypeLists.length;i++) {
					 this.storeMsg.category = index
					 if(index === this.selectTypeLists[i].name) {
						  console.log('index',index)
					 	this.wxDepositShow = true;
					 } else {
					 	this.wxDepositShow = false;
					 }
				 }
			},
			//是否连锁的点击事件
			 radioChange(value) {
				 this.storeMsg.isChain = value;
			 },
			// 确认提交
			affrimSubmit(){
				var self = this
				if(self.storeMsg.store_name.length === 0){
					this.PopShowToastTips('请填写店名');
					return 
				}else if(self.storeMsg.address.length === 0){
					this.PopShowToastTips('请选择或者填写店铺详细地址');
					return 
				}
				else if(self.$refs.addRequestState.value === '请选择店铺类型'){
					this.PopShowToastTips('请选择店铺类型');
				}else if(self.storeMsg.leader_name.length === 0){
					this.PopShowToastTips('请填写负责人姓名');
				}else if(!(/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/.test(self.storeMsg.leader_tel))){
					this.PopShowToastTips('请填写正确的手机号');
				} else {
					applyForShop(
						self.storeMsg.store_name,
						self.storeMsg.address,
						self.storeMsg.isChain,
						self.storeMsg.category,
						self.storeMsg.leader_name,
						self.storeMsg.leader_tel).then(res=>{
							this.PopShowToastTips('提交信息成功!');
							// 延迟跳转首页
							setTimeout(function(){ uni.reLaunch({url: '/pages/login'})},3000);
						})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	//店铺分类样式
	.selectType{
		border: none;
		margin-top: 16px;
		width: 100%;
		background-color: #FFFFFF;
		color:#0a1e2c;
	}
	.sucess-information{
		width: 100%;
		background:rgba(102,102,102,1);
		font-size:14px;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(255,255,255,1);
		text-align: center;
		padding: 6px 0px;
	}
	.top-fixed {
		&>div {
			width: 100%;
			line-height: 30px;
			background-color: #fff;
		}
	}
	.top-changeMsg {
		margin-top: 80px;
		.edit{
			margin-bottom: 30px;
			width: 100%;
			line-height: 30px;
		}
	}
	.CommercialMsg {
		width: 100%;
		background-color: #fff;

		.baseMsg {
			font-size:14px;
			font-weight:bold;
			line-height:14px;
			color:rgba(10,30,44,1);
			text-align: center;
			padding: 14px 0px;
		}
		.MsgList {
			.commercialName {
				height: 50px;
				border-bottom: 1px solid #E1E1E1;
				margin: 0 17px;
				.name {
					line-height: 50px;
					font-size:14px;
					font-weight:400;
					color:rgba(10,30,44,1);
				}
				.inputValue {
					width: 65%;
					height: 50px;
					float: right;
					input {
						margin-top: 16px;
						font-size:14px;
						line-height:14px;
						color: #0a1e2c;
						margin-right: 40px;
					}
					.openMap {
						width: 40px;
						height: 25px;
						font-size: 16px;
						text-align: center;
						line-height: 25px;
						float: right;
						margin-top: -22px;
						image {
							width: 20px;
							height: 25px;
						}
					}
				}
				.radioValue {
					width: 65%;
					line-height: 50px;
					float: right;
					font-size:14px;
					line-height:14px;
					color:rgba(154,154,154,1);
					.name {
						margin-left: 5px;
					}
					.yes {
						margin-right: 15px;
					}
				}
			}
			.business-hours {
				line-height: 50px;
				margin: 0 17px;
				.name {
					line-height: 50px;
					font-size:14px;
					color:rgba(10,30,44,1);
				}

			}
		}
	}
	.head-portrait {
		width: 100%;
		height: 136px;
		margin-top: 16px;
		margin-bottom: 10px;
		span {
			margin-left: 16px;
			margin-right: 16px;
			top: 0;
			font-size:14px;
			font-weight:bold;
			line-height:18px;
			color:rgba(51,51,51,1);
		}
		img {
			width: 136px;
			height: 136px;
			background-color: #fff;
			margin-left: 100px;
		}
	}
	.in-store {
		margin-bottom: 49px;
		.in-store-text {
			font-size:14px;
			font-family:Source Han Sans CN;
			font-weight:bold;
			line-height:18px;
			color:rgba(51,51,51,1);
			margin-left: 16px;
		}
		.container {
			width: 100%;
			overflow-x: scroll;
		}
	}
	.submit-affirm {
		background:rgba(255,168,1,1);
		font-size:16px;
		width:60%;
		border-radius:10px;
		color:rgba(255,255,255,1);
		margin: 76px auto;
		text-align: center;
		line-height: 40px;
	}
</style>
