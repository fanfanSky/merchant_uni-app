import request from '../util/request.js'

// 获取短信验证码
export function getMsmVcode(phone,type){
	return request({
		url:'/api/sms/requireCode',
		method:'post',
		params:{
			phone,
			type
		}
	})
}