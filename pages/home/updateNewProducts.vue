<template>
	<div class="home">
		<div class="home-top">
			<div class="top"></div>
			<!-- 顶部导航栏 开始-->
			<uni-nav-bar left-icon="back"  left-text="返回" @clickLeft="goBack()" title="编辑商品" ></uni-nav-bar>
		</div>
		<!-- 主体部分开始 -->
		<div class="main">
			<!-- 套餐详情开始 -->
			<div class="package-details" v-if="gInfoUp.type == 2">
				<div class="package-title">套餐详情</div>
				<div class="package-type">
					<div class="type">
						<span>*</span><span>套餐名称</span>
					</div>
					<div class="package-name">
						<div class="uni-column">
							<input class="uni-input-meals" @input="mealsInput" v-model="gInfoUp.name" placeholder="如：招牌双人套餐" />
						</div>
					</div>
				</div>
				<div>
					<div class="package-content">
						<div class="uni-column" style="flex: 2;">
							<div class="title">商品名称</div>
							<div class="ipt">
								<input @focus="nameFocus" style="font-size: 14px;" maxlength="10" v-model="newFoods.name" />
							</div>
						</div>
						<div class="uni-column">
							<div class="title">数量</div>
							<div class="ipt">
								<input @focus="numFocus" type="number" style="font-size: 14px;" v-model.number="newFoods.num" />
							</div>
						</div>
						<div class="uni-column">
							<div class="title">单价</div>
							<div class="ipt">
								<input @focus="priceFocus" @blur="newFoodsPriceBlur" type="number" style="font-size: 14px;" v-model.number="newFoods.price" />
							</div>
						</div>
					</div>
				</div>
				<!-- 新增按钮 -->
				<div class="confirm-goods">
					<div  @click="addGoods()" style="font-size: 14px;">
						<span>确定</span>
					</div>
				</div>
				<!-- //新增商品之后的位置放在此处 -->
				<div class="new-goods" v-for="(item,index) in gInfoUp.foods" :key="index">
					<div class="goods-name">{{item.name}}</div>
					<div class="goods-name">{{item.num}}份</div>
					<div class="goods-name">￥{{item.price}}</div>
					<div class="goods-delete" @click="delFoods(index)" >
						<img src="static/home/delete-1.png" alt="" >
					</div>
				</div>
				<!-- 套餐总价 -->
				<div class="total-price">
					<span>套餐总价:</span>
					<span>
						￥{{gInfoUp.value | foodCardFilter}}
					</span>
				</div>
			</div>
			<!-- 套餐详情结束 -->
			<!-- 优惠方式开始 -->
			<div class="preferential-method package-details" v-if="gInfoUp.type == 2">
				<div class="package-title">优惠方式</div>
				<div class="method-detail">
					<radio-group>
						<!-- 商家让利 -->
						<radio value="2" @click="subsidyChecked" :checked="gInfoUp.benefitMethod == 1" color="#ffa801">
							<div class="flex-between flex">
								<div class="title-style">商家让利:</div>
								<div class="flex-btn flex title-right">
									<div class="store-1" @click="storeSubsidyDec">-</div>
									<div class="storesubsidy-input">
										<input class="ipt" maxlength="6" type="number" v-model.number="gInfoUp.storeSubsidy" @blur="storeSubsidyBlur()" @focus="surrenderFocus" />
									</div>
									<div class="store-2" @click="gInfoUp.storeSubsidy++">+</div>
								</div>
								<span class="storesubsidy-style">元</span>
							</div>
						</radio>
						<!-- 商家折扣 -->
						<radio value="1" @click="numDiscountChecked" :checked="gInfoUp.benefitMethod == 2" color="#ffa801">
							<div class="flex-between flex">
								<div class="title-style">商家折扣:</div>
								<div class="flex-btn flex title-right">
									<div class="store-1" @click="numDiscountDec">-</div>
									<div class="storesubsidy-input">
										<input class="ipt" @blur="numDiscountBlur()" maxlength="4" v-model.number="gInfoUp.numDiscount" @focus="numDiscountFocus" type="number"/>
									</div>
									<div class="store-2" @click="gInfoUp.numDiscount++">+</div>
								</div>
								<span class="storesubsidy-style">折</span>
							</div>
						</radio>
					</radio-group>
					<!-- 套餐总价 -->
					<div class="total-price">
						<span>实际售价:</span>
						<span class="price">￥{{gInfoUp.price | foodCardFilter}}</span>
					</div>
				</div>
			</div>
			<!-- 优惠方式结束 -->
			<!-- 使用规范开始 -->
			<div class="specification-use package-details">
				<div class="package-title">使用规范</div>
				<div class="package-type">
					<div class="type">
						<span>*</span>
						<span>有效时间</span>
					</div>
					<view class="date_item" >
						<dyDatePicker placeholder="起始日期" :childValue="gInfoUp.startTime" :minSelect="minSelect" :iconshow="false" @getData="getFromData">
						</dyDatePicker>
					</view>
					<view class="filter_inputline"></view>
					<view class="date_item">
						<dyDatePicker placeholder="结束日期" :childValue="gInfoUp.expireTime" :minSelect="minSelect" :iconshow="false" @getData="getToData">
						</dyDatePicker>
					</view>
				</div>
				<div class="package-type">
					<div class="type">
						<span></span>
						<span class="limitNum">限购张数</span>
					</div>
					<div class="package-time time-left">
						<div class="time-input">
							<input type="number" placeholder="不限" maxlength="4" v-model.number="gInfoUp.buyTimeLimit" @blur="numberLimit" @focus="limitFocus" />
						</div>
					</div>
					<span class="time-instrution">默认不限，可点击修改</span>
				</div>
				<div class="package-type"  width="100px;">
					<div class="type"><span>*</span><span>需预约</span></div>
					<div class='time-left'>
						<checkbox-group  @change="checkboxChange">
							<label><checkbox :checked="gInfoUp.needReserve == 1"/></label>
							<span class="time-instrution">默认免预约，勾选进行更改</span>
						</checkbox-group>
					</div>

				</div>
			</div>
			<!-- 使用规范结束 -->
			<!-- 使用说明 开始-->
			<div class="instructions package-details">
				<div class="instructions-title">
					<span class="instructions-star">*</span><span>使用说明</span>
				</div>
				<div class="instructions-type" >
					<useExplain-select :list="list" :routeID="routeID" :goodsType="gInfoUp.type" :clearable="false" :showItemNum="5" 
						:listShow="false" :isCanInput="false" :style_Container="'height: 28px; font-size: 14px;color: #9A9A9A;text-align: center;'"
						:placeholder = "'请选择说明模板'" @changeItem = "changContent" :initTemplatesName="initTemplatesName">
					</useExplain-select>
				</div>
				<!-- 模板显示内容 -->
				<div class="template">
					<div class="uni-textarea">
						<textarea class="template-content" maxlength="1000" v-model="gInfoUp.mDesc" />
					</div>
				</div>
				<!-- //首页图片开始 -->
				<view class="select">
					<view class="type">
						<span class="select-type-star">*</span>
						<span class="select-type-name">首页图片</span>
					</view>
					<!-- 上传图片开始 -->
					<view class="uploads">
						<view class='upload-image-view'>
							<uploadProductsImgs class="ossFrame" :goodsImgUrl="gInfoUp.imgUrl" :imageWidth="homeImgWidth" :imageHeight="homeImgHeight"
								:maxCount=1 @onImgDel="delImgUrlInfo" @onUpImg="upOosImgUrl">
							</uploadProductsImgs>
						</view>
					</view>
					<!-- 上传图片结束 -->
				</view>
				<!-- 首页图片结束 -->
				<!-- //商品图片开始 -->
				<view class="select">
					<view class="type">
						<span class="select-type-star">*</span>
						<span class="select-type-name">商品图片</span>
					</view>
					<!-- 上传图片开始 -->
					<view class="uploads">
						<view class='upload-image-view'>
							<uploadProductsImgs class="ossFrame" :imageWidth="imageWidth" :imageHeight="imageHeight" :maxCount=9
								:goodsImgs="gInfoUp.imgUrlList" @onImgDel="delOriginImgInfo" @onUpImg="upOosData">
							</uploadProductsImgs>
							<view class='info'>上传商品/菜品图片，您还可上传{{9 - gInfoUp.imgUrlList.length}}张。</view>
						</view>
					</view>
					<!-- 上传图片结束 -->
				</view>
				<!-- 商品图片结束 -->
			</div>
			<!-- 使用说明 结束-->
			<!-- 按钮 -->
			<div class="btn"><button class="btn-r" @click="confirmCreateGood">确定修改</button></div>
		</div>
		<!-- 主体部分结束 -->
	</div>
</template>

<script>
	import useExplainSelect from '../../components/useExplain-select/useExplain-select.vue'  //导入下拉列表插件
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import {createGood,informationTemplate,getEditGoods} from "../../api/goodsApi";
	import {getTemplateList} from "../../api/authApi.js";
	import {mapState} from 'vuex'
	import dyDatePicker from '../../components/dy-Date/dy-Date.vue'
	import {floatSub} from '../../util/precision.js'
	export default {
	computed: {
		...mapState([
			'storeInfo',    // 商家信息
			'gInfoUp'//商品信息
		]),
		minSelect:function () {
		  return (Date.parse(new Date()) / 1000).toString();
		},
	},
	components: {
		 uniNavBar,useExplainSelect, dyDatePicker
	},
	data() {
		return {
			// 首页图片宽度高度
			homeImgWidth:'750upx',
			homeImgHeight:'750upx',
			// 商品图片宽度高度
			imageWidth:'750upx',
			imageHeight:'525upx',
			// 初始化模板列表名称
			initTemplatesName:'',
			// 已选择模板列表下标
			selectedIndex:'',
			//接收后端返回来的模板名称列表的数组
			list: [],
			// 1.新增商品，2.编辑商品
			routeID:'2',
			// 信息模板
			informationTemplate:[
				{
					id:'',//模板ID
					templatesName:'',//模板名称
					templatesContent:'',//模板内容
				}
			],
			//新添加的商品
			newFoods:{
				name: '',//套餐名称小分类
				price: '',//菜品价格价格
				num: '',//菜品数量
				totalPrice: 0, //菜品总价格
			},
			isShowMealNameHint: false,       // 是否显示提示套餐名太长
			
		};
	},
	created() {
		let self = this;
		if (this.gInfoUp.startTime == undefined) {
			this.gInfoUp.startTime = this.minSelect;
		}
		if (this.gInfoUp.expireTime == undefined) {
			this.gInfoUp.expireTime = this.minSelect;
		}
	},
	onLoad(defaultOptions) {
		this.selectedIndex = defaultOptions.selectedIndex;
		// 实际售价
		this.gInfoUp.price = this.gInfoUp.value - this.gInfoUp.storeSubsidy
		// 店铺ID
		this.gInfoUp.storeId = this.$store.state.storeInfo.id;
		// 菜品数组
		this.gInfoUp.foods = JSON.parse(this.gInfoUp.foodsJson);
		getTemplateList(this.gInfoUp.type,this.gInfoUp.storeId).then(res=>{
			// 得到模板数据
			this.informationTemplate = res.data
			if (this.informationTemplate != null) {
				for(let i=0;i < this.informationTemplate.length; i++){
					this.list.push(this.informationTemplate[i].templatesName);
				}
				//模板默认显示第一个
				if (this.informationTemplate != null && this.informationTemplate.length != 0) {
					if (this.selectedIndex != '' && this.selectedIndex != undefined) {
						this.initTemplatesName = this.informationTemplate[this.selectedIndex].templatesName;
						this.gInfoUp.mDesc = this.informationTemplate[this.selectedIndex].templatesContent;
					} else {
						this.initTemplatesName = this.informationTemplate[0].templatesName;
						this.gInfoUp.mDesc = this.informationTemplate[0].templatesContent;
					}
				}
			}
		})
	},
	methods: {
		// 选中商家让利
		subsidyChecked() {
			this.gInfoUp.benefitMethod = 1;
			this.gInfoUp.price = this.gInfoUp.value - this.gInfoUp.storeSubsidy;
		},
		// 选中折扣
		numDiscountChecked() {
			this.gInfoUp.benefitMethod = 2;
			this.gInfoUp.price = Number(this.gInfoUp.value * this.gInfoUp.numDiscount / 10).toFixed(2);
		},
		// 套餐输入侦听
		mealsInput(){
			if(this.gInfoUp.name.length >= 30){
				this.isShowMealNameHint = true
			} else {
				this.isShowMealNameHint = false
			}
		},
		//需预约的点击事件
		checkboxChange() {
			if(this.gInfoUp.needReserve == 1){
				this.gInfoUp.needReserve = 0
			}else{
				this.gInfoUp.needReserve = 1
			}
		},
		//确定添加的商品的请求事件
		addGoods(){
			// 添加商品验证
			if(this.gInfoUp.name.length == 0){
				this.PopShowToastTips('请填写套餐名称');
				return;
			}else if(this.newFoods.name.length == 0){
				this.PopShowToastTips('请填写商品名称');
				return;
			} else if(this.newFoods.num == ''){
				this.PopShowToastTips('数量不能为空');
				return;
			} else if(this.newFoods.num == 0){
				this.PopShowToastTips('数量不能为0');
				return;
			}
			else {
				// 计算： 新增商品的数量 * 新增商品的单价 = 新增商品的总价格
				this.newFoods.totalPrice = this.newFoods.num * this.newFoods.price;
				// gInfoUp.foods数组用来存放套餐新增商品信息
				this.gInfoUp.foods.push(this.newFoods);
				// 临时保持的商品数量以及价格，方便同样价格以及数量的商品不用需要重新输入
				let tmpNum = this.newFoods.num;
				let tmpPrice = this.newFoods.price;
				this.newFoods = {
					name: '',//套餐名称小分类
					price: tmpPrice,//菜品价格价格
					num: tmpNum,//菜品数量
					totalPrice: 0 //菜品总价格
				};
				this.gInfoUp.value = 0;
				// 计算总售价
				for(let item of this.gInfoUp.foods){
					// 商品描述
					this.gInfoUp.foodDesc = item.name;
					this.gInfoUp.value += item.price * item.num;
				}
				this.gInfoUp.foodsJson = JSON.stringify(this.gInfoUp.foods);
				return this.gInfoUp.price;
			}
		},
		//模板信息请求
		getInformationTemplate(){
			informationTemplate().then(res=>{this.informationTemplate = res.data})
		},
		//点击模板时的事件
		changContent(res){
			//模板默认显示第一个
			this.gInfoUp.mDesc = this.informationTemplate[res.index].templatesContent;
		},
		// 删除商品：金额随商品变化
		delFoods(index) {
			// 待删除价格
			let delFoodPrice = this.gInfoUp.foods[index].price * this.gInfoUp.foods[index].num;
			// 删除foods对应index商品
			this.gInfoUp.foods.splice(index, 1);
			// // 删除价格后总价
			this.gInfoUp.value = this.gInfoUp.value - delFoodPrice;
		},
		//确认修改方法
		confirmCreateGood(){
			// 首先判断售价是否大于0
			if(this.gInfoUp.name.trim().length >= 30){
				this.isShowMealNameHint = true
				return;
			} else if (this.gInfoUp.price <= 0) {
				this.PopShowToastTips('售价必须大于0');
				return;
			} else if(this.gInfoUp.startTime.length <= 0){
				this.PopShowToastTips('开始时间不能为空哦');
				return
			} else if(this.gInfoUp.expireTime.length <= 0){
				this.PopShowToastTips('结束时间不能为空哦');
				return
			} else if(this.gInfoUp.expireTime < this.gInfoUp.startTime){
				this.PopShowToastTips('结束时间不能早于开始时间');
				return
			} else if(this.gInfoUp.buyTimeLimit === 0){
				this.PopShowToastTips('限购张数不能等于0哦');
				return
			} else if (this.gInfoUp.mDesc == '' || this.gInfoUp.mDesc.length == 0) {
				this.PopShowToastTips('使用说明不能为空哦');
				return;
			} else if (this.gInfoUp.type == 2 && this.gInfoUp.imgUrl.length == 0) {
				this.PopShowToastTips('请选择首页图片');
				return;
			} else if (this.gInfoUp.type == 2 && this.gInfoUp.imgUrlList.length == 0) {
				this.PopShowToastTips('请选择商品图片');
				return;
			} else {
				// foods转换之后复制给foodsJson
				this.gInfoUp.foodsJson = JSON.stringify(this.gInfoUp.foods);
				this.gInfoUp.storeId = this.$store.state.storeInfo.id;
				// 商家让利跟折扣不连动，但是需要最后把两个值都返回给后端，以用户的选择优先，处理后把最后的值传过去
				if (this.gInfoUp.benefitMethod == 1) {
					this.gInfoUp.price = this.gInfoUp.value - this.gInfoUp.storeSubsidy;
					this.gInfoUp.numDiscount = parseFloat(this.gInfoUp.price / this.gInfoUp.value * 10).toFixed(2);
				} else if (this.gInfoUp.benefitMethod == 2) {
					this.gInfoUp.storeSubsidy = this.gInfoUp.value - this.gInfoUp.price;
				}
				// 添加商品请求
				getEditGoods(this.gInfoUp).then(res => {
					this.PopShowToastTips('修改成功');
					// 延迟跳转首页
					setTimeout(() => {uni.reLaunch({url: '/pages/home/home'})},1000);
				});
			}
		},
		//数量聚焦
		numFocus(){this.newFoods.num = ''},
		//价格聚焦
		priceFocus(){this.newFoods.price = ''},
		//商品名称聚焦
		nameFocus(){this.newFoods.name = ''},
		// 聚焦商家让利输入
		surrenderFocus() {this.gInfoUp.storeSubsidy = ''},
		// 限购张数聚焦
		limitFocus(){this.gInfoUp.buyTimeLimit = ''},
		// 代金券面额聚焦
		voucherFocus(){this.gInfoUp.value = ''},
		// 输入折扣聚焦
		numDiscountFocus(){this.gInfoUp.numDiscount = ''},
		// 商家让利失焦
		storeSubsidyBlur(e) {
			// 保留一位小数
			this.gInfoUp.storeSubsidy != '' ? this.gInfoUp.storeSubsidy = Number(this.gInfoUp.storeSubsidy).toFixed(2) : this.gInfoUp.storeSubsidy = 0;
		},
		// 输入折扣失焦
		numDiscountBlur() {
			// 保留一位小数
			this.gInfoUp.numDiscount != '' ? this.gInfoUp.numDiscount = Number(this.gInfoUp.numDiscount).toFixed(2) : this.gInfoUp.numDiscount = 0;
		},
		// 录入商品单价失焦
		newFoodsPriceBlur() {
			// 保留一位小数
			this.newFoods.price != '' ? this.newFoods.price = Number(this.newFoods.price).toFixed(2) : this.newFoods.price = 0;
		},
		goBack() {uni.reLaunch({url: '/pages/home/home'})},
		async delOriginImgInfo(e) {
			console.log('你删除的原图片地址为:', e, this.gInfoUp.imgUrlList.splice(e, 1));
		},
		async delImgUrlInfo(e) {
			this.gInfoUp.imgUrl = '';
		},
		// 上传返回保存到商品图片数组
		async upOosData(imgUrl) {
			// 图片信息保存到data数组
			this.gInfoUp.imgUrlList.push(imgUrl);
		},
		// 首页图片
		async upOosImgUrl(imgUrl) {
			this.gInfoUp.imgUrl = imgUrl;
		},
		// 开始时间
		getFromData(startTime) {
			this.gInfoUp.startTime = startTime;
		},
		// 结束时间
		getToData(endTime) {
			this.gInfoUp.expireTime = endTime;
		},
		numberLimit(e) {
			// 正则匹配正整数
			let  flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
            if (e.target.value != '' && !flag) {
               	this.PopShowToastTips("限购张数只能输入整数")
            }
		},
		storeSubsidyDec() {
			if (this.gInfoUp.storeSubsidy >= 1) {
				this.gInfoUp.storeSubsidy = floatSub(this.gInfoUp.storeSubsidy, 1);
			} else {
				this.gInfoUp.storeSubsidy = 0;
			}
		},
		numDiscountDec() {
			if (this.gInfoUp.numDiscount >= 1) {
				this.gInfoUp.numDiscount = floatSub(this.gInfoUp.numDiscount, 1);
			} else {
				this.gInfoUp.numDiscount = 0;
			}
		},
	},
	watch: {
		// 商家让利storeSubsidy与实际售价price的关系
		'gInfoUp.storeSubsidy': function (val) {
			// 选择商家让利时清空折扣
			if(this.gInfoUp.storeSubsidy > this.gInfoUp.value){
				// 大于实际售价时的操作
				this.gInfoUp.storeSubsidy = this.gInfoUp.value;
			} else {
				// price实际售价 = value套餐总价 - 商家让利金额
				this.gInfoUp.price = this.gInfoUp.value - this.gInfoUp.storeSubsidy;
			}
		},
		// 输入折扣与打多少折的关系
		'gInfoUp.numDiscount': function(val) {
			// 选择折扣时清空商家让利
			if(this.gInfoUp.numDiscount > 10){
				this.gInfoUp.numDiscount = 10
			} else {
				let tmpNumDiscount = 0;
				if (val != '') {
					tmpNumDiscount = parseFloat(val).toFixed(2);
				}
				// 实际售价
				this.gInfoUp.price = ( tmpNumDiscount * this.gInfoUp.value) / 10;
			}
		},
		'gInfoUp.value': function (val) {
			this.gInfoUp.price = val - this.gInfoUp.storeSubsidy;
		},
	}
}
</script>
<style lang="less" scoped>
	// !-- 主体部分开始 -->
	.home{
		.home-top{
			position: fixed;
			top: 0px;
			background-color:#FFFFFF;
			z-index: 9;
			left: 0px;
			right: 0px;
			.top{
				height: 30px;
				width: 100%;
				background-color: #FFFFFF;
			}
		}
	}
	.main{
		height: 100%;
		width: 100%;
		background:rgba(242,245,247,1);
		padding:0px 8px;
		box-sizing: border-box;
		margin-top: 80px;
		margin-bottom: 50px;
		.new-produce{
			padding:10px 9px 10px 10px;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius:10px;
			.flex-between{
				line-height: 30px;
				display: flex;
				flex-direction: space-between;
				.flex {
					display: flex;
					justify-content: space-between;
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
				}
				.voucherSub {
					width: 30px; 
					line-height: 30px;
					background-color: #ddd; 
					text-align: center;
					border-radius:4px 0px 0px 4px;
				}
				.voucherAdd {
					width: 30px; 
					line-height: 30px;
					background-color: #ddd; 
					text-align: center;
					border-radius:0px 4px 4px 0px;
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

			.flex{
				display: flex;
				font-size: 14px;
				.flex-btn{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-left:20px;
					border:1px solid #ccc;
					border-radius: 5px;
					button{
						display: flex;
						justify-content: center;
						align-items: center;
						width: 30px;
						height: 30px;
						text-align: center;
						border-radius:5px;
						border: none;
					}
					
				}
			}
		}
		.storesubsidy-input{
			.ipt{
				text-align: center; border: none;width: 70px;height: 100%;
			}
		}
		//图片上传样式
		.select {
			padding-left: 0;
			/* 第一套图片上传样式（内部图标相机） */
			.upload-image-view {
				width: 100%;
				margin: 20upx 0 20upx 0;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
			}
			.select-type-star {
				color:rgba(255,62,62,1);
				margin-right: 6px;
				font-size: 14px;
			}
			.select-type-name {
				font-size:14px;
				color:rgba(51,51,51,1);
			}
			
			.upload-image-view .title {
				width: 100%;
				font-family: PingFang-SC-Regular;
				font-size: 24upx;
				color: #4a4a4a;
				margin-bottom: 15upx;
				line-height: 100%;
			}
			 
			.upload-image-view .info {
				width: 100%;
				font-family: PingFang-SC-Regular;
				font-size: 24upx;
				color: #ff4259;
				height: 24upx;
				margin-top: 15upx;
				line-height: 24upx;
			}
			 
			.upload-image-view .image-view {
				height: 130upx;
				width: 130upx;
				position: relative;
				margin: 15upx 15upx 15upx 0upx;
				border-radius: 8upx;
			}
			 
			.upload-image-view .image-view image {
				height: 100%;
				width: 100%;
				border-radius: 8upx;
			}
			 
			.upload-image-view .image-view .del-btn {
				background-color: #f67371;
				border-radius: 50%;
				width: 25upx;
				height: 25upx;
				position: absolute;
				top: -12upx;
				right: -12upx;
				z-index: 2;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			 
			.upload-image-view .image-view .del-btn .baicha {
				display: inline-block;
				width: 20upx;
				height: 5upx;
				background: #fff;
				line-height: 0;
				font-size: 0;
				vertical-align: middle;
				-webkit-transform: rotate(45deg);
			}
			 
			.upload-image-view .image-view .del-btn .baicha:after {
				content: '/';
				display: block;
				width: 20upx;
				height: 5upx;
				background: #fff;
				-webkit-transform: rotate(-90deg);
			}
			 
			.upload-image-view .add-view {
				height: 115upx;
				width: 115upx;
				margin: 15upx 15upx 15upx 0upx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(255, 255, 255, 0.00);
				border: 3upx dashed #979797;
				border-radius: 8upx;
			}
			 
			/* 相机 */
			.upload-image-view .add-view .xiangji {
				height: 40upx;
				width: 48upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
			}
			.upload-image-view .add-view .xiangji .tixing {
				width: 10upx;
				height: 7upx;
				background-color: #fff;
				border-right: 10upx solid #fff;
				border-bottom: 7upx solid #b2b2b2;
				border-left: 10upx solid #fff;
			}
			.upload-image-view .add-view .xiangji .changfx {
				height: 32upx;
				width: 48upx;
				border-radius: 5%;
				background-color: #b2b2b2;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.upload-image-view .add-view .xiangji .changfx .yuan1 {
				height: 20upx;
				width: 20upx;
				border-radius: 50%;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.upload-image-view .add-view .xiangji .changfx .yuan2 {
				height: 10upx;
				width: 10upx;
				border-radius: 50%;
				background-color: #b2b2b2;
			}
			/* 第二套图片上传样式（内部图标 十字架）*/
			/* 十字架 */
			.upload-image-view .add-view .cross {
				height: 48upx;
				width: 48upx;
				display: flex;
				flex-wrap: wrap;
				position: relative;
			}
			.upload-image-view .add-view .cross .transverse-line {
				height: 100%;
				width: 48%;
				position: absolute;
				border-right: 3upx solid #5A5A5A;
				top: 0;
				left: 0;
			}
			.upload-image-view .add-view .cross .vertical-line {
				height: 48%;
				width: 100%;
				position: absolute;
				border-bottom: 3upx solid #5A5A5A;
				top: 0;
				left: 0;
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
				height: 30px;
				width: 80px;
				text-align: left;
				line-height: 30px;
				font-size:14px;
				font-weight:400;
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
				margin-left: 10px;
				border-radius: 6px;
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
			opacity:1;
			border-radius:5px;
			box-sizing: border-box;
			margin-top: 8px;
			padding: 0 10px;
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
			.uni-input-meals{
				padding-left: 18px;
				font-size: 14px;
				height: 30px;
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
				border-top: 1px solid rgba(221,221,221,1);;
				padding: 5px;
				text-align: right;
				font-size:14px;
				font-weight:400;
				color:rgba(102,102,102,1);
				border-top: 1px solid rgba(221,221,221,1);
				margin-top: 10px;
				span{
				}
			}
			.price{
				padding-left: 10px;
				color:rgba(252,108,79,1);
			}
		}
		// <!-- 套餐详情结束 -->
		// 优惠方式开始
		.preferential-method{
			padding: 10px 8px;
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
					height: 30px;
					font-size: 14px;
					color:rgba(51,51,51,1);
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
				}
				.voucherSub {
					width: 30px; 
					height: 30px;
					background-color: #ddd; 
					text-align: center;
					border-radius:4px 0px 0px 4px;
				}
				.voucherAdd {
					width: 30px; 
					height: 30px;
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
				.store-2 {
					width:30px;
					height: 30px;
					 background-color: #ddd; 
					 text-align: center; 
					 border-radius:0px 4px 4px 0px;
				}
			}
		}
		
		// 优惠方式结束
		//使用规范开始
		.specification-use{
			padding: 2px;
			.package-time{
				width:100px;
				height:30px;
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:6px;
				line-height: 30px;
			}
			
		}
		//使用规范结束
		//使用说明开始
		.instructions{
			padding: 8px;
			box-sizing: border-box;
			.instructions-title{
				font-size:14px;
				color:rgba(10,30,44,1);
				padding: 8px;
			}
			.instructions-star{
				color:rgba(255,62,62,1);padding-right: 6px;
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
				min-height:95px;
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				margin-top: 10px;
				padding: 8px;
				box-sizing: border-box;
				.template-content{
					font-size: 14px;color:rgba(102,102,102,1);width: 100%;
				}
			}
		}
		//使用说明结束
		//按钮
		.btn{
			width: 100%;
			position: fixed;
			bottom: 0px;
			display: flex;
			z-index: 888;
			justify-content: space-between;
			background:rgba(242,245,247,1);
			margin-left: -10px; z-index: 3;
			.btn-r{
				background:rgba(255,168,1,1);
				color: #fff;
				width: 75%;
			}
		}
	}
</style>
