import request from '../util/request.js'

// 商家申请提现
export function moneyOut(money,cardCode,tradePassword){
	return request({
		url:'/api/moneyOut/require',
		method:'post',
		params:{
			money,
			cardCode,
			tradePassword
		}
	})
}

// 查询账户流水
export function accountHistory(){
	return request({
		url:'/api/money/store/history',
		method:'get'
	})
}

// 查询余额
export function inquire(){
	return request({
		url:'/api/userInfo/balance/store',
		method:'get'
	})
}
//商家编辑信息
export function businessEditor(imgUrl,address,mDesc,contactPhones,startTime,endTime,id){
	return request({
		url:'/api/shopping/updateShop',
		method:'put',
		params:{
			imgUrl,
			address,
			mDesc,
			contactPhones,
			startTime,
			endTime,
			id,
		}
	})
}
//修改用户头像接口
export function uploadImg(filePath){
	return request({
		url:'/api/upload/images',
		method:'post',
		params:{
			filePath,
		}
	})
}
