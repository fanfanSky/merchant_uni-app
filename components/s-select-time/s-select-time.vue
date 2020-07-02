<template>
    <view class="time-container">
        <view class="item-container" v-for="(item, index) in timeList" :key="index">
            <view class="time-item" @click="selectTime(item)" :class="{
                'disabled-time': item.disabled,
                'clicked-time': !item.disabled && item.selected,
                'range-time': item.range,
                'start-time': true,
                'end-time': item.end,
            }">
                <view>{{item.time}}</view>
                <view class="tip-font" v-if="item.start">开始</view>
                <view class="tip-font" v-if="item.end">结束</view>
            </view>
            <view class="time-space" :class="{
                'range-space': item.rangeHelp
            }"></view>
        </view>
    </view>
</template>

<script>
import moment from 'moment/min/moment.min.js'
export default {
    name: 'SSelectTime',
    props: {
        currentTime: {
            type: String,
            default: '2019-12-27 08:30'
        },
        currentDate: {
            type: String,
            default: '2019-12-27'
        },
        interval: {
            type: Number, // 时间间隔取值1-60整数分钟
            default: 30
        },
        startTime: {
            type: String,
            default: '7:00'
        },
        endTime: {
            type: String,
            default: '20:00'
        },
        disabledTime: {
            type: Array,
            default: () => []
        },
        isDisabled: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            timeList: [],
            selectedTime: []
        }
    },
    methods: {
        timeAdd (time, minute) {
            const arr = time.split(':')
            if (Number(arr[1]) + minute < 10) {
                return `${this.timeHandle(arr[0])}:0${Number(arr[1]) + minute}`
            } else if (Number(arr[1]) + minute >= 10 && Number(arr[1]) + minute < 60) {
                return `${this.timeHandle(arr[0])}:${Number(arr[1]) + minute}`
            } else if (Number(arr[1]) + minute >= 60) {
                if (Number(arr[1]) + minute - 60 < 10) {
                    if (Number(arr[0]) === 23) {
                        return `00:0${Number(arr[1]) + minute - 60}`
                    } else {
                        return `${this.timeHandle(Number(arr[0]) + 1)}:0${Number(arr[1]) + minute - 60}`
                    }
                } else {
                    if (Number(arr[0]) === 23) {
                        return `00:${Number(arr[1]) + minute - 60}`
                    } else {
                        return `${this.timeHandle(Number(arr[0]) + 1)}:${Number(arr[1]) + minute - 60}`
                    }
                }
            }
        },
        timeHandle (Number) {
            if (`${Number}`.length < 2) {
                return `0${Number}`
            } else {
                return `${Number}`
            }
        },
        hadleData () { // 处理数据
            let start = this.startTime
            const end = this.endTime
            while (moment(`${this.currentDate} ${this.timeAdd(start, this.interval)}`) < moment(`${this.currentDate} ${this.timeAdd(end, 0)}`)) {
                const item = {
                    time: this.timeAdd(start, this.interval),
                    selected: false,
                    disabled: this.isDisabled && moment(`${this.currentDate} ${this.timeAdd(start, this.interval)}`) < moment(this.currentTime),
                    range: false,
                    rangeHelp: false,
                    start: false,
                    end: false
                }
                start = item.time
                this.timeList.push(item)
            }
            const starteItem = {
                time: this.timeAdd(this.startTime, 0),
                selected: false,
                disabled: this.isDisabled && moment(`${this.currentDate} ${this.timeAdd(this.startTime, 0)}`) < moment(this.currentTime),
                range: false,
                rangeHelp: false,
                start: false,
                end: false
            }
            this.timeList.unshift(starteItem)
            const endItem = {
                time: this.timeAdd(this.endTime, 0),
                selected: false,
                disabled: this.isDisabled && moment(`${this.currentDate} ${this.timeAdd(this.endTime, 0)}`) < moment(this.currentTime),
                range: false,
                rangeHelp: false,
                start: false,
                end: false
            }
            this.timeList.push(endItem)
        },
        selectTime (item) { // 选择时间
            if (!item.disabled && !item.selected) {
                for (const items of this.timeList) {
                    if (items.time === item.time) {
                        if (this.selectedTime.length < 2) {
                            items.selected = true
                            this.selectedTime.push(item.time)
                        }
                    }
                }
            } else if (!item.disabled && item.selected) { // 点击选中的时间取消选中，将该时间从选择的时间数组中删除
                for (const items of this.timeList) {
                    if (items.time === item.time) {
                        items.selected = false
                        items.start = false
                        items.end = false
                        this.selectedTime.splice(this.selectedTime.indexOf(item.time), 1)
                    }
                }
            }
            if (this.selectedTime.length < 2) {
                for (const items of this.timeList) {
                    if (this.selectedTime.length === 1) {
                        if (items.time === this.selectedTime[0]) {
                            items.start = true
                            items.end = false
                        }
                    } else {
                        items.start = false
                        items.end = false
                    }
                    items.range = false
                    items.rangeHelp = false
                }
            } else {
                const timeStrat = this.selectedTime[0]
                const timeEnd = this.selectedTime[1]
                const arr = []
                if (moment(`${this.currentDate} ${timeStrat}`) > moment(`${this.currentDate} ${timeEnd}`)) {
                    arr[0] = timeEnd
                    arr[1] = timeStrat
                } else {
                    arr[0] = timeStrat
                    arr[1] = timeEnd
                }
                for (const itemTime of this.timeList) {
                    if (itemTime.time === arr[0]) {
                        itemTime.start = true
                        itemTime.end = false
                    } else if (itemTime.time === arr[1]) {
                        itemTime.start = false
                        itemTime.end = true
                    } else {
                        itemTime.start = false
                        itemTime.end = false
                    }
                    if (moment(`${this.currentDate} ${itemTime.time}`) > moment(`${this.currentDate} ${arr[0]}`) && moment(`${this.currentDate} ${itemTime.time}`) < moment(`${this.currentDate} ${arr[1]}`)) {
                        itemTime.range = true
                        itemTime.rangeHelp = true
                    } else if (itemTime.time === arr[0]) {
                        itemTime.rangeHelp = true
                    } else {
                        itemTime.range = false
                        itemTime.rangeHelp = false
                    }
                }
            }
            this.$emit('selectedTime', this.selectedTime)
        }
    },
    created () {
        this.hadleData()
        if (this.disabledTime.length > 0) {
            for (const item of this.disabledTime) {
                const startT = moment(`${this.currentDate} ${this.timeList[0].time}`)
                const endT = moment(`${this.currentDate} ${this.timeList[this.timeList.length - 1].time}`)
                const start = moment(`${this.currentDate} ${this.timeAdd(item.start, 0)}`)
                const end = moment(`${this.currentDate} ${this.timeAdd(item.end, 0)}`)
                if (start > startT && start < endT) {
                    for (const timeItem of this.timeList) {
                        const itemTime = moment(`${this.currentDate} ${timeItem.time}`)
                        if (itemTime >= start && itemTime <= end) {
                            timeItem.disabled = true
                        }
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .time-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-top: 20upx;
        padding-bottom: 20upx;
        padding-left: 30upx;
        .item-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 10upx 0;

            .time-item {
                height: 90upx;
                width: 90upx;
                padding: 30upx 20upx 30upx 10upx;
                border:1upx solid rgba(206,207,218,1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                -webkit-border-radius: 8upx;
                -moz-border-radius: 8upx;
                border-radius: 8upx;
                color: #78829A;
                font-size: 30upx;
                position: relative;
                .tip-font {
                    font-size: 22upx;
                    position: absolute;
                    bottom: -8upx;
                    left: 20upx;
                }
            }
            .time-space {
                width: 10upx;
                height: 90upx;
            }
            // 禁选时间样式
            .disabled-time {
                background: #CECFDA;
            }
            // 点击选择时间样式
            .clicked-time {
                background: #1D8BE8;
                border: none;
                color: #ffffff;
            }
            // 选择时间之间时间的样式
            .range-time {
                border: none;
                background: #DDEEFC;
                color: #474F66;
                border-radius: 0;
            }
            // 中间部分
            .range-space {
                background: #DDEEFC;
            }
        }
    }
</style>
