// 代金券有效期开始日期
function timestampStart(startTime) {
	var date = new Date(startTime * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var start_Y = date.getFullYear() + '/';
	var start_M = date.getMonth()+1 + '/';
	var start_D = date.getDate();
	return start_Y+start_M+start_D;
}
// 代金券有效期结束日期
function timestampExpire(expireTime) {
	var date = new Date(expireTime * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var expire_Y = date.getFullYear() + '/';
	var expire_M = date.getMonth()+1 + '/';
	var expire_D = date.getDate();
	return expire_Y+expire_M+expire_D;
}

export {
	timestampStart,
	timestampExpire
}