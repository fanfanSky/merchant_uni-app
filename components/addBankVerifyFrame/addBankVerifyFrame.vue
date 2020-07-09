<template>
	<view class="code-box">
		<view class="flex-box">
			<input :value="inputValue" type="password" :focus="autoFocus" :maxlength="maxlength" class="hide-input" @input="getVal" />
			<block v-for="(item, index) in ranges" :key="index">
				<view :class="['item', { active: codeIndex === item, middle: type === 'middle', bottom: type === 'bottom', box: type === 'box' }]">
					<view class="line" v-if="type !== 'middle'"></view>
					<view v-if="type === 'middle' && codeIndex <= item" class="bottom-line"></view>
					<block v-if="isPwd && codeArr.length >= item">
						<text class="dot">.</text>
					</block>
					<block v-else> {{ codeArr[index] ? codeArr[index] : ''}}</block>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import { getTradePwd } from "../../api/addBankApi.js"
	import {mapState} from 'vuex'
	// 支持使用 v-model
	// 支持使用refs
	// 打个广告：
	// 全新的 UI 组件来袭：mypUI-nvue页面，uni-app模式，一套组件对应mp/h5/app
	export default {
		name: 'mypOneInput',
		props: {
			// 支持外部提供，支持使用v-model
			// 支持通过value来做清空
			value: {
				type: String,
				default: ''
			},
			// 4/6
			maxlength: {
				type: Number,
				default: 6
			},
			autoFocus: {
				type: Boolean,
				default: false
			},
			isPwd: {
				type: Boolean,
				default: true
			},
			// middle-middle line, bottom-bottom line, box-square box
			type: {
				type: String,
				default: "bottom"
			}
		},
		watch: {
			maxlength: {
				immediate: true,
				handler: function(newV) {
					if (newV === 6) {
						this.ranges = [1, 2, 3, 4, 5, 6]
					} else {
						this.ranges = [1, 2, 3, 4]
					}
				}
			},
			value: {
				immediate: true,
				handler: function(newV) {
					if (newV !== this.inputValue) {
						this.inputValue = newV
						this.toMakeAndCheck(newV)
					}
				}
			}
		},
		computed: {
			...mapState([
				'storeInfo'
			])
		},
		data() {
			return {
				inputValue: '',
				codeIndex: 1,
				codeArr: [],
				ranges: [1, 2, 3, 4]
			}
		},
		created() {
			console.log("storeInfo",this.storeInfo)
		},
		methods: {
			getVal(e) {
				const val = e.detail.value
				this.inputValue = val
				this.$emit('input', val)
				this.toMakeAndCheck(val)
				console.log("kkkk==>",this.inputValue)   // 输入框中的值
				// 判断输入密码的长度，根据密码长度来验证验证码是否正确
				if (this.inputValue.length < 6 || this.inputValue.length == 0){
					return
				} else if (this.inputValue.length == 6){
					// 将值传递给父组件fillPwd.vue
					this.$emit('fillPwd', this.inputValue);
				}
			},
			toMakeAndCheck(val) {
				const arr = val.split('')
				this.codeIndex = arr.length + 1
				this.codeArr = arr
				if (this.codeIndex > Number(this.maxlength)) {
					this.$emit('finish', this.codeArr.join(''))
				}
			},
			// refs 时不再提供 v-model 支持
			// 支持使用refs来设置value
			// 没有提供数据保护与检测，自己在外面对数据进行检测保护
			set(val) {
				this.inputValue = val
				this.toMakeAndCheck(val)
			},
			// 支持使用refs来清空
			clear() {
				this.inputValue = ''
				this.codeArr = []
				this.codeIndex = 1
			}
		}
	}
</script>

<style scoped>
	/* @keyframes twinkling {
		0% {
			opacity: 0.2;
		}

		50% {
			opacity: 0.5;
		}

		100% {
			opacity: 0.2;
		}
	} */

	.code-box {
		text-align: center;
	}

	.flex-box {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
	}

	.flex-box .hide-input {
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		text-align: left;
		z-index: 9;
		opacity: 1;
	}

	.flex-box .item {
		position: relative;
		width: 96upx;
		height: 96upx;
		margin-right: 6upx;
		/* font-size: 70upx; */
		/* font-weight: bold; */
		color: #333;
		line-height: 32upx;
		border: 1px solid #333; /* 边框颜色 */
	}

	.flex-box .item:last-child {
		margin-right: 0;
	}

	.flex-box .middle {
		border: none;
	}

	.flex-box .box {
		box-sizing: border-box;
		border: 2upx solid #cccccc;
		border-radius: 6rpx;
	}

	.flex-box .bottom {
		box-sizing: border-box;
		/* border-bottom: 4rpx solid #212121; */
	}

	/* .flex-box .active {
		border-color: #00C777;  
	} */

	.flex-box .active .line {
		display: block;
	}

	/* 光标 */
	/* .flex-box .line {
		display: none;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2upx;
		height: 40upx;
		background: #333333;
		animation: twinkling 1s infinite ease;
	} */

	.flex-box .dot {
		font-size: 80upx;
		line-height: 40upx;
	}

	.flex-box .bottom-line {
		height: 4px;
		background: #000000;
		width: 80%;
		position: absolute;
		border-radius: 2px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
