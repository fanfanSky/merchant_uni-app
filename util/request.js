import store from '../store/index.js'
import {
	getToken, removeToken, logout
} from './auth.js'
import log from './logger'

const uniRequest = function (params) {
	uni.request(params);
	this.successFn = null;
	this.errFn = null;
	this.finallyFn = null;
	this.then = function (fn) {
		this.successFn = fn;
		return this;
	};
	this.catch = function (fn) {
		this.errFn = fn;
		return this;
	};
	this.finally = function (fn) {
		this.finallyFn = fn;
		return this;
	}
}

const request = function(params) {
	params.url = store.state.host + params.url;
	if (params.params) {
		params.data = params.params;
	}
	params.success = (res) => {
		if (res.statusCode == 200) {
			log.debug('request success ' + params.url);
			log.debug(res);
			if (res.data.code == 20000) {
				if (newRequest.successFn)
					newRequest.successFn(res.data);
			} else {
				let code = res.data.code;
				//	4开头错误，重新登录
				if (code.toString().substring(0,1) == 4) {
					logout();
				} else
				// 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
				if (code == 50008 || code == 50012 || code == 50014) {
				//	跳转到登陆页面
					logout();
				} else
				if (newRequest.errFn)
					newRequest.errFn(res);
				else
					uni.showModal({
						title: '错误',
						content: res.data.msg,
						showCancel: false
					});
			}
		} else {
			log.debug('request fail ' + params.url);
			log.debug(res);
			if (newRequest.errFn)
				newRequest.errFn(res);
			else
				uni.showModal({
					title: '错误',
					content: '连接服务器出错',
					showCancel: false
				});
		}
	};
	params.fail = (err) => {
		log.debug('request fail ' + params.url);
		log.debug(err);
		if (newRequest.errFn)
			newRequest.errFn(res);
		else {
			uni.showModal({
				title: '错误',
				content: '连接服务器出错',
				showCancel: false
			});
		}
	};
	params.complete = (res) => {
		log.debug('request complete ' + params.url);
		log.debug(res);
		if (newRequest.finallyFn)
			newRequest.finallyFn(res);
	};
	if (params.header == null)
		params.header = {};
	if (params.header['content-type'] == null)
		params.header['content-type'] = 'application/x-www-form-urlencoded';

	var token = getToken()
	if (token) {
		params.header.Authorization = token;
	}

	log.debug('params');
	log.debug(params)
	var newRequest = new uniRequest(params);
	return newRequest;
};

export default request
