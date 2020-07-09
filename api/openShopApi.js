import request from "../util/request";
//申请开店
export function applyForShop(storeName,address,isChain,category,leaderName,leaderTel){
	return request({
		url:'/api/shopping/applyForShop',
		method:'post',
		params: {
		  storeName,
		  address,
		  isChain,
		  category,
		  leaderName,
		  leaderTel
		}
	})
}

//申请开店的类型
export function getCategories() {
    return request({
        url: '/api/shopping/category',
        method: 'get'
    })
}