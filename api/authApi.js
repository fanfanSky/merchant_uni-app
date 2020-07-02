import request from '../util/request.js'


// 用户登录
export function login(username, password) {
  return request({
    url: '/account/login',
    method: 'post',
    params: {
      "username": username,
      "password": password
    }
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/account/info',
    method: 'get'
  })
}

// 获取商家信息
export function getStoreInfo() {
  return request({
    url: '/api/shopping/restaurant/'+storeId,
    method: 'get'
  })
}
//商家模板列表
export function getTemplateList(type,storeId) {
  return request({
    url: '/api/store/templates/list',
    method: 'post',
	header: {
	    'content-type': 'application/json'
	},
	params: {
	  "type": type,
	  "storeId": storeId
	}
	
  })
}
//商家模板编辑
export function getTemplateEdit(id,templatesName,templatesContent) {
  return request({
    url: '/api/store/templates/edit',
	header: {
	    'content-type': 'application/json'
	},
    method: 'post',
	params: {
	  "id": id,
	  "templatesName":templatesName,
	  "templatesContent":templatesContent
	}
	
  })
}
//商家模板添加
export function Addtemplate(type,storeId,templatesName,templatesContent) {
  return request({
    url: '/api/store/templates/add',
    method: 'post',
	header: {
	    'content-type': 'application/json'
	},
	params: {
	  "type": type,
	  "storeId":storeId,
	  "templatesName":templatesName,
	  "templatesContent":templatesContent
	}
	
  })
}

//商家模板删除
export function deleteTemplate(id) {
  return request({
    url: '/api/store/templates/delete',
    method: 'post',
	header: {
	    'content-type': 'application/json'
	},
	params: {
	  "id": id,
	}
	
  })
}
//获取商品公共使用模板列表
export function commentTemplate(type) {
  return request({
    url: '/api/templates/list',
	header: {
	    'content-type': 'application/json'
	},
    method: 'post',
	params: {
	  "type": type,
	}
	
  })
}

// 登出商家端
export function logout() {
  console.log('logout')
  return request({
    url: '/account/logout',
    method: 'post'
  })
}

// 修改密码
export function updatePwd(password,code) {
  return request({
    url: '/account/updatePwd/code',
    method: 'put',
    params:{
		password,
		code
	}
  })
}

// 修改交易密码
export function updateTradePwd(trade_password,code) {
  return request({
    url: '/account/updateTrade_pwd/code',
    method: 'put',
    params:{
		trade_password,
		code
	}
  })
}

// 更新Token
export function refreshToken(params) {
  return request({
    url: '/account/refreshToken',
    method: 'put',
    params
  })
}
// 后台取得OSS信息
export function getOssKey(params) {
  return request({
    url: '/api/properties/ossKey',
    method: 'get',
    params: params
  });
}

// 意见反馈
export function feedBack(comment){
	return request({
		url:'/api/complaint/create/store',
		method:'post',
		params:{
			comment
		}
	})
}