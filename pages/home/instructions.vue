<template>
	<view class="voucherDetail">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" :right-text="changeText" @clickRight="selectAll()" title="使用说明"></uni-nav-bar>
		</div>
		<div style="margin-top: 90px;">
			<div class="tepleteme-style" v-for="(item, index) in list" :key="item.id">
				<checkbox-group @change="radioChange(item)" >
					<label   class="uni-list-cell uni-list-cell-pd radio-label" >
						<div>
							<checkbox :checked="item.state" :value="item.templatesContent" name="checkbox" color="orange" style="border: none;"/>
						</div>
						<div class="instructions-content">{{item.templatesContent}}</div>
					</label>
				</checkbox-group>
			</div>
		</div>
		<div class="btn3" @click="confirm">确认</div>
	</view>
</template>

<script>
import {commentTemplate} from "../../api/authApi.js";
import {mapState} from 'vuex'
import bus from '../../eventBus/bus.js'
export default {
	computed: {
	    ...mapState([
	        'storeInfo',    // 商家信息
			'useInstructionTemplate' // 编辑模板内容
	    ])
	},
   components: {  },  //注册为子组件
    data() {
        return {
			list:[],
			current: 0,
			prentList:[], //向父亲传递数组
			listReplace:[],    // list的别名
			changeText: "全选",
			templatesContentList:[],  // 模板内容列表
			clearTemplateContent:'123',  // 用于点击 添加说明 按钮时清除updateTemplate.vue的模板数据
			templateType:'',
			routeID:'',
			goodsType:'',
        }
    },
	onLoad(options) {
		// 模板类型
		this.templateType = options.templateType;
		// 商品类型
		this.goodsType = options.goodsType;
		// 来源页面
		this.routeID = options.routeID;
		// 去数字，逗号，换行符处理
		let tmpList = [];
		if (this.useInstructionTemplate.templatesContent != undefined) {
			tmpList = this.useInstructionTemplate.templatesContent.split("\r\n");
			// 判断传过来的值是否含空字符串
			if (tmpList.length != 0 && tmpList[0] == "") {
				// 若有空字符串,则把它删除，删除第一个
				tmpList.splice(0,1);
			}
		}
		console.log("tmpList====",tmpList)
		// 若未主动输入则执行下面这语句
		for (let item of tmpList) {
			console.log('tmpList====>',item);
			if (item.split(".")[1] == undefined) {
				this.templatesContentList.push(item);
			} else {
				this.templatesContentList.push(item.split(".")[1]);
			}
			
		}
		console.log("templatesContentList==========",this.templatesContentList)
		// 若主动输入之后再添加模板，则执行下面这语句
		// if(this.templatesContentList[0] == undefined){
		// 	for (let item of tmpList) {
		// 		this.templatesContentList.push(item);
		// 		console.log("循环过程看看==========11",this.templatesContentList)
		// 		// 如果第一个是undefined则删除这个值
		// 		if(this.templatesContentList[0] == undefined){
		// 			this.templatesContentList.splice(0,1);     // 将数组第一个元素删除
		// 		}
		// 		console.log("循环中处理完看看==========22",this.templatesContentList)
		// 	}
		// }
		
		// 进来之后判断是否全选，若全选把全选文字隐藏，显示取消全选
		this.getCommentTemplate();
	},
	methods:{
		//回退事件
		goBack() {
			uni.navigateBack({
				delta:1
			})
		},
		//全选事件
		selectAll() {
			if(this.changeText == '全选'){
				this.changeText = '取消全选'
				this.prentList = []
				for (let pro in this.list) {
					// 遍历将所有的选项都设为true
					this.list[pro].state = true
					this.prentList.push(this.list[pro].templatesContent)
				}
				console.log('prentList全部数据',this.prentList)
			} else {
				this.changeText = '全选'
				this.prentList = []
				for (let pro in this.list) {
					// 遍历将所有的选项都设为false
					this.list[pro].state = false
				}
				console.log("prentList空数据",this.prentList)
			}
		},
		//进来就获取公共商家商品说明模板
		getCommentTemplate(){
			commentTemplate(2).then(res=>{
				this.list = res.data
				this.prentList =  this.templatesContentList;
				console.log('prentList================',this.prentList)
				for (var pro in this.list) {
					for (let item of this.prentList) {
						if (this.list[pro].templatesContent == item) {
							console.log('pro================',pro)
							this.list[pro].state = true;
						};
					}
				};
				if(this.prentList.length >= this.list.length){
					this.changeText = '取消全选'
				}
			});
		},
		radioChange:function(item){
			item.state = !item.state;
			console.log("this.prentList======",this.prentList);
			console.log("item.templatesContent======",item.templatesContent);
			//单选事件
			// 找到则返回第一次出现的位置，若没找到返回-1
			if (item.state && this.prentList.indexOf(item.templatesContent) == -1) {
				// 判断数组是否存在该项，不存在添加勾选上并添加到prentList
				this.prentList.push(item.templatesContent);
			} else if (!item.state && this.prentList.indexOf(item.templatesContent) != -1) {
				// 判断数组是否存在该项，存在就取消勾选并从prentList移除
				this.prentList.splice(this.prentList.indexOf(item.templatesContent),1);
			}
			console.log("向父亲传递的数据",this.prentList);
		},
		confirm() {
			console.log("我要回去了====",this.prentList);
			this.useInstructionTemplate.templatesContent = '';
			for (let i = 0; i < this.prentList.length; i++) {
				// 模板内容 + 数字 + 句号开头 + 换行结尾
				if (i < this.prentList.length - 1) {
					this.useInstructionTemplate.templatesContent += i+1 + '.' + this.prentList[i] + '\r\n';
				} else {
					this.useInstructionTemplate.templatesContent += i+1 + '.' + this.prentList[i];
				}
			}
			if (this.templateType == 1) {
				uni.navigateTo({
					url: './templateAdd?goodsType=' + this.goodsType + '&routeID=' + this.routeID
				})
			} else if (this.templateType == 2) {
				uni.navigateTo({
					url: './updateTemplete?goodsType=' + this.goodsType + '&routeID=' + this.routeID
				})
			}
		}
	}
}
</script>

<style lang="less" scoped>
	.voucherDetail{
		width: 100%;
		background:rgba(255,255,255,1);
		.tepleteme-style{
			background-color: #FFFFFF;
			width: 100%;
			padding: 8px;
			margin-top: 10px;
			box-sizing: border-box;
			font-size:14px;
			.radio-label{
				display: flex;
				justify-content: flex-start;
				.instructions-content{
					margin-left: 16px;
					font-size:12px;
					font-family:Source Han Sans CN;
					font-weight:500;
					line-height:14px;
					color:rgba(10,30,44,1);
				}
			}
			.eadit-style{
				color: #00B1FF;
			}
		}
		.btn3{
			position: fixed;
			bottom: 0px;
			width:100%;
			background:rgba(255,168,1,1);
			font-size:16px;
			font-family:Source Han Sans CN;
			line-height:46px;
			color:rgba(255,255,255,1);
			text-align: center;
		}
	}
	
	
</style>
