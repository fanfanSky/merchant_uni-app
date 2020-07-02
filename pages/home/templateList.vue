<template>
	<view class="voucherDetail">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="说明模板"></uni-nav-bar>
		</div>
		<div class="tepleteme-content">
			<div class="tepleteme-style" v-for="(item, index) in list" :key="index">
				<radio-group @change="radioChange(index)" >
					<label style="display: flex;justify-content: flex-start;" class="uni-list-cell uni-list-cell-pd" >
						<div>
							<radio :value="item.templatesName" :checked="index === current" color="orange" />
						</div>
						<div>{{item.templatesName}}</div>
					</label>
				</radio-group>
				<div>
					<span class="eadit-style" @click="TodeleteTemplate(item, index)">删除</span>
					<span class="eadit-style" @click="toTemplateEditing(item)" style="padding-left: 8px;">编辑</span>
				</div>
			</div>
		</div>
		<!-- 按钮 -->
		<div class="btn1" >
			<div class="btn-r"  @click="newTemplate">新建模板</div>
		</div>
	</view>
</template>
<script>
	//导入模板列表及删除模板的接口请求
	import {getTemplateList,deleteTemplate} from "../../api/authApi.js";
	import {mapState} from 'vuex'
	export default {
		components: {  },  //注册为子组件
		computed: {
			...mapState([
				'storeInfo',    // 商家信息
				'useInstructionTemplate' // 编辑模板内容
			])
		},
		data() {
			return {
				list:[],
				current: 0,
				routeID:'',
				goodsType:''
				}
			},
			onLoad(options) {
				// 初始化页面来源ID
				this.routeID = options.routeID
				// 商品类型
				this.goodsType = options.goodsType
				this.getAllTemplateList()
			},
			methods:{
				//请求模板列表的接口
				getAllTemplateList(){
					getTemplateList(this.goodsType,this.storeInfo.id).then(res=>{
						this.list = res.data;
					})
				},
				//回退事件
				goBack() {
					// routeID 1.新增商品 2.编辑商品
					if (this.routeID == '1') {
						// 返回值goodsType 1.代金券 2.套餐
					   uni.navigateTo({
						url: './newProducts?goodsType=' + this.goodsType
					   })
					} else if (this.routeID == '2') {
					   uni.navigateTo({
						url: './updateNewProducts?goodsType=' + this.goodsType
					   })
					}
				},
				//单选事件
				radioChange: function(index) {
					console.log("index==========",index)
					// routeID 1.为新增商品页面。2。为编辑商品。
					// goodsType 1为代金券 2为套餐 
					if (this.routeID == '1') {
						// 返回值goodsType 1.代金券 2.套餐 	evt.target.value已选择模板的名字
					   uni.navigateTo({
						url: './newProducts?goodsType=' + this.goodsType + '&selectedIndex=' + index
					   })
					} else if (this.routeID == '2') {
					   uni.navigateTo({
						url: './updateNewProducts?goodsType=' + this.goodsType + '&selectedIndex=' + index
					   })
					}
				},
				//点击进入到编辑模板页面
				toTemplateEditing(item){
					this.useInstructionTemplate.id = item.id;
					this.useInstructionTemplate.templatesName = item.templatesName;
					this.useInstructionTemplate.templatesContent = item.templatesContent;					uni.navigateTo({
						url: './updateTemplete?goodsType=' + this.goodsType + '&routeID=' + this.routeID
					})
					
				},
				//新建模板
				newTemplate(){
					// 清空暂存模板内容
					Object.keys(this.useInstructionTemplate).forEach(key => (this.useInstructionTemplate[key] = ''));
					uni.navigateTo({
						url: './templateAdd?goodsType=' + this.goodsType + '&routeID=' + this.routeID
					})
				},
				//删除模板接口请求
				TodeleteTemplate(item,index){
					console.log('item============',item);
					this.list.splice(index,1);
					deleteTemplate(item.id).then(res=>{
						console.log('删除成功item=========',item);
					})
					return
				}
			}
		}
</script>

<style lang="less" scoped>
	.voucherDetail{
		background-color: blue;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 100vh;
		background:rgba(242,245,247,1);
		.tepleteme-content{
			margin-top: 70px;
			padding-bottom: 50px;
		}
		.tepleteme-style{
			background-color: #FFFFFF;
			width: 100%;
			padding: 8px;
			display: flex;
			justify-content: space-between;
			margin-top: 10px;
			box-sizing: border-box;
			font-size:14px;
			.eadit-style{
				color: #00B1FF;
			}
		}
		.btn1{
			display: flex;
			justify-content: center;
			width:100%;
			background:rgba(255,168,1,1);
			font-size:16px;
			font-family:Source Han Sans CN;
			line-height:46px;
			color:rgba(255,255,255,1);
			position: fixed;
			bottom: 0px;
			text-align: center;
			z-index: 22;
			.btn-r{
				width: 75%;
			}
		}
	}
	
	
</style>
