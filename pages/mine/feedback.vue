<template>
	<view class="feedback">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()"></uni-nav-bar>
			<p class="feedback-text">请输入您需要反馈的问题：</p>
			<textarea class="input-feedback" maxlength="500" rows="20" cols="20" placeholder="文字输入" v-model="commentValue" />
			<button class="submit-feedback" @click="createFeedBack()">提交反馈</button>
		</div>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import {feedBack} from "../../api/authApi.js"
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				commentValue: ''
			}
		},
		methods:{
			goBack() {
				uni.navigateBack({
					delta: 1    // 返回多少个页面
				})
			},
			createFeedBack(){
				// 添加意见反馈
				feedBack(this.commentValue).then(res=>{
					uni.showToast({
						title: '问题已反馈',
						duration: 1000
					});
					setTimeout(function(){
						uni.navigateBack({
							delta:1
						})
					},1500)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.feedback-text {
		font-size:16px;
		font-family: 'Source Han Sans CN';
		font-weight:400;
		line-height:18px;
		color:rgba(10,30,44,1);
		padding-left: 15px;
		margin-top: 10px;
		margin-bottom: 17px;
	}
	.input-feedback {
		width: 85%;
		height: 500upx;
		background:rgba(242,245,247,1);
		border-radius:0px 20px 0px 20px;
		margin: auto;
		padding-left: 17px;
		padding-top: 10px;
		font-size:14px;
		font-family: 'Source Han Sans CN';
		font-weight:400;
		line-height:18px;
		color:rgba(102,102,102,1);
	}
	.submit-feedback {
		height: 49px;
		margin: 0 16px;
		margin-top: 50px;
		background:rgba(255,168,1,1);
		font-size:16px;
		font-family: 'Source Han Sans CN';
		font-weight:400;
		line-height: 49px;
		color:rgba(255,255,255,1);
	}
</style>
