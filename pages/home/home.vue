<template>
	<view class="home">
        <div class="top-div">
            <div class="top"></div>
            <!-- 扫描 -->
            <div class="scan" style="text-align: center;">
				<span >{{storeName}}</span>
                <img src="static/home/scan.png" @click="getScanCode()">
            </div>
        </div>
        <!-- 商品信息 -->
        <div class="goods" ref="goodsTop">
            <!-- 右边商品图片 -->
            <div class="goods-img" style="overflow: hidden;">
				<image lazy-load  style="width: 100%;height: 100%;" :fade-show="true" :src="storeInfo.img_url"></image>
            </div>
            <div class="goods-msg">
                <p class="nameAndSave">
                    <span class="goods-name">{{storeInfo.name}}</span>
                    <span class='save-sign'>安全商家</span>
                </p>
				<!-- 商家评分 -->
                <p class="star-comment">
                    <!-- <star class="star" :score="storeInfo.rating" /> -->
					<Star class="star" :score="storeInfo.rating==0?5:storeInfo.rating"></Star>
                    <span class="comment">{{storeInfo.rating==0?5:storeInfo.rating}}</span>
                </p>
                <p class="address">{{storeInfo.address}}</p>
                <p class="renew">营业中：{{storeInfo.start_time}}-{{storeInfo.end_time}}</p>
            </div>
        </div>
		<!-- 新增按钮 -->
		<button class="add-btn" @click="addNewProduce()">
			<div class="add-text" style="color: #FFFFFF;display: flex;justify-content: center;align-items: center;">
				新增商品
				<img src="static/home/writeAdd.png" alt="" style="width: 17px;height: 17px;margin-left: 5px;">
			</div>
		</button>
		<!-- 代金券以及套餐组件 -->
		<voucher style="margin-top: 10px;" :coupon-list="couponList" :food-list="foodList" />
	</view>
</template>

<script>
	import voucher from './voucher.vue'
	import Star from './star.vue'   // 五星评论
    import {getGoodsList,useCoupoon} from "../../api/goodsApi"
    import {mapState} from 'vuex'
	
    export default {
		components:{ Star, voucher },
        onLoad(){
		    this.$log.debug('info');
		    console.log("我是商家信息===>",this.storeInfo)
		    this.initData();
			uni.startPullDownRefresh({success:(res)=>{ console.log(res);}});
        },
		onPullDownRefresh(){
			this.initData();
			setTimeout(()=> {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
        computed: {
            ...mapState([
                'storeInfo', 'balance'
            ])
        },
		data() {
			return {
			    couponList: [],
				foodList: [],
				scoreData:4,
				offsetTop: 0,        //实现导航出现吸顶的效果
				offsetHeight: 0,
				headerFixed: 0,
				storeName:''
			}
		},
		mounted() {
			//出现吸顶的效果
			this.$nextTick(() => {
			  // 获取商家信息元素的dom
			  let headerTop = this.$refs.goodsTop;
			  // 商家信息元素到top的距离
			  this.offsetTop = headerTop.offsetTop;
			  // 元素自身的高度
			  this.offsetHeight = headerTop.offsetHeight;
			  // 监听滚动条
			  window.addEventListener("scroll", this.handleScroll);
			});
		},
		//撤销吸顶的效果
		methods:{
			// 实现吸顶的效果
			handleScroll() {
			  // 得到页面滚动的距离，兼容写法
			  let scrollTop =window.pageYOffset ||  document.documentElement.scrollTop ||  document.body.scrollTop;
			  // 判断页面滚动的距离
			  if(scrollTop>=100){
				  this.storeName = this.storeInfo.name
			  }else{
				  this.storeName = ''
			  }
			},
		    initData() {
                this.loadGoodList();
            },
            loadGoodList() {
		        var self = this;
		        getGoodsList(this.storeInfo.id).then(res => {
					console.log("获取商品信息",res)
		            let list = res.data;
		            list.forEach(item => {
                        if (item.foodsJson.length > 0) {
							if (item.foodsJson != undefined && item.foodsJson.trim() != "") {
								item.foods = JSON.parse(item.foodsJson);
							}
                            let foodDesc = '';
                            for (let i = 0; item.foods != undefined && i < item.foods.length; i++) {
                                let childFood = item.foods[i].food;
                            }
                            foodDesc = foodDesc.substring(0 , foodDesc.length - 1);
                            item.foodDesc = foodDesc;
                        }
                        let minPrice = 10000000;
                        item.couponPlatforms.forEach(pl => {
                            let price = item.value - pl.platformSubsidy - pl.rbSubsidy - pl.storeSubsidy;
                            if (price < minPrice)
                                minPrice = price;
                        });
                        item.price = minPrice;
                        item.discount = (minPrice / item.value).toFixed(2);
                    });

		            let couponList = list.filter(item => {
		                return item.type == 1;
                    });
                    let foodList = list.filter(item => {
                        return item.type == 2;
                    });
                    this.couponList = couponList;
                    this.foodList = foodList;
                });
            },
			
			// 获取扫描的二维码
			getScanCode() {
				// 允许从相机和相册扫码
                var self = this;
				uni.scanCode({
				    success: function (res) {
				        self.$log.debug(res);
				        let codeBody = JSON.parse(res.result);
				        codeBody.storeId = self.storeInfo.id;
                        self.$log.debug(codeBody);
						// 扫码成功后调用接口
				        useCoupoon(codeBody).then(res => {
				            let data = res.data;
                            uni.showModal({
                                title: '提示',
                                content: '优惠券【'+data.name+'】使用成功\n已进账：￥' +data.value.toFixed(2) + '元',
                                showCancel: false
                            });
                        });
				    }
				});
			},
			// 跳转至新增商品页面
			addNewProduce(){
				uni.navigateTo({
					url: './newProducts'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
    page {
        background-color: #f2f5f7re;
    }
    // 扫描
    .scan {
        width: 100%;
        height:44px;
        background-color: #fff;
        img {
            width: 19px;
            height: 17px;
            float: right;
            margin-right: 20px;
            margin-top: 13.5px;
        }
    }
    // 添加的商品信息
    .goods {
        width:100%;
        min-height:125px;
        margin-top: 74px;
		margin-bottom: 10px;
		background-color: #fff;
		padding-bottom: 10px;
        .goods-img {
            width: 110px;
            height: 110px;
            float: right;
            margin-right: 16px;
            margin-left: 26px;
            border-radius:5px;
            text-align: center;
            line-height: 98px;
			overflow: hidden;
			border-radius: 5px;
			margin-top: 12px;
        }
        .goods-msg {
            margin-bottom: 10px;
            margin-left: 16px;
            .nameAndSave {
                .goods-name{
                    font-size:16px; 
                    font-weight:bold;
                    line-height:16px;
                    margin-top: 10px;
					color:rgba(10,30,44,1);
					text-align: center;
                }
                .save-sign {
					width: 16%;
                    display: inline-block;
                    height: 2%;
                    border:1px solid #1592E6;
                    border-radius:5px;
                    font-size:10px;
                    color: #1592E6;
                    margin-left: 8px;
					text-align: center;
                }
            }
        }
        .star-comment {
			width: 100%;
			height: 20px;
            margin-bottom:5px;
			position: relative;
			line-height: 20px;
            .comment {
                font-size:12px;
                line-height:20px;
                color: #9A9A9A;
				// margin-left: 100px;
            }
        }
        .address, .renew {
            line-height:16px;
            color:rgba(154,154,154,1);
        }
        .address {
			font-size:12px;
        }
        .renew {
            font-size:14px;
            margin-top: 6px;
			padding-bottom: 10px;
        }
    }
	.add-btn {
		height:44px;
		background:rgba(255,168,1,1);
		margin: 0px 8px;
		.add-text {
			font-size:16px;
			line-height: 44px;
		}
		.add-img {
			float: left;
			img {
				width:17px;
				height:17px;
			}
		}
	}
	// 优惠区域
	.discounts {
		width: 300px;
		margin-top: 20px;
		margin-left: 16px;
		font-family: 'Source Han Sans CN';
		font-size:18px;
		font-weight:bold;
		margin-bottom: 16px;
		.voucher {
			// color:rgba(10,30,44,1);  // 选中的颜色
			margin-right: 40px;
			border-bottom: 5px solid rgba(252,108,79,1);
			
		}
		.combo {
			color:rgba(154,154,154,1);
		}
	}
</style>