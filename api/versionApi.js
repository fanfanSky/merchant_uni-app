import request from '../util/request.js'


// 用户登录
export function getVersion() {
    return request({
        url: '/version/latest',
        method: 'get',
        params: {
            "applicationId": 1,
            "os": 1
        }
    })
}