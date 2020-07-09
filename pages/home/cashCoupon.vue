<template>
	<div  style="height: auto;">
		<!-- 主体部分开始 -->
		<div class="main">
			<!-- 套餐类型开始 -->
			<view class="new-produce">
				<!-- 代金券时显示-->
				<div class="package-details" style="margin-top: 0px;">
					<div class="package-type" style="padding: 0px;">
						<div class="type">
							<span>*</span>
							<span>名称</span>
						</div>
						<div class="package-name">
							<span style="font-size: 14px;">{{gInfoCash.name}}</span>
						</div>
					</div>
					<!-- 代金券面额 开始 -->
					<div class="flex flex-between">
						<div class="title-style">代金券面额</div>
						<!-- 面额 -->
						<div class="flex-btn">
							<div class="voucherSub" @click="valueDec">-</div>
							<input type="number" v-model="gInfoCash.value" maxlength="5" @blur="valueBlur" @focus="voucherFocus" class="voucher-input" />
							<div class="voucherAdd" @click="gInfoCash.value++">+</div>
						</div>
						<!-- 元代金券 -->
						<span style="padding-left: 10px;">元代金券</span>
					</div>
					<!-- 代金券面额 结束 -->
					<!-- 商家让利 开始 -->
					<div class="flex-between flex flex-top">
						<div class="title-style">商家让利:</div>
						<div class="flex-btn">
							<div class="store-1" @click="storeSubsidyDec">-</div>
							<div class="storesubsidy-input">
								<input v-model="gInfoCash.storeSubsidy" maxlength="5" @blur="storeSubsidyBlur()" @focus="surrenderFocus" class="ipt" type="number" />
							</div>
							<div class="store-2" @click="gInfoCash.storeSubsidy++">+</div>
						</div>
						<span class="monery-style" style="padding-left: 10px;">元</span>
					</div>
					<!-- 商家让利 结束 -->
					<!-- 实际售价 开始 -->
					<div class="total-price">
						<span>
							实际售价:
						</span>
						<span style="padding-left: 10px;color:rgba(252,108,79,1);">
							￥{{gInfoCash.price | foodCardFilter}}
						</span>
					</div>
					<!-- 实际售价 结束 -->
				</div>
			</view>
			<!-- 套餐类型 结束 -->
			<!-- 使用规范 开始 -->
			<div class="specification-use package-details">
				<div class="package-title">使用规范</div>
				<!-- 有效时间 开始 -->
				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>有效时间</span>
					</div>
					<view class="date_item">
						<dyDatePicker placeholder="开始日期" :minSelect="minSelect" :childValue="gInfoCash.startTime"
							:iconshow="false" @getData="getFromData">
						</dyDatePicker>
					</view>
					<view class="filter_inputline"></view>
					<view class="date_item">
						<dyDatePicker placeholder="结束日期" :minSelect="minSelect" :childValue="gInfoCash.expireTime"
							:iconshow="false" @getData="getToData">
						</dyDatePicker>
					</view>
				</div>
				<!-- 有效时间 结束 -->
				<!-- 限购张数 开始 -->
				<div class="package-type">
					<div class="type">
						<span></span>
						<span>限购张数</span>
					</div>
					<div class="package-time time-left">
						<div class="time-input">
							<input type="number" placeholder="不限" v-model.number="gInfoCash.buyTimeLimit" maxlength="4" @blur="numberLimit" @focus="limitFocus" min="1"/>						</div>
					</div>
					<span class="time-instrution">可点击修改</span>
				</div>
				<!-- 限购张数 结束 -->
				<!-- 需预约 开始 -->
<!-- 				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>需预约</span>
					</div>
					<div style="margin-left: 10px;">
						<checkbox-group  @change="checkboxChange">
							<label>
								<checkbox :checked="gInfoCash.needReserve == 1"/>
							</label>
							<span class="time-instrution">
								默认免预约，勾选进行更改
							</span>
						</checkbox-group>
					</div>
				</div> -->
				<!-- 需预约 结束-->
			</div>
			<!-- 使用规范结束 -->
			<!-- 使用说明 开始-->
			<div class="instructions package-details">
				<div class="instructions-title">
					<span style="color:rgba(255,62,62,1);padding-right: 6px;">*</span>
						使用说明
				</div>
				<div class="instructions-type" >
					<useExplain-select
						:list="templatesList"
						:initTemplatesName="initTemplatesName"
						:routeID="routeID"
						:goodsType="goodsType"
						:clearable="false"
						:showItemNum="5"
						:listShow="false"
						:isCanInput="false"  
						:style_Container="'height: 28px; font-size: 14px;color: #9A9A9A;text-align: center;'"
						:placeholder = "'请选择说明模板'"
						@changeItem = "changContent"
					>
					</useExplain-select>
				</div>
				<!-- 点击对应的模板出现对应模板内容的地方 -->
				<div class="template">
					<div class="uni-textarea">
						<textarea auto-height maxlength="1000" v-model="gInfoCash.mDesc" class="text-content" placeholder="请填写说明或者选择说明模板" />
					</div>
				</div>
			</div>
			<!-- 使用说明 结束-->
			<!-- 确定上架按钮  开始-->
			<div class="btn3" >
				<div class="btn-r"  @click="confirmCreateGood">确定上架</div>
			</div>
			<!-- 确定上架按钮 结束-->
		</div>
		<!-- 主体部分结束 -->
	</div>
</template>
<script>
	import useExplainSelect from '../../components/useExplain-select/useExplain-select.vue'  //导入下拉列表插件
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import {createGood} from "../../api/goodsApi";
	import {getTemplateList} from "../../api/authApi.js";
	import {mapState} from 'vuex'
	import dyDatePicker from '../../components/dy-Date/dy-Date.vue'
	import {floatSub} from '../../util/precision.js'
	export default {
			computed: {
			    ...mapState([
			        'storeInfo',    // 商家信息
					'gInfoCash'    // 代金券信息
			    ]),
				minSelect:function () {
				  return (Date.parse(new Date()) / 1000).toString();
				}
			},
			components: {
				 uniNavBar,  useExplainSelect, dyDatePicker
			},
			props:{
				selectedIndex:''
			},
			created() {
				// 加载说明模板数据：1为代金券 2.为套餐
				getTemplateList(1, this.storeInfo.id).then(res=>{
					this.informationTemplate = res.data   // 得到模板数据
					// 清空模板数组
					this.templatesList = [];
					// 取得名称压入模板数组
					for (let i = 0; this.informationTemplate != null && i < this.informationTemplate.length; i++) {
						this.templatesList.push(this.informationTemplate[i].templatesName);
					}
					//模板默认显示第一个
					if (this.informationTemplate != null && this.informationTemplate.length != 0) {
						if (this.selectedIndex != '' && this.selectedIndex != undefined) {
							this.initTemplatesName = this.informationTemplate[this.selectedIndex].templatesName;
							this.gInfoCash.mDesc = this.informationTemplate[this.selectedIndex].templatesContent;
						} else {
							this.initTemplatesName = this.informationTemplate[0].templatesName;
							this.gInfoCash.mDesc = this.informationTemplate[0].templatesContent;
						}
					}
				})
				// 初始时间设定
				if (this.gInfoCash.startTime == undefined) {
					this.gInfoCash.startTime = this.minSelect;
				}
				if (this.gInfoCash.expireTime == undefined) {
					this.gInfoCash.expireTime = this.minSelect;
				}
			},
			data() {
				return {
					// 模板列表的数组
					templatesList: [],
					// 初始化模板名称
					initTemplatesName:'',
					// 商品类型 1.代金券 2.套餐
					goodsType:'1',
					// 1.新增商品，2.编辑商品
					routeID:'1',
					// 信息模板
					informationTemplate:[
						{
							// 模板名字
							templatesName:'',
							// 模板内容
							templatesContent:''
						}
					],
				};
			},
			methods: {
				//确认新增方法
				confirmCreateGood(){
					if (this.gInfoCash.price <= 0) {
						this.PopShowToastTips('售价必须大于0');
						return;
					} else if(this.gInfoCash.startTime.length <= 0) {
						this.PopShowToastTips('开始日期不能为空哦');
						return
					} else if(this.gInfoCash.expireTime.length <= 0) {
						this.PopShowToastTips('结束日期不能为空哦');
						return
					}else if(this.gInfoCash.startTime == this.gInfoCash.expireTime ){
						this.PopShowToastTips('开始日期不能等于结束日期');
						return	
					}else if(this.gInfoCash.startTime > this.gInfoCash.expireTime) {
						this.PopShowToastTips('开始日期不能大于结束日期');
						return
					} else if(this.gInfoCash.buyTimeLimit != '' && this.gInfoCash.buyTimeLimit == 0 ) {
						this.PopShowToastTips('限购张数不能等于0哦');
						return
					} else if (this.gInfoCash.mDesc == '' || this.gInfoCash.mDesc.length == 0) {
						console.log('this.gInfoCash.mDesc===',this.gInfoCash.mDesc);
						this.PopShowToastTips('使用说明不能为空哦');
						return;
					} else {
						this.gInfoCash.storeId = this.$store.state.storeInfo.id;
						console.log("添加商品请求返回给后端的值this.gInfoCash",this.gInfoCash)
						// 添加商品请求
						createGood(this.gInfoCash).then(res => {
							console.log("添加商品成功",res)
							this.PopShowToastTips('添加商品成功');
							// 延迟跳转首页
							setTimeout( function() { uni.reLaunch({url: '/pages/home/home'})}, 1000);
						});
					}
				},
				//需预约的点击事件
				checkboxChange() {
					if(this.gInfoCash.needReserve == 1){
						this.gInfoCash.needReserve = 0
					}else{
						this.gInfoCash.needReserve = 1
					}
				},
				//选择使用模板
				selectTypeChange() {
					for(let i = 0;i < this.informationTemplate.length; i++){
						this.gInfoCash.mDesc = this.informationTemplate[i].templatesContent
					}
				},
				//点击模板时的事件
				changContent(res) {
					//模板默认显示第一个
					this.gInfoCash.mDesc = this.informationTemplate[res.index].templatesContent;
				},
				// 聚焦商家让利输入
				surrenderFocus() {
					this.gInfoCash.storeSubsidy = ''
				},
				// 商家让利失焦
				storeSubsidyBlur() {
					let tmpstoreSubsidy = 0;
					if (this.gInfoCash.storeSubsidy != '') {
						tmpstoreSubsidy = Number(this.gInfoCash.storeSubsidy).toFixed(2);
					}
					this.gInfoCash.storeSubsidy = tmpstoreSubsidy;
				},
				// 限购张数聚焦
				limitFocus() {this.gInfoCash.buyTimeLimit = ''},
				// 代金券面额聚焦
				voucherFocus() {this.gInfoCash.value = ''},
				// 商家让利失焦
				valueBlur() {
					this.gInfoCash.value != '' ? this.gInfoCash.value = Number(this.gInfoCash.value).toFixed(2) : this.gInfoCash.value = 0;
				},
				goBack() {
					uni.switchTab({
						url:'./home'
					})
				},
				// 开始时间
				getFromData(startTime) { this.gInfoCash.startTime = startTime },
				// 结束时间
				getToData(endTime) { this.gInfoCash.expireTime = endTime },
				valueDec() {
					if (this.gInfoCash.value >= 1) {
						if (this.gInfoCash.value - this.gInfoCash.storeSubsidy >= 1) {
							this.gInfoCash.value--
						} else {
							this.PopShowToastTips("代金券面额不能小于商家让利")
						}
					} else {
						this.gInfoCash.value = 0;
					}
				},
				storeSubsidyDec() {
					if (this.gInfoCash.storeSubsidy >= 1) {
						this.gInfoCash.storeSubsidy = floatSub(this.gInfoCash.storeSubsidy, 1);
					} else {
						this.gInfoCash.storeSubsidy = 0;
					}
				},
				numberLimit(e) {
	              console.log(e.target.value);
				  let  flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
	              if (e.target.value != '' && !flag) {
                      this.PopShowToastTips("只能输入整数")
	              }
				},
			},
			watch: {
				// 商家让利storeSubsidy与实际售价price的关系
				'gInfoCash.storeSubsidy': function (val) {
					if(this.gInfoCash.storeSubsidy - this.gInfoCash.value > 0){
						this.gInfoCash.storeSubsidy = this.gInfoCash.value;
					} else {
						// price实际售价 = value套餐总价 - 商家让利金额
						this.gInfoCash.price = this.gInfoCash.value - val;
					}
				},
				'gInfoCash.value': function (val) {
					this.gInfoCash.price = val - this.gInfoCash.storeSubsidy;
					this.gInfoCash.name = this.gInfoCash.value +'元代金券';
				},
				'gInfoCash.type': function (val) {
					this.gInfoCash.name = this.gInfoCash.value  +'元代金券';
				}
			}
		}
	</script>

<style lang="less" scoped>
	// !-- 主体部分开始 -->
	.flex-between{
		line-height: 30px;
		display: flex;
		justify-content: flex-start;
		.flex {
			display: flex;
			justify-content: space-between;
		}
		.title-style{
			width: 80px;
			line-height: 30px;
			font-size: 14px;
		}
		.monery-title{
			padding-left: 10px;
			line-height: 30px;
		}
		.flex-l{
			flex: 1;
			height:30px;
			margin-left: 10px;
			background:rgba(255,255,255,1);
			border-radius:5px;
			border: none;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border: 0;
			.radio-type{
				display: flex; 
				align-items: center;
				.radio-title{
					font-size: 0.75rem;
				}
			}
		}
		.voucherSub {
			width: 30px; 
			line-height: 30px;
			background-color: #ddd; 
			text-align: center;
			border-radius:4px 0px 0px 4px;
		}
		.voucher-input{
			text-align: center;
			width: 70px;
		}
		.voucherAdd {
			width: 30px; 
			line-height: 30px;
			background-color: #ddd; 
			text-align: center;
			border-radius:0px 4px 4px 0px;
		}
		.store-1 {
			width: 30px;
			height: 30px; 
			background-color: #ddd; 
			text-align: center; 
			border-radius:4px 0px 0px 4px;
		}
		.storesubsidy-input{
			width: 70px;
			line-height: 30px;
			.ipt{
				text-align: center; 
				border: none;
				width: 70px;
				height: 100%;
			}
		}
		.store-2 {
			width:30px;
			height: 30px;
			 background-color: #ddd; 
			 text-align: center; 
			 border-radius:0px 4px 4px 0px;
		}
	}
	.main{
		width: 100%;
		background:rgba(242,245,247,1);
		padding: 6px 2px;
		box-sizing: border-box;
		.new-produce{
			padding:6px;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius:10px;
			.flex{
				display: flex;
				font-size: 14px;
				.flex-btn{
					width: 50%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border:1px solid #ccc;
					border-radius: 5px;
					margin-left: 10px;
				}
			}
			.flex-top{
				margin-top: 10px;
			}
		}

		// <!-- 套餐类型开始 -->
		.package-type{
			padding: 10px 9px;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			.type{
				height: 60upx;
				width: 160upx;
				text-align: left;
				line-height: 60upx;
				font-size:14px;
				color:rgba(51,51,51,1);
				span:first-child{
					padding-right: 6px;
					color:rgba(255,62,62,1);
				}
			}
			.package-name{
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				flex: 1;
				width: 100%;
				margin-left: 20upx;
				border: none;
				.uni-input{
					font-size: 14px;
					line-height: 60upx;
					border: none;
				}
			}
			.date_item {
				float: left;
				width: 200upx;
				overflow: hidden;
				display: inline-block;
				text-align: center;
				border: 1px solid #ececec;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 14px;
				position: relative;
				border-radius: 6px;
				margin-left: 10px;
				input {
					height: 72rpx;
					.uni-input-placeholder {
						color: #b5b8c2;
					}
				}
			}
			.filter_inputline {
				float: left;
				margin: 0 4rpx;
				line-height: 72rpx;
			
				&:after {
					content: '—';
					font-size: 28rpx;
					color: #848b9a;
				}
			}
		}
		// <!-- 套餐类型结束 -->
		// <!-- 套餐详情开始 -->
		.package-details{
			background:rgba(255,255,255,1);
			border-radius:5px;
			box-sizing: border-box;
			margin-top: 8px;
			//新增商品存放的框框样式
			.new-goods{
				color:rgba(102,102,102,1);
				font-size:14px;
				display: flex;
				justify-content: space-between;
				.goods-name{
					flex: 1;
				}
				.goods-delete{
					width: 14px;height: 14px;
					img{
						width: 14px;
						height:14px;
					}
				}
			}
			//新增商品存放的框框样式
			.package-title{
				text-align: center;
				font-size:14px;
				font-weight:bold;
				line-height:16px;
				color:rgba(51,51,51,1);
				padding-top: 8px;
			}
			//商家让利方式提示信息
			.tips-message{
				text-align: center;
				font-size:10px;
				line-height:16px;
				color:rgba(154,154,154,1);
				padding-top: 8px;
			}
			.package-type{
				padding: 10px 0px;
			}
			.package-content{
				display: flex;
				.uni-column{
					flex: 1;
					padding: 6px;
					text-align: center;
					font-size:14px;
					color:rgba(102,102,102,1);
					.ipt{
						margin-top: 10px;
						background:rgba(255,255,255,1);
						border:1px solid rgba(221,221,221,1);
						border-radius:5px;
					}
				}
			}
			// 新增确定按钮
			.confirm-goods{
				width:26%;
				border-radius:5px;
				background:#FFA801;
				line-height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				color:rgba(255,255,255,1);
				margin: 10px auto;
			}
			// 新增按钮
			.new-btn{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:16px;
				font-weight:400;
				color:rgba(255,168,1,1);
				border-bottom: 1px solid rgba(221,221,221,1);
				padding: 0px 20px;
				line-height: 60px;
			}
			//套餐总价
			.total-price{
				padding: 5px;
				text-align: right;
				font-size:14px;
				color:rgba(102,102,102,1);
				border-top: 1px solid rgba(221,221,221,1);
				margin-top: 10px;
			}
		}
		// <!-- 套餐详情结束 -->
		/* //使用说明开始 */
		.instructions{
			padding: 8px;
			box-sizing: border-box;
			.instructions-title{
				font-size:14px;
				color:rgba(10,30,44,1);
				margin-top: 8px;
			}
			.instructions-type{
				display: flex;
				justify-content: center;
				align-items: center;
				width:96%;
				height:30px;
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				margin-left: 8px;
				box-sizing: border-box;
			}
			.template{
				width:100%;
				height: 150px;
				background:rgba(255,255,255,1);
				margin-top: 10px;
				padding: 8px;
				box-sizing: border-box;
				border-radius: 6px;
				overflow: hidden;
				overflow-y: scroll;
				border: 1px solid  rgba(221,221,221,1);
				.uni-textarea{
					overflow: hidden;
					.text-content{
						width: 100%;
						height: 100%;
						font-size: 14px;
						color:rgba(102,102,102,1);
					}
				}
						
			}
		}
	}
	// 清空样式
	   .container {
	        padding: 10px;
	    }
	
	    #editor {
	        width: 100%;
	        height: 300px;
	        background-color: #CCCCCC;
	    }
	

</style>
