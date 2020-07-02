<script>
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
            uni.reLaunch({
                url: '/pages/login'
            });
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		created() {
			//在页面刷新时将vuex里的信息保存到localStorage里
			  window.addEventListener("beforeunload",()=>{
				   uni.setStorage({
					 key: 'xorderList',
					 data: this.$store.state
				   });
			  })
			 //在页面加载时读取localStorage里的状态信息
			 if (uni.getStorage('xorderList')) {
				 this.$store.state.xorderList = uni.getStorage('xorderList')
			 }
		}
	}	
</script>

<style lang="less">
	 @import "./static/iconfonts/iconfont.css";
	 //flex常见的布局总和	 
	 // .flex-between{
		//  display: flex;
		//  justify-content: space-between;
		//  align-items: center;
	 // }
	 // .flex-center{
		//  display: flex;
		//  justify-content: center;
		//  align-items: center;
	 // }
    .top-div {
        width: 100%;
		height: 60px;
        position: fixed; // 固定顶部
		top: 0;
		z-index: 99;
		background: #fff;
    }
	.top {
	    width: 100%;
	    height: 30px;
	    background: #fff;
	}
	.home {
		width:100%;
		min-height: 100vh;
		opacity:1;
		overflow-x: hidden;
		background-color: #f2f5f7; //首页背景
	}
    .full {
        height: 100%;
        width: 100%;
    }
    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
	.flex-between{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	/* //使用说明开始 */
	.instructions{
		padding: 8px;
		box-sizing: border-box;
		.instructions-title{
			font-size:14px;
			font-family:Source Han Sans CN;
			font-weight:400;
			color:rgba(10,30,44,1);
		}
		.instructions-type{
			display: flex;
			justify-content: center;
			align-items: center;
			width:96%;
			line-height: 30px;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border-radius:5px;
			margin-left: 8px;
			box-sizing: border-box;
		}
		.template{
				width:100%;
				height: 150px;
				background:rgba(255,255,255,1);
				margin-top: 10px;
				padding: 8px;
				box-sizing: border-box;
				border-radius: 6px;
				overflow: hidden;
				border: 1px solid  rgba(221,221,221,1);
				.uni-textarea{
					overflow: hidden;
					height: 120px;
					overflow-y: scroll;
					.text-content{
						width: 100%;
						height: 100%;
						font-size: 14px;
						color:rgba(102,102,102,1);
					}
				}
						
			}
		}
/* //使用说明开始 */
		.instructions{
			padding: 8px;
			box-sizing: border-box;
			.instructions-title{
				font-size:14px;
				font-family:Source Han Sans CN;
				font-weight:400;
				color:rgba(10,30,44,1);
			}
			.instructions-type{
				display: flex;
				justify-content: center;
				align-items: center;
				width:96%;
				line-height: 30px;
				background:rgba(255,255,255,1);
				border:1px solid rgba(221,221,221,1);
				border-radius:5px;
				margin-left: 8px;
				box-sizing: border-box;
			}
			.template{
					width:100%;
					height: 150px;
					background:rgba(255,255,255,1);
					margin-top: 10px;
					padding: 8px;
					box-sizing: border-box;
					border-radius: 6px;
					overflow: hidden;
					border: 1px solid  rgba(221,221,221,1);
					.uni-textarea{
						overflow: hidden;
						height: 120px;
						overflow-y: scroll;
						.text-content{
							width: 100%;
							height: 100%;
							font-size: 14px;
							color:rgba(102,102,102,1);
						}
					}
							
				}
			}
	/* //使用规范开始 */
	.specification-use{
		padding: 2px;
		.package-time{
			display: flex;
			justify-content: center;
			align-items: center;
			width:110px;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border-radius:5px;
			line-height: 30px;
			margin-left: 10px;
			.time-detail{
				width: 100px;
				line-height: 30px;
				input{
					text-align: center;
					border: none;
					font-size: 14px;
					line-height: 30px;
				}
			}
		}
		.time-left{
			margin-left: 10px;
			.time-input{
				width: 200rpx;
				height: 30px;
				line-height: 30px;
				input{
					 text-align: center; 
					 border: none;
					 width: 100%;
					 height: 100%;
					 font-size: 14px;
				}
			}
		}
		.time-instrution{
			padding-left: 6px;
			line-height: 30px;
			font-size: 10px;
			color:rgba(154,154,154,1);
		}
		// 天的样式
		.time-day{
			padding-left: 10px;
			line-height: 30px;
			font-size: 14px;
			color:rgba(102,102,102,1);
		}
		
	}
	//确认按钮
	.btn3{
		width: 100%;
		position: fixed;
		bottom: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f2f5f7; //首页背景
		line-height: 49px;
		margin-left: -10px;
		z-index: 4;
		.btn-r{
			text-align: center;
			background:rgba(255,168,1,1);
			color: #fff;
			width: 100%;
		}
	}
</style>
