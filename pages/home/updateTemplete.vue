<template>
	<view class="voucherDetail">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar class="main" left-icon="back" left-text="返回" @clickLeft="goBack()" right-icon="" title="编辑模板">
				<div class="icon-content">
					<div class="icon-main" @click="clear()">
						<img src="static/templates/clear.png" alt="" class="icon-style" >
						<span class="icon-title">一键清空</span>
					</div>
					<div class="icon-main" @click="savaTeplete()">
						<img src="static/templates/save.png" alt="" class="icon-style">
						<span class="icon-title">保存</span>
					</div>
				</div>
			</uni-nav-bar>
			<div class="tepleteme-style">
				<div style="text-align: center;display: flex;justify-content: center;align-items: center;">
					<input type="text" placeholder="请输入模板名称" v-model="useInstructionTemplate.templatesName">
					<img src="../../static/home/edit.png" alt="" style="margin-left: 10px;">
				</div>
				<div style="border:1px solid rgba(221,221,221,1);background:rgba(255,255,255,1);margin: 20px 0px;">
					<textarea v-model="useInstructionTemplate.templatesContent" style="width: 100%;height: 250px;"></textarea>
				</div>
				<div class="btn1" :selectedList="selectedList" @click="toInstructions">添加说明</div>
				<!-- 提示说明框 -->
				<div class="prompt-template">
					提示：可以点击添加说明找到已编辑好的使用说明，或者在输入框里填写自己的使用说明
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {Addtemplate,getTemplateEdit} from "../../api/authApi.js";
	import {mapState} from 'vuex'
	import bus from '../../eventBus/bus.js'
	export default {
		computed: {
			...mapState([
				'storeInfo',   // 商家信息
				'useInstructionTemplate' // 编辑模板内容
			])
		},
		components: {  },  //注册为子组件
		data() {
			return {
				placeholder: '请填写模板内容...',
				current: 0,
				routeID:'',
				goodsType:'',
				selectedList:[],
				templatesDB:'',
				templateType:'2', // 说明模板类型: 1.新建 2.编辑
			}
		},
		onLoad(options) {
			// 初始化页面来源ID
			this.routeID = options.routeID
			// 商品类型
			this.goodsType = options.goodsType
		},
		methods:{
			goBack() {
				uni.navigateBack({
					delta:1
				})
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			//添加使用说明事件
			toInstructions(){
				uni.navigateTo({
					url: './instructions?templateType='+ this.templateType + '&goodsType=' + this.goodsType + '&routeID=' + this.routeID
				});
			},
			// 清空操作
			clear() {
				this.useInstructionTemplate.templatesName = ''
				this.useInstructionTemplate.templatesContent = ''
			},
			//保存所编辑的模板
			savaTeplete(item){
				//1.先判断所编辑的内容是否为空
				if (this.useInstructionTemplate.templatesName.length == 0) {
					this.PopShowToastTips('请填写模板名称');
					return;
				}else if(this.useInstructionTemplate.templatesContent.length == 0){
					this.PopShowToastTips('模板内容不能为空');
					return;
				}else{
					let self = this;
					getTemplateEdit(this.useInstructionTemplate.id,this.useInstructionTemplate.templatesName,this.useInstructionTemplate.templatesContent).then(res=>{
						this.PopShowToastTips('保存成功');
						uni.navigateTo({
							url: './templateList?goodsType=' + self.goodsType + '&routeID=' + self.routeID
						})
					})
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.voucherDetail{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 100vh;
		background:rgba(255,255,255,1);
		.top-div{
			.main{
				.icon-content{
					position: absolute;
					right: 10px;
					display: flex;	
					.icon-main{
						display: flex;
						flex-direction: column;
						text-align: center;
						line-height: 30px;
						width: 50px;
						justify-content: center;
						align-items: center;
						.icon-style{
							width: 15px;
							height: 15px;
						}
						.icon-title{
							font-size: 10px;
							color:rgba(154,154,154,1);
						}
					}
				}
			}
			.tepleteme-style{
				background-color: #FFFFFF;
				width: 100%;
				padding: 16px;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				margin-top: 10px;
				box-sizing: border-box;
				font-size:14px;
				// 添加说明按钮
				.btn1{
					width:35%;
					background:rgba(255,168,1,1);
					font-size:16px;
					line-height:30px;
					text-align: center;
					background:rgba(255,168,1,1);
					border-radius:4px;
					margin: 0 auto;
				}
				// 提示说明框
				.prompt-template{
					width:100%;
					font-size:12px;
					line-height:20px;
					color:rgba(154,154,154,1);
					margin-top: 15px;
				}
			}
			
		}
	}
	
	
</style>
