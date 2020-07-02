import request from "../util/request";

// ��ȡ��Ʒ�б�
export function getGoodsList(storeId) {
    return request({
        url: '/api/goods/store/coupon/list/'+storeId,
        method: 'get'
    })
}

export function createGood(params) {
    return request({
        url: '/api/goods/coupon/create',
        method: 'post',
        header: {
            'content-type': 'application/json'
        },
        params
    })
}

export function deleteGood(id) {
    return request({
        url: '/api/goods/coupon/delete/' + id,
        method: 'delete'
    })
}

export function useCoupoon(params) {
    return request({
        url: '/api/goods/useCoupon',
        method: 'post',
        params
    })
}
//ɾ������ȯ
export function deletecoupon(couponId) {
    return request({
        url: '/api/goods/coupon/delete/' + couponId,
        method: 'delete'
    })
}

// ��ȡ��Ʒ����
export function getGoodsDetail(productId){
	return request({
		url:'/api/goods/coupon/detail/'+productId,
		method:'get'
	})
}
// �޸���Ʒ��Ϣ
export function getEditGoods(params){
	return request({
		url:'/api/goods/coupon/edit',
		header: {
		    'content-type': 'application/json'
		},
		method:'post',
		params
	})
}