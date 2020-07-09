<template>
	<div class="changeCommercialMsg">
		<div class="top-div">
		    <div class="top"></div>
		    <uni-nav-bar left-icon="back" left-text="返回" @clickLeft="goBack()" title="编辑商户信息"></uni-nav-bar>
		</div>
		<div class="top-changeMsg">
			<div class="CommercialMsg" style="margin-top: 60px;">
				<div class="MsgList">
					<!-- 商铺名称 -->
					<div class="commercialName">
						<span class="name-1">商铺名称</span>
						<div class="inputValue" >
							<div class="nowword" >
								{{storeInfo.name}}
							</div>
						</div>
					</div>
					<!-- 店铺地址 -->
					<div class="commercialName">
						<span class="name-1">店铺地址</span>
						<div  class="inputValue address-stytle">
							<input type="text" maxlength="50" v-model="formData.address" />
							<span class="openMap" @tap="openMap">
								<image src="@/static/openShop/mapLocation.png" mode=""></image>
							</span>
						</div>
					</div>
					<!-- 商铺简介 -->
					<div class="commercialName" style="height: auto;">
						<span class="name-1">商铺简介</span>					
						<div  class="inputValue">
							<input type="text" v-model="formData.mDesc" value=""  />
						</div>
					</div>
					<!-- 手机号码1 --> 
					<div class="commercialName" v-for="(item,i) in formData.contactPhones" :key="i" v-if="formData.contactPhones.length!=0">
						<span class="name-1">联系方式{{i+1}}</span>
						<div class="inputValue">
							<input class="relation" type="text" :value="item" style="margin-top: 2px;" disabled="true" />
							<img lazy-load mode="aspectFit" :fade-show="true" src="static/home/delete.png" width="15px" height="15px" @click="Clearevents(item)"/>
						</div>
					</div>
					<div v-if="showAddPhone">
						<div class="commercialName" style="border-bottom: 1px solid #C0C0C0;display: flex;">
							<span class="name-1">新增电话</span>
							<div class="inputValue" style="margin-left: 26px;">
								<input class="relation" type="text" v-model="newTel"  placeholder="请输入新增电话" />
							</div>
						</div>
						<div class="add-phone">
							<button  @click="conselPhone()">取消</button>
							<button class="btn" @click="confromPhone()">确认</button>
						</div>

					</div>
					<!-- 添加号码 -->
					<div style="margin: 10px;" class="flex-center" v-show="formData.contactPhones.length!=2">
						<div style="height:30px;" class="flex-center" @click="addNewPhone()">
							<div style="font-size:16px; font-weight:400; color:rgba(255,168,1,1);">
								增加新号码
							</div>
							<img lazy-load mode="aspectFit" :fade-show="true" src="static/home/add.png" width="17px" style="margin-left: 6px;" />
						</div>
					</div>
					<!-- 营业时间 -->
					<div class="business-hours" style="display: flex;">
						<span class="name">营业时间</span>
						<div class="time" style="margin-left: 25px;">
							<div class="uni-list">
								<div class="uni-list-cell">
									<div class="uni-list-cell-db">
										<picker mode="time" @change="bindTimeChange" @click="rotateLeft" @cancel="cancelSelectLeft">
											<div class="uni-input">{{formData.startTime}}</div>
										</picker>
										<!-- 小三角图标 -->
										<span :class="{icon_1: true, iconTrans_1:iconTrans_1}"></span>
									</div>
									<div>-</div>
									<div class="uni-list-cell-db"> 
										<picker mode="time" @change="bindEndTimeChange" @click="rotateRight" @cancel="cancelSelectRight">
											<div class="uni-input">{{formData.endTime}}</div>
										</picker>
										<!-- 小三角图标 -->
										<span :class="{icon_2: true, iconTrans_2:iconTrans_2}"></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 修改头像 -->
			<div class="in-store">
				<p class="in-store-text name">修改头像：</p>
				<div class="container">
					<image :src="formData.imgUrl" style="width: 100%;height: 100%"    />
				</div>
				<div class="upload-avatar">
					<avatar
						selWidth="750upx"
						selHeight="750upx"
						:imageLength="0"
						:count="1"
						:routID="1"
						@upload="myUpload"
						:avatarSrc="formData.imgUrl"
						avatarStyle="width: 100%;height: 100%; border-radius: 100%;">
					</avatar>
				</div>
			</div>
			<button class="submit-affirm" @click="confirmSubmit()">确认提交</button>
		</div>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	// 编辑商家信息
	import {inquire,businessEditor,uploadImg} from "../../api/merchantsPurseApi.js"
	import avatar from "../../components/yq-avatar/yq-avatar.vue";	
	export default {
		components: {
			avatar
		},
		computed: {
			//在vuex中拿取数据
		    ...mapState([
		        'storeInfo', 
				'balance',
				'oss'
		    ])
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				//测试用户头像字段
				UpataImg: [], //修改头像
				showImg:true, //显示没有修改头像后图片
				// showUpataImg:true,//是否展示更新后的头像
				imgType:3, 
				imgCount:'',
				//测试用户头像字段
				newTel:[],  //存收新增电话的数组
				formData:{
						mDesc:'',     //店铺简介 String类型
						imgUrl:'',    //商铺图片 String类型
						contactPhones:[], // 联系方式 应为String类型
						endTime:'',       // 打烊时间  String类型
						startTime:''  ,// 开店时间  String类型
						id:'2',       // 店铺id Number类型
						address:'',//修改地址
						name:'',
				},
				date: currentDate, //营业时间
				value:'',
				showAddPhone :false,  //是否显示新增的片段，当点击新增的时候才会新增
				addPhone:true,       //当电话号码长度超过2的时候隐藏掉添加新增的按钮
				iconTrans_1: false,   // 左侧的小三角是否旋转
				iconTrans_2: false,   // 右侧的小三角是否旋转
				
			}
		},
		mounted() {
			this.formData.address = this.storeInfo.address
		},
		onShow() {
			//页面刷新时候显示修改过后的数据
			this.formData.name = this.storeInfo.name
			this.formData.mDesc = this.storeInfo.m_desc
			this.formData.imgUrl = this.storeInfo.img_url
			this.formData.startTime = this.storeInfo.start_time
			this.formData.endTime = this.storeInfo.end_time
			console.log("页面刷新时候显示修改过后的数据this.forData",this.formData)
			console.log("页面刷新时候显示修改过后的数据this.storeInfo",this.storeInfo)
		},
		onLoad() {
			//先判断cantact_phones是否有值，有的时候做分割
			if(this.storeInfo.cantact_phones != null && this.storeInfo.cantact_phones.length != 0){
				this.formData.contactPhones = this.storeInfo.cantact_phones
				let arrayPhones = this.storeInfo.cantact_phones.split(',');
				this.formData.contactPhones = arrayPhones
			}
		},
		methods:{
			rotateLeft(){
				this.iconTrans_1 = !this.iconTrans_1
			},
			rotateRight(){
				this.iconTrans_2 = !this.iconTrans_2
			},
			myUpload(rsp) {
				// this.url = rsp.path; //更新头像方式一
				// this.imgList.push(rsp.path);
				console.log("上传地址回传")
				console.log("rsp.path=============",rsp.path)
				this.uploadImages(rsp);
			},
			// 开启地图
			openMap(){
				let self = this;
				uni.chooseLocation({
					success: function (res) {
						console.log("res",res)
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						self.formData.address = res.address
					}
				})
				
			},
			//修改头像测试
			chooseUpataImg() {
			    this.imgType = 3;
			    this.imgCount = 1;
			    this.chooseImg();
			},
			showImgDetail(url, id) {
			    this.detailUrl = url;
			    this.detailId = id;
			    this.showDetail = true;
			},
			//上传头像的请求
			async uploadImages(img) {
			    var self = this;
				self.showImg = false
			    uni.getImageInfo({
			        src: img.path,
			        success: function () {
			            var param = {
			                url: self.$store.state.host + '/upload/images',
			                filePath: img.path,
			                name: 'file',
			                success: (uploadFileRes) => {
			                    self.$log.debug('uplaod success');
			                    self.$log.debug(uploadFileRes);
			                    img.status = 1;
			                    img.url = JSON.parse(uploadFileRes.data).data;
			    				//将http格式的代码赋值给修改头像的imgUrl
								console.log("img.url==========",img.url)
			    				self.formData.imgUrl = img.url
			                },
			                complete:(res) => {
			                    self.$log.debug('uplaod complete');
			                    self.$log.debug(res);
			                    self.$log.debug(img);
			                }
			            };
			    			
			            self.$log.debug('up param');
			            self.$log.debug(param);
			            uni.uploadFile(param);
			        }
			    });
			},
			
			// 开始营业时间事件
	        bindTimeChange(e) {
				// 确认选择时，需要旋转
				this.iconTrans_1 = !this.iconTrans_1
				this.formData.startTime = e.target.value
				var a =Number(this.formData.startTime.split(":")[0])
				var b =Number(this.formData.endTime.split(":")[0]) 
				// this.checkTime(a,b)
	        },
			// 取消选择时，同样需要旋转回来
			cancelSelectLeft(){
				this.iconTrans_1 = !this.iconTrans_1
			},
			
			// 结束营业时间事件
	        bindEndTimeChange(e) {
				// 确认选择时，需要旋转
				this.iconTrans_2 = !this.iconTrans_2
				this.formData.endTime = e.target.value
				var a =Number(this.formData.startTime.split(":")[0])
				var b =Number(this.formData.endTime.split(":")[0]) 
				// this.checkTime(a,b)
	        },
			cancelSelectRight(){
				this.iconTrans_2 = !this.iconTrans_2
			},
			//判断营业时间的开始时间结束时间（感觉还有点bug）
			// checkTime(startTime,endTime){
			// 	//分割时间
			// 	if(startTime>endTime){
			// 		this.PopShowToastTips('营业开始时间不能早于营业结束时间');
			// 	}
			// },
			//获取营业时间的事件
	        getDate(type) {
	            const date = new Date();
	            let year = date.getFullYear();
	            let month = date.getMonth() + 1;
	            let day = date.getDate();
	            if (type === 'start') {
	                year = year - 60;
	            } else if (type === 'end') {
	                year = year + 2;
	            }
	            month = month > 9 ? month : '0' + month;;
	            day = day > 9 ? day : '0' + day;
	            return `${year}-${month}-${day}`;
	        },
			//返回上一页事件
			goBack() {
				uni.navigateBack({
					delta:1
				})
			},
			// 添加新的号码事件
			addNewPhone(){
				this.newTel= ''
				this.showAddPhone = true
			},
			//电话号码的正则表达式
			checkPhone(val){
				var reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
				if(!reg.test(val)){ 
					this.PopShowToastTips('手机号码不正确，请仔细检查哦!');
					this.showAddPhone = true
					self.formData.contactPhones--
					return false; 
				} 
			},
			
			// 确认新增新的电话号码
			confromPhone(){
				let self = this;
				let title = ''
				if(self.newTel.length === 0){
					this.PopShowToastTips('请输入新增号码!');
					return
				} else if(self.newTel.trim().length == 11 || self.newTel.trim().length == 12){
					self.checkPhone(self.newTel)  // 正则校验新增的手机号是否合法
					self.formData.contactPhones.push(self.newTel)
					self.showAddPhone = false
				} else {
					this.PopShowToastTips('您输入的号码有误,请重新输入!');
					self.showAddPhone = true 

				}
			},
			// 取消
			conselPhone(){
				this.showAddPhone = false
			},
			//清除选择的联系方式
			Clearevents(arr){
				const {formData} = this
				for(var i =0;i<formData.contactPhones.length;i++){
					if(this.formData.contactPhones[i]===arr){
						formData.contactPhones.splice(i, 1);
						 break;
					}	
				}
			},
			//编辑商家请求数据
			confirmSubmit() {
				var self = this
				//将用户修改过后的值返回给后端
				uni.showModal({
					title: '提示',
					content: '是否确认修改',
					success: function (res) {
						if (res.confirm) {
							self.storeInfo.address = self.formData.address
							self.storeInfo.m_desc = self.formData.mDesc
							self.storeInfo.cantact_phones = self.formData.contactPhones
							self.storeInfo.img_url = self.formData.imgUrl
							self.storeInfo.start_time = self.formData.startTime
							self.storeInfo.end_time = self.formData.endTime
							self.formData.id = self.storeInfo.id
							console.log("返回给后端的数据",self.formData)
							console.log("返回给后端的数据",self.storeInfo)
							businessEditor(self.formData.imgUrl,
									       self.formData.address,
										   self.formData.mDesc,
										   self.formData.contactPhones,
										   self.formData.startTime,
										   self.formData.endTime,
										   self.formData.id).then(res=>{

								self.PopShowToastTips('修改成功');
								// 修改成功之后隔1.5秒跳回首页

								// 延迟跳转首页
								setTimeout(function(){ uni.reLaunch({url: '/pages/home/home'})},1000);
							})
						}else{
							this.PopShowToastTips('取消修改');
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		background:rgba(242,245,247,1);
	}
	.changeCommercialMsg {
		width: 100%;
	}
	//新增电话按钮样式
	.add-phone{
		display: flex;
		justify-content: center;
		align-items: center;
		button{
			background-color: #C0C0C0;
			text-align: center;
			width: 30%;
			line-height: 40px;
			color: #FFFFFF;
			margin-top: 10px;
		}
		.btn{
			background-color: #ffa801;
		}
	}
	//新增电话位置样式
	
	//地址简介样式
	.storeAddress{
		color:rgba(10,30,44,1);
		font-weight:bold;
		font-size:14px;
		padding: 43px 28px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
	}
	.top-changeMsg {
		height: 100%;
		padding-top: 16px;
		.edit{
			position: fixed;
			z-index: 9999;
			width: 100%;
			line-height: 30px;

		}
	}
	.CommercialMsg {
		background-color: #fff;
		margin-top: 40px;
		.baseMsg {
			font-size:14px;
			font-family:'Source Han Sans CN';
			font-weight:bold;
			line-height:14px;
			color:rgba(10,30,44,1);
			text-align: center;
			padding: 14px 0px;
		}
		.MsgList {
			.commercialName {
				height: 50px;
				border-bottom: 1px solid #E1E1E1;
				margin: 0 17px;
				.name-1 {
					line-height: 50px;
					width: 65px;
					font-size:14px;
					font-family: 'Source Han Sans CN';
					font-weight:400;
					color:rgba(10,30,44,1);
					.address-stytle{
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				}
				.time {
					width: 80%;
					line-height: 50px;
					margin-left: -40px;
					background-color: red;
					select {
						margin-right: 5px;
						width: 70px;
						height: 24px;
						background-color: #f2f5f7;
						border: none;
						float: right;
						margin-top: 15px;
					}
				}
				.inputValue {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 75%;
					height: 50px;
					float: right;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;	
					input {
						width: 100%;
						font-size:14px;
						font-family: 'Source Han Sans CN';
						font-weight:bold;
					}
					.relation {
						color:rgba(154,154,154,1);
						font-weight: 400;
						margin-top: 2px;
					}

				}
				//显示省列号的样式
				.nowword{
					display: block;
					width: 100%;
					text-overflow:ellipsis; 
					white-space:nowrap; 
					overflow:hidden;
					font-size:14px;
					font-weight:bold;
					color:rgba(10,30,44,1);
					// 商铺地址
					.storeAddress {
						height: 50px;
						font-size:14px;
						font-weight:bold;
						color:rgba(10,30,44,1);
						line-height: 50px;
					}
				}
				//营业时间样式
			}
			.business-hours {
				height: 50px;
				margin: 0 17px;
				.uni-list{
					.uni-list-cell{
						display: flex;
						justify-content: space-around;
						.uni-list-cell-db{
							width: 93px;
							height: 24px;
							background:rgba(242,245,247,1);
							border-radius: 2px;
							margin-top: 12px;
							position: relative;
							.uni-input{
								line-height: 24px;
								text-align: center;
								font-size: 16px;
							}
							// 下拉选择小三角
							.icon_1 {
							    position: absolute;
							    top: 8px;
							    right: 6px;
							    width: 10px;
							    height: 10px;
							    background-image: url("../../static/home/select.png");
							    background-repeat: no-repeat;
								background-size: contain;
							    -webkit-transition: transform .25s linear;
							    -moz-transition: transform .25s linear;
							    -o-transition: transform .25s linear;
							    transition: transform .25s linear;
								z-index: 10;
							}
							.iconTrans_1 {
							    transform: rotate(180deg);
							    -webkit-transition: transform .25s linear;
							    -moz-transition: transform .25s linear;
							    -o-transition: transform .25s linear;
							    transition: transform .25s linear;
							}
							// 下拉选择小三角
							.icon_2 {
							    position: absolute;
							    top: 8px;
							    right: 6px;
							    width: 10px;
							    height: 10px;
							    background-image: url("../../static/home/select.png");
							    background-repeat: no-repeat;
								background-size: contain;
							    -webkit-transition: transform .25s linear;
							    -moz-transition: transform .25s linear;
							    -o-transition: transform .25s linear;
							    transition: transform .25s linear;
								z-index: 10;
							}
							.iconTrans_2 {
							    transform: rotate(180deg);
							    -webkit-transition: transform .25s linear;
							    -moz-transition: transform .25s linear;
							    -o-transition: transform .25s linear;
							    transition: transform .25s linear;
							}
						}
					}
					
				}
				.name {
					line-height: 50px;
					font-size:14px;
					font-family: 'Source Han Sans CN';
					font-weight:400;
					color:rgba(10,30,44,1);
				}
				.time {
					width: 65%;
					margin-top: -3px;
					line-height: 50px;
					select {
						width: 70px;
						height: 24px;
						background-color: #f2f5f7;
						border: none;
						margin-top: 15px;
					}
				}
			}
		}
	}

	//修改头像样式
	.in-store {
		display: flex;
		margin-bottom: 49px;
		.in-store-text {
			width: 100px;
			margin: 16px;
			line-height: 50px;
			font-size:14px;
			color:rgba(10,30,44,1);
		}
		.container {
			width: 300upx;
			height:300upx;
			border: 1px dotted #C0C0C0;
			margin-top: 3%;
			overflow: hidden;
		}
		.upload-avatar {
			width: 300upx;
			height:300upx;
			margin-top: 14%;
		}
	}
	.submit-affirm {
		width: 100%;
		height: 49px;
		background:rgba(255,168,1,1);
		font-size:16px;
		font-family:Source Han Sans CN;
		font-weight:400;
		line-height:49px;
		color:rgba(255,255,255,1);
		position: absolute;
		bottom: 0;
		position: fixed;  //将button按钮固定在页面底部
	}
	.openMap {
		image {
			width: 20px;
			height: 25px;
		}
	}
</style>
