import log from './logger'

const TokenKey = 'Admin-Token'
const storeId = 'storeId';
const OssKey = 'ossKey';
const OssSecret = 'ossSecret';

export function getToken() {
  return uni.getStorageSync(TokenKey);
}

export function getStoreId() {
  return uni.getStorageSync(storeId);
}

export function setStoreId(id) {
  return uni.setStorage({
    key: storeId,
    data: id,
    success: function () {
      log.debug('success');
    }
  });
}

export function setToken(token) {
	require('../service/orderTask');
	require('../service/moneyTask');
	return uni.setStorage({
		key: TokenKey,
		data: token,
		success: function () {
		  log.debug('success');
		}
	});
}

export function removeToken() {
  return uni.removeStorage({
    key: TokenKey,
    success: function (res) {
      log.debug('success');
    }
  });
}

export function logout() {
  log.debug('logout');
  removeToken();
  uni.reLaunch({
    url: '/pages/login'
  });
}