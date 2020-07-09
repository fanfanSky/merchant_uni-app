import request from '../util/request.js'

// 获取签名
export function getSignature(fileType){
	return request({
		url:'/upload/uploadSignature',
		method:'get',
		header: {
		    'content-type': 'application/json'
		},
		params:{
			fileType
		}
	})
}