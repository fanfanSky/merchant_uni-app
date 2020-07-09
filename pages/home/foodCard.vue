<template>
    <div class="cobomType flex-center" @click="goTogoodsDetail()">
        <!-- 套餐图片 -->
        <div class="cobomImg">
            <div>
				<!-- 使用第一张作为主图 -->
                <img class="mainImg" :src="this.info.imgUrl" :lazy-load="true" mode="widthFix" style="width: 100%;" />
            </div>
        </div>
        <div class="cobomDetail">
            <p class="detailTop">
                <span class="discount">{{(info.price / info.value) * 10 | foodCardFilter}}折</span>
                <span class="cobomText">{{info.name}}</span>
            </p>
			<p class="type">
				<span v-for="(item,i) in foods" :key="i"  class="foods">
				<span>{{item.name}}
					<span  v-if="i== info.foods.length-1"></span>
					<span  v-else>、</span>		
				</span>
				</span>
			</p>
            <p class="price">
				<span class="current-price">￥{{info.value - info.storeSubsidy | foodCardFilter}}</span>
                <span class="original-price">原价￥{{info.value | foodCardFilter}}</span>
            </p>
			<p class="mon-sold">
				<span >月售：{{info.monSoldNum}}</span>
				<span class="mon-l" v-if="info.buyTimeLimit != ''">库存：{{info.buyTimeLimit}}</span>
				<span  class="mon-l" v-else>不限购</span>
			</p>
        </div>
		<div v-if="info.checkStatus == 0" class="check-status flex-center check-pending">审核中</div>
		<!-- <div v-if="info.checkStatus == 1" class="check-status flex-center check-pass">已通过</div> -->
		<div v-if="info.checkStatus == 2" class="check-status check-unpass">未通过</div>
    </div>
</template>

<script>
    export default{
        data() {
            return {
				imageTemp : '',
				foods:[]
            }
        },
        props: {
            info: {
                default:{}
            },
            clickOpen: {
                type: Boolean,
                default: true
            }
        },
		mounted() {
			this.foods = JSON.parse(this.info.foodsJson)
		},
        methods:{
            goTogoodsDetail() {
                if (!this.clickOpen)  return; 
				this.$store.state.gInfoUp = this.info;
                uni.navigateTo({
                    url:'./goodsDetail'
                })
            }
			
        }
    }
</script>

<style lang="less" scoped>
	//审核状态的样式
	.check-status{
		font-size: 14px;
		width: 160upx;
		height: 100%;
		padding-right: 20upx;
	}
	.check-pending{
		color: #00C777;
	}
	.check-pass{
		color: green;
	}
	.check-unpass{
		color: grey;
	}
    .voucherList {
        background-color: #fff;
        border-radius: 5px;
        margin: 0 8px;
		.voucherText {
			height: 80upx;
			padding-left: 8px;
			padding-top: 10px;
		}
    }
    .cobomType {
        // width: 100%;
        background-color: #fff;
		padding: 6px 8px;
		box-sizing: border-box;
		margin-bottom: 2px;
		.cobomImg{
			div {
				width: 160upx;
				height: 160upx;
				text-align: center;
				border-radius: 5px;
				overflow: hidden;
				line-height: 100%;
				.mainImg {
					width: 100%;
					height: 100%;
					border-radius: 5px;
				}
			}
		}
		.cobomDetail {
			flex: 1;
			padding-left: 12px;
			height: 90px;
			margin-top: 2px;
			width: 360upx;
			.detailTop{
				margin-top: -5px;
				white-space: nowrap;
				width: 300upx;  // 限制死了宽度，对适配不友好
				overflow: hidden; 
				text-overflow:ellipsis;
				.discount {
					width:38px;
					display: inline-block;
					background:linear-gradient(90deg,rgba(240,197,80,1) 0%,rgba(255,141,40,1) 100%);
					border-radius:4px;
					font-size:10px;
					line-height:16px;
					color:rgba(255,255,255,1);
					margin-right: 6px;
					text-align: center;
				}
				.cobomText {
					font-size:18px;
					font-weight:bold;
					line-height:16px;
					color:rgba(10,30,44,1);
					margin-bottom: 10px;
					
				}
			}
			.type {
				font-size:10px;
				line-height:16px;
				color:rgba(154,154,154,1);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				width: 90%;
			}
			.price {
				font-family: 'Source Han Sans CN';
				.current-price {
					font-size:18px;
					font-weight:500;
					line-height:16px;
					color:rgba(255,43,0,1);
					margin-right: 20px;
				}
				.original-price {
					font-size:12px;
					line-height:16px;
					color:rgba(154,154,154,1);
					text-decoration:line-through;
				}
			}
			// /月销量及库存的样式
			.mon-sold{
				span{
					font-size: 12px;
					color: #9A9A9A;
				}
				.mon-l{
					margin-left: 20px;
				}
			}
		}
    }
	.foods{
		font-size: 10px;
		color:#9A9A9A ;
	}
</style>