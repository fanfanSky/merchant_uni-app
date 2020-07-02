import Vue from 'vue'
import moment from 'moment'// 导入moment
import App from './App'
import store from './store/index.js'
import logger from './util/logger.js'
import VueLazyload from 'vue-lazyload'  //引入这个懒加载插件
import md5 from 'js-md5'   // md5加密
import uploadProductsImgs from './components/upload-Products-Imgs/upload-Products-Imgs.vue'
Vue.component('uploadProductsImgs',uploadProductsImgs)
Vue.use(VueLazyload,{lazyComponent:true})
// 注册处理时间的全局过滤器
Vue.filter("formatTime", function (time) {
	// .format 传入的是格式 YYYY MM
	return moment(time).format("YYYY-MM-DD  HH:mm:ss");
});
// 注册处理保留数字小数点后2位(带四舍五入)
Vue.filter("foodCardFilter",function(value){
	let realVal = ''
	if (!isNaN(value) && value !== '') {
	  // 截取当前数据到小数点后两位
	  realVal = Number(value).toFixed(2);
	  console.log("realVal===",typeof(realVal))
	  //正则表达
	  realVal = realVal.replace(/(0+)$/g,"");//去掉后面无用的零
	  realVal = realVal.replace(/[.]$/g, "");//如小数点后面全是零则去掉小数点
	} else {
	  realVal = '--'
	}
	return realVal
});
// 过滤银行卡号中间的位数*替代
Vue.filter("hideMiddle",function(val){
	return `${val.substring(0,0)} **** ${val.substring(val.length-4)}`
})

/**
 * 获取当前时间
 * 格式YYYY-MM-DD
 */
Vue.prototype.getNowFormatDate = function() {
  var date = new Date();
  var seperator1 = "/";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
};
// 统一提示弹窗形式
Vue.prototype.PopShowToastTips = function (message){return uni.showToast({ title:message,icon:'none',duration:1500,position:'bottom' })}
Vue.prototype.$moment = moment;
Vue.prototype.$store = store;
Vue.prototype.$log = logger;
Vue.prototype.$md5 = md5

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()

