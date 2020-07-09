import store from "../store/index";
import {getStoreOrder} from "../api/orderApi";

const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = false;
innerAudioContext.src = 'https://rbkj-judan.oss-cn-shenzhen.aliyuncs.com/store/voice/preVoice.mp3';
innerAudioContext.onPlay(() => {
    console.log('开始播放');  
});
// innerAudioContext.onError((res) => {
//     console.log('innerAudioContext err');
//     console.log(res.errMsg);
//     console.log(res.errCode);
// });
	
//  没做推送，先每10秒刷新订单列表
setInterval(()=> {
	console.log("刷新订单列表==>",store.state.storeInfo)
	let oldId;
    if (store.state.storeInfo.id != null) {   // 如果商铺的id不为空
		console.log("商家订单列表xOrderList",store.state.xOrderList)
        if (store.state.xOrderList.length == 0) {
            var lastId = 0;
        } else {
            var lastId = store.state.xOrderList[0].sort_id;// xOrderList数组中最前面的一个
			getStoreOrder(store.state.storeInfo.id, 2, lastId).then(res => {
				console.log("res.data===>",res.data)
				store.state.xOrderList.sort((a, b) => {
					return b.sort_id - a.sort_id;
				});
			
				oldId = store.state.xOrderList.length > 0 ? parseInt(store.state.xOrderList[0].sort_id) : 0;
				let newData = [...res.data];
				newData.sort((a, b) => {
					return b.sort_id - a.sort_id;
				});
				let newId = newData.length > 0 ? parseInt(newData[0].sort_id) : 0;
				store.state.xOrderList = res.data;
				if (oldId != newId) {
					console.log('newId', newId);
					console.log('oldId', oldId);
					if (newId == null){
						// 播放取消订单音频
						return;
					} else if (newId < oldId){
						// 播放新订单音频
						innerAudioContext.play();
					} else {
						// 播放取消订单音频
						return;
					}
				}
			}).catch((err) => {
				console.error('loadOrder error');
				console.error(err);
			});
		}	
    }
}, 5000);