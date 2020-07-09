import request from '../util/request.js'

// 获取商家订单
export function getStoreOrder(storeId,status,lastId){
	return request({
		url:'/api/order/store',
		method: 'get',
		params:{
			storeId,
			status,
			lastId
		}
	})
}

// 获取客户端订单
export function getClientOrder(status){
	return request({
		url:'/api/order/list',
		method:'get',
		params:{
			status
		}
	})
}

// 商家拒绝预约
export function rejectPre(couponId,comment){
	return request({
		url:'/api/order/rejectPre/'+couponId,
		method: 'put',
		params:{
			comment
		}
	})
}

// 设置餐号
export function setMealNumber(couponId,bookId){
	return request({
		url:'/api/order/setBookId',
		method:'put',
		params:{
			couponId,
			bookId
		}
	})
}

//	已出餐
export function preOver(historyId) {
	return request({
		url:'/api/order/over',
		method:'put',
		params:{
			historyId
		}
	})
}


