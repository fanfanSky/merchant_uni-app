<template>
	<view>
		<picker :title="index" @click="rotateRight" @change="bindTimeChange" @columnchange="columnchange" mode="multiSelector" :disabled="disabled" :class="{disabled:disabled}"
		 :value="index" :range="array" @cancel="cancelSelect">
			<view class="uni-input" v-if="showTime">{{showTime}}
			</view>
			<view v-else class="placeholder">{{placeholder}}</view>
		</picker>
		<!-- 小三角图标 -->
		<span :class="{icon: true, iconTrans:iconTrans}"></span>
	</view>
	<!-- 只读 -->
</template>

<script>
	export default {
		name: 'dy-Date-Picker',
		props: {
			timeType: {
				type: String,
				default: () => 'day'
			},
			disabled: {
				type: Boolean,
				default: () => false
			},
			// 是否显示图标
			iconshow: {
				type: Boolean,
				default: () => true
			},
			placeholder: {
				type: String,
				default () {
					return '请选择'
				}
			},
			childValue: {
				default () {
					return ''
				}
			},
			//最小的选择日期2020/01/01
			minSelect: {
				type: String,
				default: () => '1577808000'
			},
			//最大的选择日期2050/12/31
			maxSelect: {
				type: String,
				default: () => '2556028800'
			},
		},
		data() {
			return {
				index: [0],
				array: [],
				yearArr: [], // 年份数组
				monthArr: [], // 月份数组
				yearIndex: 0, // 年份选中下标
				showTime: this.moment(this.childValue*1000),
				iconTrans: false,   // 左侧的小三角是否旋转
			}
		},
		methods: {
			rotateRight(){
				this.iconTrans = !this.iconTrans	
			},
			moment(strTime) {
				let type = this.timeType
				if (!strTime) {
					return
				}
				let time = new Date(strTime)
				let y = time.getFullYear()
				let m = time.getMonth() + 1
				m = m < 10 ? `0${m}` : m
				let d = time.getDate()
				d = d < 10 ? `0${d}` : d
				let hh = time.getHours()
				hh = hh < 10 ? `0${hh}` : hh
				let mm = time.getMinutes()
				mm = mm < 10 ? `0${mm}` : mm
				let ss = time.getSeconds()
				ss = ss < 10 ? `0${ss}` : ss
				let value = `${y}/${m}/${d} ${hh}:${mm}:${ss}`
				if (type === 'year') {
					value = `${y}`
				}
				if (type === 'month') {
					value = `${y}-${m}`
				}
				if (type === 'day') {
					value = `${y}-${m}-${d}`
				}
				return value
				
			},
			/**
			 * [setDefaultValue 设置默认值]
			 */
			setDefaultValue() {
				console.log("this.minSelect=========",this.minSelect)
				console.log("this.maxSelect=========",this.maxSelect)
				let date = this.moment(new Date().getTime())
				this.valueEchoed(date)
			},
			bindDateChange(e) {
				this.childValue = e.target.value
				console.log("日期变化时this.childValue========",this.childValue)
			},
			dateInit() {
				console.log("this.minSelect=========",this.minSelect)
				console.log("this.maxSelect=========",this.maxSelect)
				this.array = []
				this.yearArr = []
				this.monthArr = []
				let minDate = this.moment(this.minSelect * 1000) || []
				let maxDate = this.moment(this.maxSelect * 1000) || []
				minDate = minDate ? minDate.split(' ') : ''
				maxDate = maxDate ? maxDate.split(' ') : ''
				minDate = minDate[0] ? minDate[0].split('-') : 1900
				maxDate = maxDate[0] ? maxDate[0].split('-') : 2050
				let type = this.timeType
				let {
					monthStar,
					monthEnd
				} = ''
				let yearStar = minDate[0] ? parseInt(minDate[0]) : 1900
				let yearEnd = maxDate[0] ? parseInt(maxDate[0]) : 2050
				if (type === 'day') {
					let dateStar = minDate[2] ? parseInt(minDate[2]) : 1
					let dateEnd = maxDate[2] ? parseInt(maxDate[2]) : 31
				}
				if (type === 'month' || type === 'day') {
					monthStar = minDate[1] ? parseInt(minDate[1]) : 1
					monthEnd = maxDate[1] ? parseInt(maxDate[1]) : 12
				}

				for (let y = yearStar; y <= yearEnd; y++) {
					let ytext = y < 10 ? `0${y}` : y
					this.yearArr.push(`${ytext}年`)
					if (type === 'month' || type === 'day') {
						let mGroup = this.getMonthArr(
							y,
							yearStar,
							yearEnd,
							monthStar,
							monthEnd,
							type
						)
						mGroup.length && this.monthArr.push(mGroup)
					}
				}

				this.array[0] = this.yearArr
				
				if (type === 'month' || type === 'day') {
					this.array[1] = this.monthArr.length && this.monthArr[0]
				}
				if (type === 'day') {
					this.array[2] = this.getDateArr(
						parseInt(this.yearArr[0]),
						parseInt(this.monthArr[0])
					)
				}
			},

			getMonthArr(y, yearStar, yearEnd, monthStar, monthEnd, type) {
				let mGroup = []
				let dateGroup = []
				if (y === yearStar && y !== yearEnd) {
					for (let m = monthStar; m <= 12; m++) {
						let mtext = m < 10 ? `0${m}` : m
						mGroup.push(`${mtext}月`)
					}
				}

				if (y === yearEnd && y !== yearStar) {

					for (let m = 1; m <= monthEnd; m++) {
						let mtext = m < 10 ? `0${m}` : m
						mGroup.push(`${mtext}月`)
					}

				}

				if (y !== yearStar && y !== yearEnd) {
					for (let m = 1; m <= 12; m++) {
						let mtext = m < 10 ? `0${m}` : m
						mGroup.push(`${mtext}月`)
					}
				}

				if (y === yearStar && y === yearEnd) {
					for (let m = monthStar; m <= monthEnd; m++) {
						let mtext = m < 10 ? `0${m}` : m
						mGroup.push(`${mtext}月`)
					}
				}
				return mGroup
			},
			getDateArr(y, m) {
				let minDate = this.moment(this.minSelect * 1000) || []
				let maxDate = this.moment(this.maxSelect * 1000) || []
				minDate = minDate.length && minDate.split('-')
				maxDate = maxDate.length && maxDate.split('-')
				let yearStar = minDate[0] ? parseInt(minDate[0]) : 1900
				let yearEnd = maxDate[0] ? parseInt(maxDate[0]) : 2050
				let monthStar = minDate[1] ? parseInt(minDate[1]) : 1
				let monthEnd = maxDate[1] ? parseInt(maxDate[1]) : 12
				let datearr = []
				let maxnum = 30
				let date31 = [1, 3, 5, 7, 8, 10, 12]
				if (date31.includes(m)) {
					maxnum = 31
				}
				// 判断是平年还是闰年的2月份
				if (m === 2) {
					if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) {
						maxnum = 29
					} else {
						maxnum = 28
					}
				}
				let dateStar = minDate[2] ? parseInt(minDate[2]) : 1
				let dateEnd = maxDate[2] ? parseInt(maxDate[2]) : maxnum
				if (
					(y !== yearEnd && y !== yearStar) ||
					(y === yearStar && m !== monthStar && m !== monthEnd) ||
					(y === yearEnd && m !== monthEnd && m !== monthStar) ||
					(yearStar === yearEnd && m !== monthStar && m !== monthEnd) ||
					(yearStar !== yearEnd && y === yearEnd && m !== monthEnd) ||
					(y === yearStar && m !== monthStar && y < yearEnd)
				) {

					for (let d = 1; d <= maxnum; d++) {
						let dtext = d < 10 ? `0${d}` : d
						datearr.push(`${dtext}日`)
					}
				}

				if ((yearStar === yearEnd && y === yearStar && m === monthStar && m !== monthEnd) || (yearStar !== yearEnd && y ===
						yearStar && m === monthStar)) {

					for (let d = dateStar; d <= maxnum; d++) {
						let dtext = d < 10 ? `0${d}` : d
						datearr.push(`${dtext}日`)
					}
				}

				if ((y === yearEnd && m === monthEnd && m !== monthStar && yearStar === yearEnd) || (y === yearEnd && yearStar !==
						yearEnd && m === monthEnd)) {

					for (let d = 1; d <= dateEnd; d++) {
						let dtext = d < 10 ? `0${d}` : d
						datearr.push(`${dtext}日`)
					}
				}

				if (
					y === yearStar &&
					yearStar === yearEnd &&
					m === monthStar &&
					monthStar === monthEnd
				) {

					for (let d = dateStar; d <= dateEnd; d++) {
						let dtext = d < 10 ? `0${d}` : d
						datearr.push(`${dtext}日`)
					}
				}
				return datearr
			},

			
			bindTimeChange(e) {
				// 确认选择时，需要旋转
				this.iconTrans = !this.iconTrans
				let timeValue = ''
				let indexArr = e.detail.value
				let type = this.timeType
				let year = parseInt(this.array[0][parseInt(indexArr[0]) || 0])
				let month = ''
				timeValue = year + ''
				if (type === 'month' || type === 'day') {
					let index = parseInt(indexArr[1]) || 0
					index = index < 0 ? 0 : index
					month = parseInt(this.array[1][index])
					month = month < 10 ? `0${month}` : month
					timeValue = `${timeValue}-${month}`
				}
				if (type === 'day') {
					let dateindex = parseInt(indexArr[2]) || 0
					dateindex = dateindex < 0 ? 0 : dateindex
					let date = parseInt(this.array[2][dateindex])
					date = date < 10 ? `0${date}` : date
					timeValue = `${timeValue}-${date}`
				}
				this.showTime = timeValue
				console.log("this.showTime==============",this.showTime)
				// 转换成时间戳传回
				this.$emit('getData', (new Date(timeValue)).getTime() / 1000)
				
			},
			// 取消选择时，同样需要旋转回来
			cancelSelect(){
				this.iconTrans = !this.iconTrans
			},
			// 当时发生改变时 加载对应的分钟数组
			columnchange(e) {
				const minIndex = e.detail.value
				const column = e.detail.column
				let type = this.timeType
				this.$set(this.index, column, minIndex)

				if (column === 0) {
					this.yearIndex = minIndex
					if (type === 'month' || type === 'day') {
						this.$set(this.array, 1, this.monthArr[minIndex])
					}
					if (type === 'day') {
						let monthindex = this.index[1] || 0

						let newDateArr = this.getDateArr(
							parseInt(this.yearArr[minIndex]),
							parseInt(this.monthArr[this.yearIndex][monthindex])
						)
						this.$set(this.array, 2, newDateArr)
					}
				}
				if (column === 1 && type === 'day') {
					let newDateArr = this.getDateArr(
						parseInt(this.yearArr[this.yearIndex]),
						parseInt(this.monthArr[this.yearIndex][minIndex])
					)
					this.$set(this.array, 2, newDateArr)
				}
			},
			valueEchoed(defaultTime) {
				this.index = [0]
				if (this.childValue || defaultTime) {
					let value = this.childValue || defaultTime
					value = this.moment(value)
					value = value.split('-')
					let index =
						this.array[0].findIndex(
							item => parseInt(item) === parseInt(value[0])
						) || 0
						index = index === -1 ? 0 : index
					this.index[0] = index
					this.yearIndex = index
					
					let type = this.timeType
					if (type === 'month' || type === 'day') {
						this.array[1] = this.monthArr.length && this.monthArr[index]
						const monthindex =
							(this.array[1] && this.array[1].length &&
								this.array[1].findIndex(
									item => parseInt(item) === parseInt(value[1])
								)) ||
							0
						this.index[1] = monthindex
					}
					if (type === 'day') {
						let index0 = this.index[0] || 0
						let index1 = this.index[1] || 0
						index0 = index0 === -1 ? 0 : index0
						index1 = index1 === -1 ? 0 : index1
						let newDay = this.getDateArr(
							parseInt(this.yearArr[index0]),
							parseInt(this.monthArr[index0][index1])
						)
						this.getDateIndex(newDay)
					}
				}
			},
			getDateIndex(newDay) {
				let defaultTime = this.moment(new Date().getTime())
				let value = this.childValue || defaultTime
				value = this.moment(value)
				value = value.split('-')
				this.array[2] = newDay
				let dateindex =
					this.array[2].findIndex(
						item => parseInt(item) === parseInt(value[2])
					) || 0
				this.index[2] = dateindex
			}
		},

		watch: {
			// 监测组件最小选择范围发生改变 初始化日期数据
			minSelect() {
				this.dateInit()
				this.setDefaultValue()
			},
			// 监测组件最大可选范围发生改变 初始化日期数据
			maxSelect() {
				this.dateInit()
				this.setDefaultValue()
			},
			childValue() {
				console.log("watch:childValue==========",this.childValue)
				this.showTime = ''
				this.showTime = this.moment(this.childValue*1000);
				console.log("watch:showTime==========",this.showTime)
				this.dateInit()
				this.setDefaultValue()
				
			}
		},
		created() {
			console.log("childValue==========",this.childValue)
			this.dateInit()
			this.valueEchoed()
			console.log("!this.childValue==========",!this.childValue)
			if (!this.childValue) {
				this.setDefaultValue()
			}
		}
	}
</script>

<style lang="less">
	.tx_r {
		line-height: 48px;
		font-size: 15px;
		font-weight: normal;
		color: #848b9a;
		
	}

	.placeholder {
		color: #b5b8c2;
		font-size: 30rpx;
	}

	.fa-angle-right {
		font-size: 36rpx;
		padding-left: 12rpx;
	}
	.iconPicker {
		
	}
	// 下拉选择小三角
	.icon {
	    position: absolute;
	    top: 10px;
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
		z-index: 3
	}
	.uni-input{
		line-height: 28px;
		text-align: center;
		font-size: 14px;
		margin-right: 12px;
	}
	.iconTrans {
	    transform: rotate(180deg);
	    -webkit-transition: transform .25s linear;
	    -moz-transition: transform .25s linear;
	    -o-transition: transform .25s linear;
	    transition: transform .25s linear;
	}
</style>
