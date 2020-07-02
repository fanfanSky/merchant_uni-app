<template name='sunui-upimg'>
	<view>
		<view class="sunsin_picture_list">
			<view v-for="(item,index) in upload_picture_list" :key="index" class="sunsin_picture_item">
				<image class="sunsin_width" :src="item.path" mode="aspectFill" :data-idx="index" @click="previewImgs" v-if="item.path_server == undefined"></image>
				<image class="sunsin_width" :src="item.path_server" mode="aspectFill" :data-idx="index" @click="previewImgs" v-else></image>
				<text class='del iconfont icon-shanchu' :class="'right'" @click='deleteImg' :data-url="item.path_server" :data-index="index">×</text>
			</view>
			<avatar
				:selWidth="imageWidth" :selHeight="imageHeight" :imageLength="upload_picture_list.length" :count="maxCount" @upload="myUpload" :avatarSrc="url"
				avatarStyle="width: 150upx; height: 150upx; border-radius: 100%;">
			</avatar>
		</view>
	</view>
</template>

<script>
	const aliconfig = require('./ali-oos/config.js'); //配置文件，在这文件里配置你的OSS keyId和KeySecret,timeout:87600;
	const base64 = require('./ali-oos/base64.js'); //Base64,hmac,sha1,crypto相关算法
	require('./ali-oos/hmac.js');
	require('./ali-oos/sha1.js');
	const Crypto = require('./ali-oos/crypto.js');
	import avatar from "../../components/yq-avatar/yq-avatar.vue";	
	export default {
		components: {avatar},
		data() {
			return {
				upload_picture_list: [],
				url: "../../static/logo.png"
			};
		},
		name: 'sunui-upimg',
		props: {
			maxCount:{
				type: Number
			},
			goodsImgs:{
				type: Array
			},
			goodsImgUrl:'',
			imageWidth:'',
			imageHeight:''
		},
		created() {
			if(this.goodsImgUrl != '' && this.goodsImgUrl != undefined) {
				// 已存在首页图片放入预览list
				this.upload_picture_list.push({path_server:this.goodsImgUrl});
			} else if (this.goodsImgs != undefined && this.goodsImgs.length > 0) {
				for (let item of this.goodsImgs) {
					// 已存在图片数组放入预览list
					this.upload_picture_list.push({path_server:item});
				}
			}
		},
		methods: {
			myUpload(rsp) {
				let imgObj = {"path": rsp.path};
				// 过滤多出的预览图片
				fImage(this, imgObj, aliconfig);
			},
			deleteImg(e) {
				dImage(e, this);
			},
			previewImgs(e) {
				puImage(e, this);
			},
		}
	}
	// 获取policy
	const getPolicyBase64 = () => {
		let date = new Date();
		date.setHours(date.getHours() + aliconfig.timeout);
		let srcT = date.toISOString();
		const policyText = {
			"expiration": srcT,
			"conditions": [["content-length-range", 0, 5 * 1024 * 1024]] //上传容量最大为5M
		};
		const policyBase64 = base64.encode(JSON.stringify(policyText));
		return policyBase64;
	}
	// 取得签名
	const getSignature = (_this, policyBase64) => {
		const accesskey = aliconfig.AccessKeySecret;
		const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {asBytes: true});
		const signature = Crypto.util.bytesToBase64(bytes);
		return signature;
	}
	// 上传文件
	const upload_file_server = async (_this, imgObj, config) => {
		// 文件名字编辑
		const aliyunFileKey = config.oosDirectory + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
		// 临时授权policy
		const policy = getPolicyBase64();
		// 签名
		const signature = getSignature(_this, policy);
		// 上传任务开始
		const upload_task = await uni.uploadFile({
			url: config.uploadImageUrl,
			filePath: imgObj.path,
			name: 'file',
			formData: {
				'key': aliyunFileKey,
				'policy': policy,
				'OSSAccessKeyId': config.OSSAccessKeyId,
				'signature': signature,
				'success_action_status': '200',
			},
			async success(res) {
				var self = this;
				if (res.statusCode == 200) {
					// 图片地址组装
					imgObj.path_server = config.uploadImageUrl + aliyunFileKey;
					_this.upload_picture_list.push(imgObj);
					console.log(`%c 阿里云上传(成啊哈姐):${imgObj.path_server}`, 'color:#1AAD19');
					await _this.$emit('onUpImg', imgObj.path_server);
					uni.hideLoading();
				} else {
					uni.showLoading({title: `上传失败!`});
					setTimeout(() => {uni.hideLoading();}, 2000);
					_this.upload_picture_list = [];
					console.warn(`阿里云上传图片失败,返回状态码:`, res.statusCode);
				}
			},
			async fail(err) {
				uni.showLoading({title: `上传失败!`});
				setTimeout(() => {uni.hideLoading()}, 2000);
				console.log(err);
			}
		});
	}
	// 删除图片(通用)
	const dImage = async (e, _this) => {
		// 删除内容通过事件传给父组件
		await _this.$emit('onImgDel', {url: e.currentTarget.dataset.url,index: e.currentTarget.dataset.index});
		_this.upload_picture_list.splice(e.currentTarget.dataset.index, 1);
	}
	// 过滤超出的图片以及上传(通用)
	const fImage = async (_this, imgObj, config) => {
		// 上传图片
		await upload_file_server(_this, imgObj, config);
		// 过滤超出部分的图片
		_this.upload_picture_list = _this.upload_picture_list.slice(0, _this.maxCount);
	}
	// 上传后预览(通用)
	const puImage = async (e, _this) => {
		let prevImgArr = [];
		for (let item of _this.upload_picture_list) {
			prevImgArr.push(item.path_server);
		}
		uni.previewImage({current: e.currentTarget.dataset.idx,urls: prevImgArr});
	}
</script>
<style scoped>
	@import url("iconfont");
	/* 
		2019-07-25 更改图标为字体图标
	*/
	.icon-text {
		font-size: 26upx;
	}
	/* 图片宽高+遮罩层宽高+遮罩层行高 */
	.sunsin_width {
		width: 110upx !important;
		height: 110upx !important;
		line-height: 110upx !important;
	}

	/* 循环列表样式 */
	.sunsin_picture_list {
		width: 100%;
		padding: 1%;
		display: flex;
		flex-wrap: wrap;
		text-align: center;
	}
	.sunsin_picture_list image {
		width: 200upx !important;
		height: 200upx !important;
		margin: 0 4%;
	}

	/* 添加图片样式 */
	.sunsin_add_image {
		color: #ddd;
		font-size: 144upx;
		text-align: center;
		line-height: 0 !important;
		margin: 2% 0 0 4%;
		background-color: #eee;
		cursor: pointer;
		border-radius: 8upx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	/* 预览图片 */
	.sunsin_picture_item {
		position: relative;
		margin: 20upx 21upx 0 0;
	}
	/* 删除按钮样式 */
	.sunsin_picture_item .del {
		position: absolute;
		color: #fff;
		border-radius: -4upx;
		border-top-right-radius: 6upx;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		z-index: 2;
		text-align: center;
		background-color: #E54D42;
	}
	/* 删除图标位置(上左) */
	.sunsin_picture_item .del.left {
		top: 0;
		left: 0;
		margin-left: 4%;
		border-top-right-radius: 0;
		border-top-left-radius: 6upx;
	}
	/* 删除图标位置(上右) */
	.sunsin_picture_item .del.right {
		top: 0;
		right: -4.2%;
	}
	/* 删除图标位置(下左) */
	.sunsin_picture_item .del.bleft {
		bottom: 0;
		left: 4%;
		border-top-left-radius: 0;
		border-bottom-left-radius: 6upx;
	}
	/* 删除图标位置(下右) */
	.sunsin_picture_item .del.bright {
		right: -4.2%;
		bottom: 0;
		border-top-right-radius: 0;
	}
	/* 自定义添加图片样式 */
	.sunsin_picture_item image {
		box-shadow: 6upx 6upx 12upx rgba(112, 128, 144, 0.7);
		border-radius: 15upx;
	}
</style>