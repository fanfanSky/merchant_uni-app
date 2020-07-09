<template>
	<view>
		<div class="scanContent">
			<div class="scanTop">套餐内容</div>
			<div class="scanDown">
				<div class="main-cate" v-for="food in foods">
					<span>{{food.name}}</span>
					<span>
					{{food.price| foodCardFilter}}
					<span style="padding: 0px 3px;">*</span>
					{{food.num}}
					</span>
					<span>￥{{food.totalPrice | foodCardFilter}}</span>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			foodData:[]
			}
		},
		props: {
			foods: {
				type: Array,
				default: []
			}
		},
		onLoad() {
			// this.foodData = JSON.parse(this.foodsJson)
			// this.foodData = this.foodsJson
			console.log('this.foods')
		},
		methods:{

		}
	}
</script>

<style lang="less" scoped>
	.scanContent {
		width: 100%;
		.scanTop {
			font-family: 'Source Han Sans CN';
			font-weight:500;
			line-height:16px;
			line-height: 35px;
			margin: 0 16px;
			border-bottom: 1px solid rgba(225,225,225,1);
			margin-bottom: 6px;
			font-size:16px;
			font-weight:bold;
			color:rgba(0,0,0,1);
		}
		.scanDown {
			margin: 0 16px;
			background-color: #fff;
			.main {
				font-size:16px;
				font-family: 'Source Han Sans CN';
				font-weight:400;
				line-height:16px;
				color:rgba(10,30,44,1);
				strong {
					margin-right: 5px;
				}
			}
			.main-cate {
				font-size:14px;
				font-family: 'Source Han Sans CN';
				font-weight:400;
				line-height:16px;
				color:rgba(102,102,102,1);
				margin-left: 12px;
				margin-top: 10px;
				display: flex;
				justify-content: center;
				padding-bottom: 5px;
				span:first-child {
					flex: 1;
				}
				span:nth-child(2) {
					flex: 1;
					text-align: center;
				}
				span:last-child {
					flex: 1;
					text-align: right;
				}
			}
		}
	}
</style>
