<template>
	<view class="container">
		<imageCropper :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper" />
	</view>
</template>

<script>
import imageCropper from '../../components/imageCropper/imageCropper'
export default {
	components:{ imageCropper },
	data() {
		return {
			src: '',
			imageUrl: '', // 要裁剪的图片
			tailorUrl:'',  // 裁剪完之后的图片地址
		};
	},
	onLoad(options) {
		console.log("第二个页面拿到的图片地址",options.src)
		this.src = options.src || '';
		//如果从上个页面传值时可显示loading
		this.src &&
			uni.showLoading({
				title: '请稍候...',
				mask: true
			});
	},
	methods: {
		ready() {
			this.imageUrl = this.src;
			console.log("======",this.imageUrl)  // 本地的blob图片
		},
		cropper(e) {
			console.log("裁剪完成回传地址",e.url)
			this.tailorUrl = e.url
			//裁剪完成后处理逻辑
			uni.previewImage({
				current: '', // 当前显示图片的http链接
				urls: [e.url], // 需要预览的图片http链接列表
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
	}
};
</script>

<style lang="less" scoped>
	.tui-custom-bar {
		width: 100%;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		.tui-item-box {
			width: 100%;
			display: flex;
			align-items: center;
			color: #fff;
			font-size: 28rpx;
			justify-content: space-between;
			white-space: nowrap;
			padding-bottom: 12rpx;
		}
	}
</style>
