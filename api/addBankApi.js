import request from '../util/request.js';

// 获取银行卡类型信息
export function getBankCardMsg(card_code) {
    return request({
        url: '/api/shopping/identifyBankCard/'+card_code,
        method: 'get'
    })
}

//
export function getBankShort(card_code) {
    return request({
        url: '/api/shopping/identifyBankShort/'+card_code,
        method: 'get'
    })
}

// 验证银行卡是否正确
export function isBankCardRight(card_code) {
    return request({
        url: '/api/shopping/checkBankCardRight/'+card_code,
        method: 'get'
    })
}

// 添加银行卡时需要的交易密码
export function getTradePwd(username,password) {
    return request({
        url: '/account/checkTradePwd',
        method: 'post',
		params:{
			username,
			password
		}
    })
}


// 添加银行卡发送接口
export function addBankCardMsg(bank_adress,opening_bank,card_code,store_name,tel,code) {
    return request({
        url: '/api/shopping/addBankCard',
        method: 'post',
		params:{
			bank_adress,
			opening_bank,
			card_code,
			store_name,tel,
			code
		}
    })
}

// 添加银行卡接收接口
export function getBankCardsMsg(store_name) {
    return request({
        url: '/api/shopping/getBankCards',
        method: 'get',
		params:{
			store_name
		}
    })
}

// 添加银行卡图标
export function gteBankCardIcon(card_code) {
    return request({
        url: '/identifyBankShort/'+card_code,
        method: 'get'
    })
}