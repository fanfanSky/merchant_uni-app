<template>
	<div class="home">
		<!-- 主体部分开始 -->
		<div class="main">
			<!-- 套餐详情开始 -->
			<div class="package-details" style="margin-top: 0px;">
				<div class="package-title">套餐详情</div>
				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>套餐名称</span>
					</div>
					<div class="package-name">
						<div class="uni-column">
							<input class="uni-input" v-model="gInfoNew.name" maxlength="30" placeholder="如：招牌双人套餐" @input="mealsInput" @focus="mealsFocus" />
						</div>
					</div>
				</div>
				<p class="package-name-hint" v-show="isShowMealNameHint">*亲!您输入的套餐名太长了哟~</p>
				<p class="package-name-hint" v-show="isShowMealNameEmptyHint">*亲!套餐名要填一下下哟~</p>
				<div>
					<div class="package-content">
						<div class="uni-column uni-big">
							<div class="title">商品名称</div>
							<div class="ipt">
								<input @focus="nameFocus" class="uni-input" maxlength="10" v-model="newFoods.name" />
							</div>
						</div>
						<div class="uni-column">
							<div class="title">数量</div>
							<div class="ipt">
								<!-- 数量上限4位数 -->
								<input @focus="numFocus" maxlength="4" type="number" class="uni-input" v-model.number="newFoods.num" />
							</div>
						</div>
						<div class="uni-column">
							<div class="title">单价</div>
							<div class="ipt">
								<!-- 单价上限6位数 -->
								<input @focus="priceFocus" @blur="newFoodsPriceBlur" maxlength="5" type="number" class="uni-input" v-model.number="newFoods.price" />
							</div>
						</div>
					</div>
				</div>
				<!-- 新增按钮 -->
				<div class="confirm-goods">
					<div @click="addGoods()">
						<span>确定</span>
					</div>
				</div>
				<!-- //新增的套餐内的商品位置-->
				<div class="new-goods" v-for="(item,index) in gInfoNew.foods" :key="index">
					<div class="goods-name">{{item.name}}</div>
					<div class="goods-name">{{item.num}}份</div>
					<div class="goods-name">￥{{item.price | foodCardFilter }}</div>
					<div class="goods-delete" @click="delFoods(index)">
						<img src="static/home/delete-1.png" alt="">
					</div>
				</div>
				<!-- 套餐总价 -->
				<div class="total-price">
					<span>
						套餐总价:
					</span>
					<span>
						￥{{gInfoNew.value | foodCardFilter}}
					</span>
				</div>
			</div>
			<!-- 套餐详情结束 -->
			<!-- 优惠方式开始 -->
			<div class="preferential-method package-details">
				<div class="package-title">优惠方式</div>
				<div class="tips-message">
					商家让利和商家折扣请二选一进行填写
				</div>
				<div class="method-detail">
					<radio-group>
						<!-- 商家让利 -->
						<radio value="2" @click="subsidyChecked" :checked="gInfoNew.benefitMethod == 1" color="#ffa801">
							<div class="flex-between">
								<div class="title-style">商家让利:</div>
								<div class="flex title-right">
									<div class="store-1" @click="storeSubsidyDec">-</div>
									<div class="storesubsidy-input">
										<input v-model.number="gInfoNew.storeSubsidy" maxlength="10" @blur="storeSubsidyBlur()" @focus="surrenderFocus" class="ipt" type="number"/>
									</div>
									<div class="store-2" @click="gInfoNew.storeSubsidy++">+</div>
								</div>
								<span class="storesubsidy-style">元</span>
							</div>
						</radio>
						<!-- 商家折扣 -->
						<radio value="1" @click="numDiscountChecked" :checked="gInfoNew.benefitMethod == 2" color="#ffa801">
							<div class="flex-between">
								<div class="title-style">商家折扣:</div>
								<div class="flex title-right">
									<div class="store-1" @click="numDiscountDec">-</div>
									<div class="storesubsidy-input">
										<input class="ipt" v-model.number="gInfoNew.numDiscount" @blur="numDiscountBlur()" maxlength="4" @focus="numDiscountFocus" type="number"/>
									</div>
									<div class="store-2" @click="gInfoNew.numDiscount++">+</div>
								</div>
								<span class="storesubsidy-style">折</span>
							</div>
						</radio>
					</radio-group>
					<!-- 套餐总价 -->
					<div class="total-price">
						<span>
							实际售价:
						</span>
						<span>
							￥{{gInfoNew.price | foodCardFilter}}
						</span>
					</div>
				</div>
			</div>
			<!-- 优惠方式开始 -->
			<!-- 使用规范开始 -->
			<div class="specification-use package-details">
				<div class="package-title">使用规范</div>
				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>有效时间</span>
					</div>
					<view class="date_item">
						<dyDatePicker placeholder="开始日期" :childValue="gInfoNew.startTime" :minSelect="minSelect" :iconshow="false" @getData="getFromData">
						</dyDatePicker>
					</view>
					<view class="filter_inputline"></view>
					<view class="date_item">
						<dyDatePicker placeholder="结束日期" :minSelect="minSelect" :childValue="gInfoNew.expireTime" :iconshow="false" @getData="getToData">
						</dyDatePicker>
					</view> 
				</div>
				<!-- 限购张数开始 -->
				<div class="package-type">
					<div class="type">
						<span></span>
						<span class="limitNum">限购张数</span>
					</div>
					<div class="package-time time-left"  style="width:100px;">
						<div class="time-input">
							<input type="number" placeholder="不限" maxlength="4" v-model.number="gInfoNew.buyTimeLimit" @blur="numberLimit" @focus="limitFocus" />
						</div>
					</div>
					<span class="time-instrution">默认不限，可点击修改</span>
				</div>
				<!-- 限购张数结束 -->
				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>需预约</span>
					</div>
					<div class='time-left'>
						<checkbox-group @change="checkboxChange">
							<label>
								<checkbox :checked="gInfoNew.needReserve == 1" />
							</label>
							<span class="time-instrution">默认免预约，勾选进行更改</span>
						</checkbox-group>
					</div>
				</div>
			</div>
			<!-- 使用规范结束 -->
			<!-- 使用说明 开始-->
			<div class="instructions package-details">
				<div class="instructions-title">
					<span class="required">*</span>
					使用说明
				</div>
				<div class="instructions-type">
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
						:placeholder="'请选择说明模板'"
						@changeItem="changContent">
					</useExplain-select>
				</div>
				<!-- 点击对应的模板出现对应模板内容的地方 -->
				<div class="template">
					<div class="uni-textarea">
						<textarea auto-height maxlength="1000" v-model="gInfoNew.mDesc" class="text-content" placeholder="请填写说明或者选择说明模板" />
					</div>
				</div>
			</div>
			<!-- 使用说明 结束-->
			<!-- //首页图片开始 -->
			<view class="select">
				<view class="type">
					<span class="required">*</span>
					<span class="phone-index">首页图片</span>
				</view>
				<view class="uploads">
					<view class='upload-image-view'>
						<uploadProductsImgs class="ossFrame" :imageWidth="homeImgWidth" :imageHeight="homeImgHeight" :maxCount=1
							@onUpImg="upHomeOosData" @onImgDel="delHomeImgInfo" ref="uImage">
						</uploadProductsImgs>
					</view>
				</view>
			</view>
			<!-- 首页图片结束 -->
			<!-- //商品图片开始 -->
			<div class="select">
				<div class="type">
					<span class="required">*</span>
					<span class="phone-index">商品图片</span>
				</div>
				<!-- 上传图片开始 -->
				<div class="uploads">
					<div class='upload-image-view'>
						<uploadProductsImgs class="ossFrame" :imageWidth="imageWidth" :imageHeight="imageHeight" :maxCount=9 :goodsImgs = "gInfoNew.imgUrlList"
							@onUpImg="upOosData" @onImgDel="delImgInfo" ref="uImage">
						</uploadProductsImgs>
					</div>
					<div class='info'>上传商品/菜品图片，您还可上传{{9 - gInfoNew.imgUrlList.length}}张。</div>
				</div>
				<!-- 上传图片结束 -->
			</div>
			<!-- 商品图片结束 -->
		</div>
		<!-- 按钮 -->
		<div class="btn3">
			<span class="btn-r"  @click="confirmCreateGood">确定上架</span>
		</div>
		<!-- 主体部分结束 -->
	</div>
</template>

<script>
	import useExplainSelect from '../../components/useExplain-select/useExplain-select.vue'  //导入下拉列表插件
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import {createGood,getEditGoods} from "../../api/goodsApi";
	import {getTemplateList} from "../../api/authApi.js";
	import {mapState} from 'vuex'
	import dyDatePicker from '../../components/dy-Date/dy-Date.vue'
	import {floatSub} from '../../util/precision.js'
	export default {
			computed: {
			    ...mapState([
			        'storeInfo',    // 商家信息
					'gInfoNew'	// 商品信息
			    ]),
				minSelect:function () {
				  return (Date.parse(new Date()) / 1000).toString();
				}
			},
			components: {
				 uniNavBar, useExplainSelect, dyDatePicker
			},
			props:{
				selectedIndex:''
			},
			created() {
				// 加载说明模板数据：1为代金券 2.为套餐
				getTemplateList(2, this.storeInfo.id).then(res=>{
					this.informationTemplate = res.data   // 得到模板数据
					// 清空模板数组
					this.templatesList = [];
					for (let i = 0; this.informationTemplate != null && i < this.informationTemplate.length; i++) {
						this.templatesList.push(this.informationTemplate[i].templatesName);
					}
					//模板默认显示第一个
					if (this.informationTemplate != null && this.informationTemplate.length != 0) {
						if (this.selectedIndex != '' && this.selectedIndex != undefined) {
							this.initTemplatesName = this.informationTemplate[this.selectedIndex].templatesName;
							this.gInfoNew.mDesc = this.informationTemplate[this.selectedIndex].templatesContent;
						} else {
							this.initTemplatesName = this.informationTemplate[0].templatesName;
							this.gInfoNew.mDesc = this.informationTemplate[0].templatesContent;
						}
					}
				})
				// 时间初始化
				if (this.gInfoNew.startTime == undefined) {
					this.gInfoNew.startTime = this.minSelect;
				}
				if (this.gInfoNew.expireTime == undefined) {
					this.gInfoNew.expireTime = this.minSelect;
				}
			},
			data() {
				return {
					// 首页图片宽度高度
					homeImgWidth:'700upx',
					homeImgHeight:'700upx',
					// 商品图片宽度高度
					imageWidth:'700upx',
					imageHeight:'500upx',
					// 模板列表的数组
					templatesList: [],
					// 初始化模板名称
					initTemplatesName:'',
					// 商品类型 1.代金券 2.套餐
					goodsType:'2',
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
					//新添加的商品
					newFoods:
						{
							name: '',//套餐名称小分类
							price: '',//菜品价格价格
							num: '',//菜品数量
							totalPrice: 0, //菜品总价格
						},
					isShowMealNameHint: false,       // 是否显示提示套餐名太长 					
					isShowMealNameEmptyHint: false,  // 是否显示提示套餐名为空	
				}
			},
			methods: {
				// 选中商家让利
				subsidyChecked() {
					this.gInfoNew.benefitMethod = 1;
					this.gInfoNew.price = this.gInfoNew.value - this.gInfoNew.storeSubsidy;
				},
				// 选中折扣
				numDiscountChecked() {
					this.gInfoNew.benefitMethod = 2;
					this.gInfoNew.price = Number(this.gInfoNew.value * this.gInfoNew.numDiscount / 10).toFixed(2);
				},
				// 套餐输入侦听
				mealsInput(){
					if(this.gInfoNew.name.length >= 30){
						this.isShowMealNameHint = true
					} else {
						this.isShowMealNameHint = false
					}
				},
				// 套餐输入聚焦侦听
				mealsFocus(){
					this.isShowMealNameEmptyHint = false
				},
				//确认新增方法
				confirmCreateGood(){
					if(this.gInfoNew.name.trim().length == 0){
						this.PopShowToastTips('请填写套餐名称');
						return
					} else if(this.gInfoNew.name.trim().length >= 30){
						this.isShowMealNameHint = true
						return;
					} else if (this.gInfoNew.price <= 0) {
						this.PopShowToastTips('售价必须大于0');
						return;
					} else if(this.gInfoNew.startTime.length <= 0){
						this.PopShowToastTips('开始日期不能为空哦');
						return
					} else if(this.gInfoNew.expireTime.length <= 0){
						this.PopShowToastTips('结束日期不能为空哦');
						return
					}else if(this.gInfoNew.startTime == this.gInfoNew.expireTime){
						this.PopShowToastTips('开始日期不能等于结束日期');
						return
					}
					else if(this.gInfoNew.startTime > this.gInfoNew.expireTime){
						this.PopShowToastTips('开始日期不能大于结束日期');
						return
					} else if(this.gInfoNew.buyTimeLimit != '' && this.gInfoNew.buyTimeLimit == 0 ){
						console.log('this.gInfoNew.buyTimeLimit===',this.gInfoNew.buyTimeLimit)
						this.PopShowToastTips('限购张数不能等于0哦');
						return
					} else if (this.gInfoNew.mDesc == '' || this.gInfoNew.mDesc.length == 0) {
						console.log('this.gInfoNew.mDesc===',this.gInfoNew.mDesc);
						this.PopShowToastTips('使用说明不能为空哦');
						return;
					} else if (this.gInfoNew.type == 2) {
						if (this.gInfoNew.imgUrl == '' || typeof(this.gInfoNew.imgUrl) == undefined) {
							this.PopShowToastTips('请选择首页图片');
							return;
						} else if (this.gInfoNew.imgUrlList.length == 0) {
							this.PopShowToastTips('请选择商品图片');
							return;
						}
					}
					this.gInfoNew.foodsJson = JSON.stringify(this.gInfoNew.foods);
					this.gInfoNew.storeId = this.$store.state.storeInfo.id;
					// 商家让利跟折扣不连动，但是需要最后把两个值都返回给后端，以用户的选择优先，处理后把最后的值传过去
					if (this.gInfoNew.benefitMethod == 1) {
						this.gInfoNew.price = this.gInfoNew.value - this.gInfoNew.storeSubsidy;
						this.gInfoNew.numDiscount = Number(this.gInfoNew.price / this.gInfoNew.value * 10).toFixed(2);
					} else if (this.gInfoNew.benefitMethod == 2) {
						this.gInfoNew.storeSubsidy = this.gInfoNew.value - this.gInfoNew.price;
					}
					// 添加商品请求
					createGood(this.gInfoNew).then(res => {
						//清空this.gInfoNew
						Object.keys(this.gInfoNew).forEach(key => (this.gInfoNew[key] = ''));
						this.gInfoNew.type = 2;
						this.gInfoNew.price = 0;
						this.gInfoNew.value = 0;
						this.gInfoNew.num = 0;
						this.gInfoNew.totalPrice = 0;
						this.gInfoNew.storeSubsidy = 0;
						this.gInfoNew.benefitMethod = "1";
						this.gInfoNew.needReserve = 0;
						this.gInfoNew.imgUrl = [];
						this.gInfoNew.foods = [];
						this.gInfoNew.imgUrlList = [];
						this.gInfoNew.imageLength = 9;
						this.PopShowToastTips('添加商品成功');
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						},1000);
					});
				},
				//需预约的点击事件
				checkboxChange() {
					if(this.gInfoNew.needReserve == 1){
						this.gInfoNew.needReserve = 0
					}else{
						this.gInfoNew.needReserve = 1
					}
				},
				//确定添加的商品的请求事件
				addGoods(){
					var self =this;
					if(this.gInfoNew.name == ''){
						this.PopShowToastTips('请填写套餐名称');
						return;
					}else if(this.newFoods.name == ''){
						this.PopShowToastTips('请填写商品名称');
						return;
					} else if(this.newFoods.num == '' && this.newFoods.num == 0){
						this.PopShowToastTips('数量不能为空');
						return;
					} else if(this.newFoods.price === ''){
						this.PopShowToastTips('请填写单价');
						return;
					} else {
						// 计算： 新增商品的数量 * 新增商品的单价 = 新增商品的总价格
						this.newFoods.totalPrice = this.newFoods.num * this.newFoods.price;
						// gInfoNew.foods数组用来存放套餐新增商品信息
						this.gInfoNew.foods.push(this.newFoods);
						// 临时保持的商品数量以及价格，方便同样价格以及数量的商品不用需要重新输入
						let tmpNum = this.newFoods.num;
						let tmpPrice = this.newFoods.price;
						this.newFoods = {
							name: '',//套餐名称小分类
							price: tmpPrice,//菜品价格价格
							num: tmpNum,//菜品数量
							totalPrice: 0 //菜品总价格
						};
						this.gInfoNew.value = 0;
						for(let item of this.gInfoNew.foods){
							// 商品描述
							this.gInfoNew.foodDesc = item.name;
							this.gInfoNew.value += item.price * item.num;
						}
						return this.gInfoNew.price;
					}
				},
				//选择使用模板
				selectTypeChange(){
					for(let item of this.informationTemplate){
						this.gInfoNew.mDesc = item.templatesContent
					}
				},
				//点击模板时的事件
				changContent(res){
					//模板默认显示第一个
					this.gInfoNew.mDesc = this.informationTemplate[res.index].templatesContent;
				},
				// 删除商品：金额随商品变化
				delFoods(index) {
					// 待删除价格
					let delFoodPrice = this.gInfoNew.foods[index].price * this.gInfoNew.foods[index].num;
					// 删除foods对应index商品
					this.gInfoNew.foods.splice(index, 1);
					// // 删除价格后总价
					this.gInfoNew.value = this.gInfoNew.value - delFoodPrice;
				},
				//数量聚焦
				numFocus() {this.newFoods.num = ''},
				//价格聚焦
				priceFocus() {this.newFoods.price = ''},
				//商品名称聚焦
				nameFocus() {this.newFoods.name = '';},
				// 聚焦商家让利输入
				surrenderFocus() {this.gInfoNew.storeSubsidy = ''},
				// 商家让利失焦
				storeSubsidyBlur(e) {
					// 保留一位小数
					this.gInfoNew.storeSubsidy != '' ? this.gInfoNew.storeSubsidy = Number(this.gInfoNew.storeSubsidy).toFixed(2) : this.gInfoNew.storeSubsidy = 0;
				},
				// 输入折扣失焦
				numDiscountBlur() {
					// 保留一位小数
					this.gInfoNew.numDiscount != '' ? this.gInfoNew.numDiscount = Number(this.gInfoNew.numDiscount).toFixed(2) : this.gInfoNew.numDiscount = 0;
				},
				// 录入商品单价失焦
				newFoodsPriceBlur() {
					// 保留一位小数
					this.newFoods.price != '' ? this.newFoods.price = Number(this.newFoods.price).toFixed(2) : this.newFoods.price = 0;
				},
				// 限购张数聚焦
				limitFocus() {this.gInfoNew.buyTimeLimit = ''},
				// 代金券面额聚焦
				voucherFocus(){this.gInfoNew.value = ''},
				// 输入折扣聚焦
				numDiscountFocus(){this.gInfoNew.numDiscount = ''},
				goBack() {
					//清空this.gInfoNew
					Object.keys(this.gInfoNew).forEach(key => (this.gInfoNew[key] = ''));
					this.gInfoNew.type = 2;
					this.gInfoNew.price = 0;
					this.gInfoNew.value = 0;
					this.gInfoNew.num = 0;
					this.gInfoNew.totalPrice = 0;
					this.gInfoNew.storeSubsidy = 0;
					this.gInfoNew.benefitMethod = "1";
					this.gInfoNew.needReserve = 0;
					this.gInfoNew.imgUrl = [];
					this.gInfoNew.foods = [];
					this.gInfoNew.imgUrlList = [];
					this.gInfoNew.imageLength = 9;
					uni.reLaunch({url: '/pages/home/home'})
				},
				// 删除单张首页图片
				async delHomeImgInfo() {this.gInfoNew.imgUrl = '';},
				// 删除商品数组图片
				async delImgInfo(e) {
					this.gInfoNew.imgUrlList.splice(e.index, 1);
				},
				// 图片信息保存到imgUrl
				async upHomeOosData(imgUrl) {this.gInfoNew.imgUrl = imgUrl;},
				// 图片信息保存到data数组
				async upOosData(imgUrl) {
					this.gInfoNew.imgUrlList.push(imgUrl)
					console.log("当前图片",this.gInfoNew.imgUrlList)
					},
				// 开始时间
				getFromData(startTime) {
					this.gInfoNew.startTime = startTime-28800;
				},
				// 结束时间
				getToData(endTime) {
					this.gInfoNew.expireTime = endTime+57599;
				},
				numberLimit(e) {
					// 正则匹配正整数
					let  flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
	            		if (e.target.value != '' && !flag) {
                      	this.PopShowToastTips("限购张数只能输入整数")
	              }
				},
				storeSubsidyDec() {
					if (this.gInfoNew.storeSubsidy >= 1) {
						this.gInfoNew.storeSubsidy = floatSub(this.gInfoNew.storeSubsidy, 1);
					} else {
						this.gInfoNew.storeSubsidy = 0;
					}
				},
				numDiscountDec() {
					if (this.gInfoNew.numDiscount >= 1) {
						this.gInfoNew.numDiscount = floatSub(this.gInfoNew.numDiscount,1);
					} else {
						this.gInfoNew.numDiscount = 0;
					}
				},
			},
			watch: {
				//实际售价
				'gInfoNew.price': function (val) {
				    this.gInfoNew.totalPrice = val * this.gInfoNew.foods.num;
				},
				// 数量
				'gInfoNew.num': function (val) {
				    this.gInfoNew.totalPrice = val * this.gInfoNew.foods.price;
				},
				// 商家让利storeSubsidy与实际售价price的关系
				'gInfoNew.storeSubsidy': function (val) {
					if(this.gInfoNew.storeSubsidy > this.gInfoNew.value){
						// 大于实际售价时的操作
						this.gInfoNew.storeSubsidy = this.gInfoNew.value;
					} else {
						// price实际售价 = value套餐总价 - 商家让利金额
						this.gInfoNew.price = this.gInfoNew.value - this.gInfoNew.storeSubsidy;
					}
				},
				// 输入折扣与打多少折的关系
				'gInfoNew.numDiscount': function(val){
					if(this.gInfoNew.numDiscount > 10){
						this.gInfoNew.numDiscount = 10
					} else {
						// 实际售价
						this.gInfoNew.price = Number(this.gInfoNew.value * val / 10).toFixed(2);
					}
				},
				'gInfoNew.value': function (val) {
					this.gInfoNew.price = val - this.gInfoNew.storeSubsidy;
				}
			}
		}
	</script>
<style lang="less" scoped>
	// 必填小红心样式
	.required{
		 color:rgba(255,62,62,1);
		 padding-right: 6px;
		 font-size: 10px;
	}
	.phone-index{
		font-size:14px;
		color:rgba(51,51,51,1);
	}
	// !-- 主体部分开始 -->
	.main{
		width: 100%;
		background:rgba(242,245,247,1);
		padding: 8px;
		box-sizing: border-box;
		.new-produce{
			padding:10px 9px 10px 10px;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius:10px;
			.flex-between{
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
				.storesubsidy-inpu{
					width: 80px;
					line-height: 30px;
				}
			}
		}
		//图片上传样式
		.select {
			padding-left: 0;
			/* 第一套图片上传样式（内部图标相机） */
			.upload-image-view {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
			}
			.info{
				font-size: 12px;
				color: red;
			}
		}

		//图片上传样式结束	
		// <!-- 套餐类型开始 -->
		.package-type{
			padding: 10px 9px;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			.type{
				width: 80px;
				text-align: left;
				line-height: 30px;
				font-size:14px;
				color:rgba(51,51,51,1);
				span:first-child{
					padding-right: 6px;
					color:rgba(255,62,62,1);
				}
				.limitNum {
					margin-left: 6px;
				}
			}
			.package-name{
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				flex: 1;
				width: 100%;
				margin-left: 10px;
				input{
					padding-left: 18px;
					font-size: 14px;
					height: 30px;
				}
			}
			.date_item {
				width: 220upx;
				height: 60upx;
				overflow: hidden;
				display: inline-block;
				text-align: center;
				border: 1px solid #ececec;
				line-height: 60rpx;
				font-size: 14px;
				position: relative;
				border-radius: 6px;
				margin-left: 6px;
				input {
					height: 72upx;
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
		.package-name-hint{
			width: 100%;
			height: 12px;
			font-size: 12px;
			color: red;
			text-align: center;
			padding-left: 45px;
		}
		// <!-- 套餐类型结束 -->
		// <!-- 套餐详情开始 -->
		.package-details{
			background:rgba(255,255,255,1);
			border-radius:5px;
			box-sizing: border-box;
			margin-top: 10px;
			padding: 6px 8px 8px 8px;
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
					width: 14px;
					height: 14px;
					img{
						width: 100%;
						height:100%;
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
					font-weight:400;
					font-family:Source Han Sans CN;
					.uni-input{
						font-size: 14px;
					}
					.ipt{
						margin-top: 10px;
						background:rgba(255,255,255,1);
						border:1px solid rgba(221,221,221,1);
						border-radius:5px;
					}
				}
				.uni-big{
					flex: 2;
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
				font-size: 14px;
			}
			//套餐总价
			.total-price{
				padding: 5px;
				text-align: right;
				font-size:14px;
				font-family:Source Han Sans CN;
				color:rgba(102,102,102,1);
				border-top: 1px solid rgba(221,221,221,1);
				margin-top: 10px;
				span:last-child{
					padding-left: 10px;
					color:rgba(252,108,79,1);
				}
			}
		}
		// <!-- 套餐详情结束 -->
		// 优惠方式开始
		.preferential-method{
			padding: 0px 8px;
			box-sizing: border-box;
			background:rgba(255,255,255,1);
			border-radius:5px;
			.flex-between{
				padding-top: 10px;
				height: 30px;
				display: flex;
				flex-direction: space-between;
				font-size: 14px;
				color:rgba(51,51,51,1);
				.flex {
					display: flex;
					justify-content: space-between;
					background:rgba(255,255,255,1);
					border:1px solid rgba(221,221,221,1);
					border-radius:5px;
					line-height: 30px;
				}
				.title-style{
					width: 80px;
					font-size: 14px;
					color:rgba(51,51,51,1);
					line-height: 30px;
					margin-top: -3px;
				}
				.title-right{
					margin-left: 10px;
					.storesubsidy-input{
						.ipt{
							text-align: center; border: none;width: 70px;height: 100%;
						}
					}
				}
				// 商家让利多少元的样式
				.storesubsidy-style{
					padding-left: 10px;
					line-height: 30px;
				}

				.store-1,.store-2 {
					width: 30px;
					line-height: 30px;
					background-color: #ddd; 
					text-align: center; 
				}
			}
		}
	}
</style>
