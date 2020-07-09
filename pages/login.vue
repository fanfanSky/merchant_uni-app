<template>
    <div class="main">
		<div class="main-top flex-center">
			聚合接单系统
		</div>
		<div class="main-center">
			<div class="main-text">
			    <h2 class="from-title">
			        账号登录
			    </h2>
			    <div class="from-top">
			        <div class="form-box" >
						<div class="uni-common-mt">					
						    <div class="uni-form-item uni-column">
						        <input  v-model="account" class="uni-input ipt" placeholder-style="color:#FFCE70" placeholder="请输入账号" />
						    </div>
						</div>
			        </div>
			        <div class="form-box">
						<div class="uni-common-mt">
						    <div class="uni-form-item uni-column">
						        <input  v-model="password" password @focus="loginPwdFocus" class="uni-input ipt" placeholder-style="color:#FFCE70" placeholder="请输入账号" />
						    </div>
						</div>
			        </div>
					<div class="flex-between" style="padding: 0px 10px;">
						<!-- 申请开店 -->
						<span class="applyOpenStore" @click="openShop()">申请开店</span>
						<!-- 忘记密码 -->
						<span class="forgetPwd" @click="gotoForgetPwd" style="">忘记密码?</span>
					</div>
			    </div>
			    <button class="btn-login" @click="loginClick">登  录</button>
				<div class="relation" @click="relationUs">联系我们:  0771-2231585</div>
			    <div class="full flex-center" v-if="storeList.length > 1">
			        <div class="full-content">
			            <div class="selet-shop">
			                请选择您的商铺
			            </div>
			            <div v-for="item in storeList" class="flex-center" @click="confirmStore(item)">
			                {{ item.name }}
			            </div>
			        </div>
			    </div>
			</div>
		</div>
		<!-- 装底部图片的盒子 -->
		<div class="main-bottom"></div>
        <update-dialog :code="updateInfo.code" :m-desc="updateInfo.mDesc" :progress="updateInfo.progress" :url="updateInfo.downloadUrl"
            v-if="updateVisible">
		</update-dialog>
    </div>

</template>

<script>
    import { login,getInfo } from '../api/authApi.js'
    import { getToken, setToken, logout } from '../util/auth.js'
    import {getVersion} from "../api/versionApi";

    export default {
        data() {
            return {
                account: '',
                password: '',
                storeList: [],
                updateInfo: {},
                updateVisible: false
            }
        },
        onLoad() {
            this.initData();
        },
        methods: {
			// 输入密码框聚焦
			loginPwdFocus(){
				this.password = ''
			},
			// 联系我们
			relationUs() {
				uni.makePhoneCall({
					phoneNumber: '0771 — 2231585'
				})
			},
            async initData() {
                var self = this;
                uni.showLoading({
                    title: '读取信息中'
                });
                this.checkVersion();
            },
            checkLogin() {
                var self = this;
                let token = getToken();
                this.$log.debug('token');
                this.$log.debug(token);
                if (token != null) {
                    if (token.length > 0)
                        getInfo().then(res => {
                            self.$store.state.userInfo = res.data;
                            self.storeList = res.data.stores;
                            if (res.data.stores.length == 1) {
                                setToken(res.data.token);
                                self.$store.state.storeInfo = res.data.stores[0];
                                uni.reLaunch({
                                    url: '/pages/home/home'
                                });
                            }
                        }).finally(function () {
                            self.$log.debug('info complete');
                            uni.hideLoading();
                        });
                    else
                        uni.hideLoading();
                } else
                    uni.hideLoading();
            },
            checkVersion() {
                var self = this;
                getVersion().then(res => {
                    self.checkLogin();
                });
            },
            loginClick() {
                var self = this;
				let message = '';
				if(self.account.length == 0){
					this.PopShowToastTips('账号不能为空');
				} else if (self.password.length == 0) {
					this.PopShowToastTips('密码不能为空');
				} else {
					// 调用后台登录接口，传递参数：1.账号，2.密码
					// this.password = this.$md5(this.password)
					console.log("登录密码==>",this.password)
					login(this.account, this.$md5(this.password)).then(res => {
						console.log('登录成功');
					    setToken(res.data.token);
					    self.storeList = res.data.stores;
					    if (res.data.stores.length == 1) {
							console.log("token====<><><>",res.data.token)
					        self.$store.state.storeInfo = res.data.stores[0];
					        getInfo(res.data.token).then(res => {
								console.log('*************',res)
					            self.$store.state.userInfo = res.data;
								// console.log('========****',self.$store.state.userInfo)
					        }).catch((err) => {
								console.log("错误信息==>",err)
							});
					        uni.reLaunch({
					            url: '/pages/home/home'
					        });
					    } else if (res.data.stores.length == 0) {
							this.PopShowToastTips('本账号无权登陆');
					        logout();
					    }
					});
				}
            },
            confirmStore(item) {
                self.$store.state.storeInfo = item;
                uni.reLaunch({
                    url: '/pages/home/home'
                });
            },
			openShop(){
				uni.navigateTo({
					url:'/pages/openShop/openShop'
				})
			},
			// 到忘记密码页面
			gotoForgetPwd(){
				uni.navigateTo({
					url:'/pages/forgetPwd/forgetPwd'
				})
			}
        }
    }
</script>

<style lang="less" scoped>
	.main{
		position: relative;
		padding:5% 5%;
		box-sizing: border-box;
		background:rgba(255,255,255,1);
		.main-top{
			padding: 10% 5% 10% 10%;
			height: 26%;
			color:rgba(255,168,1,1);
			letter-spacing: 16px;
			color: #ffbe40;
			font-size: 48upx;
		}
		.main-center{
			background: #FFF;
			box-shadow:0px 0px 6px 3px rgba(119,51,7,0.09);
			border-radius:20px;
			padding: 4% 0;
			box-sizing: border-box;
			margin-top: 5%;
			.main-text{
				text-align: center;
				padding-top: 26upx;
				width: 100%;
				.btn-login{
					width: 95%;
					background:rgba(255,168,1,1);
					border-radius:10px;
					margin-top: 60px;
					color: #FFFFFF;
					line-height: 40px;
				}
				.full{
					.full-content{
						background: #fff; 
						display: flex; 
						flex-flow: column; 
						align-items: center; 
						width: 70%;
						.selet-shop{
							font-size: 0.85rem; 
							font-weight: bold;
						}
						.flex-center{
							width: 100%; 
							line-height: 60upx;
						}
					}
				}

			}
			.from-top{
				padding-top: 50px;
			}
			.from-title {
				text-align: center;
				color:rgba(255,168,1,1);
				font-family:PingFang SC;
				font-size:26px;
				line-height:16px;
			}
			// 申请开店
			.applyOpenStore {
				font-size:14px;
				font-family:PingFang SC;
				color:rgba(130,130,130,1);
				padding-left: 9px;
				color: #00B1FF;
			}
			// 忘记密码按钮
			.forgetPwd {
				font-size:14px;
				color:rgba(130,130,130,1);
				padding-right: 9px;
			}
			.form-box {
			    padding: 4% 7%;
				box-sizing: border-box;
			    width: 100%;
				text-align: center;
				color: #ffa905;
				.ipt{
					width: 100%;
					border-bottom:1px solid rgba(255,225,167,1);
					padding-bottom: 20upx;		
				}
			}
			.relation {
				font-size:14px;
				font-family:PingFang SC;
				line-height:40upx;
				color:rgba(102,102,102,1);
				margin-top: 32upx;
			}
			// 联系电话
			.relationframe{
				width: 360upx;
				height: 100upx;
				margin-left: 50%;
				left: -90.5px;
			}
		}
		.main-bottom{
			left: 0;
			position: fixed;
			bottom: 0;
			right: 0;
			background: url('../static/login-img/login-bottom.png');
			background-size: cover;
			z-index: 99;
			height: 170upx;
			width: 100%;
		}
	}

</style>