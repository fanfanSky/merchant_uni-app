//你的阿里云地址最后面跟上一个/   在你当前小程序的后台的uploadFile 合法域名也要配上这个域名
let fileHost = 'https://rbkj-judan.oss-cn-shenzhen.aliyuncs.com/';

let config = {
	// 默认存在根目录，可根据需求改
	uploadImageUrl: `${fileHost}`,
	// AccessKeySecret 去你的阿里云上控制台上找
	AccessKeySecret: 'BRXyYq0brnRB3CeI324xAbc1O7HPPs',
	// AccessKeyId 去你的阿里云上控制台上找
	OSSAccessKeyId: 'LTAI4G93Tq2dLj9TPiNcY5Tm',
	// // 阿里云oos上传目录(必须存在)
	oosDirectory: 'store/images/',
	// 上传最大张数
	count:9,
	// 上传图片背景修改
	upBgColor: '#E8A400',
	//这个是上传文件时Policy的失效时间
	timeout: 87600
};
module.exports = config
