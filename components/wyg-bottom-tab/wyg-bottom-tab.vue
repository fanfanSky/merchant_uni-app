<template>
	<view class="bottom-tab">
		<view class="bottom-tab-item" @click="changeTap(item)" v-for="(item,index) in tabList" :key="index">
			<image v-if="curTab==item.id" class="first-img" :src="item.imgOn"></image>
			<image v-if="curTab!=item.id" class="first-img" :src="item.imgOff"></image>
			<text :class="curTab==item.id?'text-position text-on':'text-position'">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"wyg-bottom-tab",
		props:{
			tabIndex: {
				//图片的尺寸
				type: String,
				default: "1"
			},
			tabListParent:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				curTab:1,
				tabList:[
					{id:1,name:"首页",imgOff:"../../static/img/bottom-tab-img/icon_01.png",imgOn:"../../static/img/bottom-tab-img/icon_01_f.png","url":"/pages/heritagemall/heritagemall"},
					{id:2,name:"分类",imgOff:"../../static/img/bottom-tab-img/icon_02.png",imgOn:"../../static/img/bottom-tab-img/icon_02_f.png","url":"/pages/heritagemall/cate"},
					{id:3,name:"购物车",imgOff:"../../static/img/bottom-tab-img/icon_03.png",imgOn:"../../static/img/bottom-tab-img/icon_03_f.png","url":"/pages/heritagemall/cart"},
					{id:4,name:"个人中心",imgOff:"../../static/img/bottom-tab-img/icon_04.png",imgOn:"../../static/img/bottom-tab-img/icon_04_f.png","url":"/pages/heritagemall/user"}
				]
				
			}
		},
		created(){
			this.curTab=new Number(this.tabIndex);
			if(this.tabListParent.length>0){
				this.tabList=this.tabListParent;
			}
		},
		methods: {
			$redirect(_url){
				uni.redirectTo({
					"url":_url
				})
			},
			
			changeTap(e){
				this.curTab=e.id;
				this.$redirect(e.url);
			}
			
		}
	}
	
</script>

<style lang="scss">
	.bottom-tab{
		position: fixed;
		background-color: #FDFDFD;
		left: 0%;
		bottom: 0%;
		width: 100%;
		height: 2.9rem;
		
		display: flex;
		align-items:center;
		justify-content:space-between;
		.bottom-tab-item{
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items:center;
			justify-content:center;
			
			.first-img{
				width: 1.5rem;
				height: 1.5rem;
			}
			.text-position{
				margin-top: 0rem;
				font-size: 0.6rem;
				// color: #757575;
				color: red;
			}
			.text-on{
				// color: #FFB400;
				color: blue;
			}
			
		}

		
	}
	
</style>
