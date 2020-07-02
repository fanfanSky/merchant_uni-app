import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// const NODE_ENV = 'development';
const NODE_ENV = 'production';
if (NODE_ENV === 'development') {
	var url = 'http://120.25.215.46/api/';  // 开发环境
	var bucketName = 'rbkj-judan-store';
} else {
	var url = 'https://www.gxrongbangkeji.com/api';  // 生产环境
	var bucketName = 'rbkj-judan-store';
}


const store = new Vuex.Store({
	state: {
		host: url,
		oss: {
			bucketName: bucketName,
			key: '',
			secret: '',
			url: ''
		},
		storeInfo: {},
		updatePwdTime: 0,  
		balance: 0,
		xOrderList: [],
		bankCardList:[],
		// 暂存使用说明模板
		useInstructionTemplate:{
			id:'',
			storeId:'',
			templatesName:'',
			templatesContent:''
		},
		// 暂存录入代金券信息
		gInfoCash: {
			storeId:'',	  // 商家ID
			type: 1,	 // 1.代金券 2.套餐
			name: '', 	 // 代金券名称
			price: 0,    // 实际售价
			value: 0,    // 实际售价
			storeSubsidy: 0,   // 商家让利的价格
			buyTimeLimit: '',//限购预约张数
			needReserve: 0, //是否可预约（默认0表示免预约，1表示需预约）
			mName:'',  // 已选择说明模板的名称
			mDesc:''  ,// 说明模板textarea内的内容(使用说明)
			from_maxSelect: '2556028800',	 // 最大的选择日期2050/12/31
			to_maxSelect: '2556028800',		 // 最大到哪个日期截止2050/12/31
			startTime: '',                  // 从哪个时间开始
			expireTime: '',  				 // 到哪个时间结束
		},
		gInfoUp: {
			id:0, // 套餐ID
			storeId:'',//店铺ID
			type: 2, // 商品类型：1.代金券 2.套餐
			name: '', 	 //套餐名称
			value: 0,    // 菜品总价
			storeSubsidy: 0,   // 商家让利的价格
			numDiscount: '',   // 输入多少折扣
			benefitMethod:true, // 优惠方式：1.商家让利，2.折扣
			price: 0,    // 实际售价
			foodDesc:'',  //菜品描述
			totalPrice: 0, //套餐总价
			buyTimeLimit: '',//限购预约张数
			needReserve: 0,  // 是否可预约（默认0表示免预约，1表示需预约）
			limitBuy: false,
			imgUrl: [], //保存图片路径集合
			imgUrlList: [], //保存得到的远程图片路径集合
			imageLength: 9, //限制图片张数
			foods: [],
			foodsJson:'',
			mDesc:'',	// 使用说明
			from_maxSelect: '2556028800',	 // 最大的选择日期2050/12/31
			to_maxSelect: '2556028800',		 // 最大到哪个日期截止2050/12/31
			startTime: '',                  // 从哪个时间开始
			expireTime: '',  				 // 到哪个时间结束
		},
		gInfoNew: {
			storeId:'',	  // 商家ID
			type: 2,	 // 1.代金券 2.套餐
			name: '', 	 //套餐名称
			price: 0,    // 实际售价
			value: 0,    // 菜品总价
			foodDesc:'',  //菜品描述
			num: 0,      //数量
			totalPrice: 0, //套餐总价
			storeSubsidy: 0,   // 商家让利的价格
			numDiscount: '',   // 输入多少折扣
			benefitMethod:'1', // 优惠方式：1.商家让利，2.折扣
			buyTimeLimit: '',//限购预约张数
			needReserve: 0, //是否可预约（默认0表示免预约，1表示需预约）
			imgUrl: [], //保存图片路径集合
			imgUrlList: [], //保存得到的远程图片路径集合
			imageLength: 9, //限制图片张数
			foods: [],	// 添加商品时压入的数组，渲染在页面上
			foodsJson:'', // 传给后端的套餐内商品内容的json数组
			mDesc:'',  // 说明模板textarea内的内容(使用说明)
			startTime: '',                  // 从哪个时间开始
			expireTime: '',  				 // 到哪个时间结束
		},
	}
})

export default store
