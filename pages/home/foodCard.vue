<template>
    <div class="cobomType flex-center" @click="goTogoodsDetail()">
        <!-- 套餐图片 -->
        <div class="cobomImg">
            <div>
				<!-- 使用第一张作为主图 -->
                <img class="mainImg" :src="this.info.imgUrl" :lazy-load="true" mode="widthFix" style="width: 100%;" />
            </div>
        </div>
        <div class="cobomDetail" style="margin-top: 2px;">
            <p class="detailTop">
                <span class="discount">{{(info.price / info.value) * 10 | foodCardFilter}}折</span>
                <span class="cobomText">{{info.name}}</span>
            </p>
            <p class="type">{{info.foodDesc}}</p>
            <p class="price">
				<span class="current-price">￥{{info.value - info.storeSubsidy | foodCardFilter}}</span>
                <span class="original-price">原价￥{{info.value | foodCardFilter}}</span>
            </p>
        </div>
		<div v-if="info.checkStatus == 0" class="check-status  check-pending">审核中</div>
		<!-- <div v-if="info.checkStatus == 1" class="check-status flex-center check-pass">已通过</div> -->
		<div v-if="info.checkStatus == 2" class="check-status check-unpass">未通过</div>
    </div>
</template>

<script>
    export default{
        data() {
            return {
				imageTemp : ''
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
		display: flex;
		justify-content: flex-end;
		align-items: center;
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
			height: 40px;
			padding-left: 8px;
			padding-top: 10px;
		}
    }
    .cobomType {
        width: 100%;
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
			position: relative;
			flex: 1;
			padding-left: 12px;
			height: 90px;
			.detailTop{
				margin-top: -5px;
				white-space: nowrap;
				width: 200px;  // 限制死了宽度，对适配不友好
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
				margin-bottom: 10px;
				margin-top: 10px;
			}
			.price {
				position: absolute;
				bottom: 0px;
				font-family: 'Source Han Sans CN';
				.current-price {
					font-size:15px;
					font-weight:500;
					line-height:16px;
					color:rgba(255,43,0,1);
					margin-right: 10px;
				}
				.original-price {
					font-size:12px;
					line-height:16px;
					color:rgba(154,154,154,1);
					text-decoration:line-through;
				}
			}
		}
    }
</style>