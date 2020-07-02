<template>
	<view class="voucherDetail">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="商品详情"></uni-nav-bar>
			<v-voucherDetailModule :info="vInfo" :click-open="false" />
			<!-- 使用说明组件 -->
			<v-explain :m-desc="vInfo.mDesc" />
		</div>
	</view>
</template>

<script>
	import voucherDetailModule from './voucherDetailModule'
	import useExplain from './useExplain'
	import {mapState} from 'vuex'

	export default {
		components:{
			"v-voucherDetailModule": voucherDetailModule,
			"v-explain": useExplain
		},
		computed: {
			...mapState([
				'vInfo'
			])
		},
		data() {
			return {

			}
		},
		created() {
			var self = this;

		},
		methods:{
			goBack() {
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	
</style>
