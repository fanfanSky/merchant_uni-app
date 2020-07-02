import request from '../util/request.js'

// 获取验证码
export function getForgetPwdCode(phone) {
  return request({
    url: '/sms/pwdCode',
    method: 'post',
    params: {
      phone
    }
  })
}

// 获取店铺手机号
export function getStorePhone(account) {
  return request({
    url: '/getStorePhone',
    method: 'get',
    params: {
      account
    }
  })
}


// 忘记密码  确认修改密码
export function affirmNewPwd(account,password,code,phone) {
  return request({
    url: '/forgetPwd',
    method: 'post',
    params: {
      account,password,code,phone
    }
  })
}
