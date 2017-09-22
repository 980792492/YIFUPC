import * as types from '../types'
import Api from '@/utils/Api'


const  state = {
	vip:{
		liveData: null,  //初始化vip的直播页 的数据;
		liveMessage: null,     //vip直播数据
		liveChatMessage: null,    //vip的chat数据
		riliDate: null,           //vip的日历选择的时间	
		
		rePlyId: null,           //vip的点击回复按钮
		replyName: '',
    	status: false,        //vip的回复状态
	},
	// 直播观点
	viplive: {
	  status: false,
	  quoteId: null,
	  quoteUserName: null,
	},

	
}



const getters = {
	
	vipLiveData: state => state.vip.liveData ?  state.vip.liveData : '' ,
	vipRoomId: state => state.vip.liveData ? state.vip.liveData.RoomId : '',
	vipRiliDate: state => state.vip.riliDate ? state.vip.riliDate : '',
	
	replyStatus: state => state.vip.status ? state.vip.status : false,
	replyId: state => state.vip.rePlyId ?  state.vip.rePlyId : null,
	replyUserName: state => state.vip.replyName ? state.vip.replyName : '',
	
	
	quoteStatus: state => state.viplive.status ? state.viplive.status : false,
	quoteId: state => state.viplive.quoteId ? state.viplive.quoteId : null,
	quoteUserName: state => state.viplive. quoteUserName ? state.viplive. quoteUserName : null
	
}



const actions = {
	initVipLiveData({commit}, data){
		commit(types.INIT_VIP_LIVE_DATA, data)
	},

	initLiveMessage({commit}, token, id, startTime, endTime){
		const api = new Api()
		api.get('/TrainingRoom/Message', params).then(resp => {
			
			
			
		})
		
	},
	
//	存储直播室加载消息的日期(保存日历的点击事件的选中日期)
	initRiliDate({commit}, data){
		commit(types.INIT_VIP_RILI_DATA, data)
	}
	
	
	
	
}



const mutations = {
	[types.INIT_VIP_LIVE_DATA] (state, data) {
		state.vip.liveData = data
	},
	
	[types.INIT_VIP_RILI_DATA] (state, data) {
		state.vip.riliDate = data
		
	},
	
	[types.SET_VIPCHAT_REPLY] (state, data) {    //回复
		console.log(data)
		state.vip.rePlyId = data.id
		state.vip.replyName = data.username
		state.vip.status = !state.vip.status
	},
	
	[types.CANCEL_VIPCHAT_REPLY](state) {       //取消回复
		state.vip.rePlyId = null
    	state.vip.replyName = null
	},
	
	[types.SET_VIPLIVE_QUOTE] (state, data) {    //引用
		console.log(data)
		state.viplive.status = !state.viplive.status
    	state.viplive.quoteId = data.id
    	state.viplive.quoteUserName = data.username
	},
	
	[types.CANCEL_VIPLIVE_QUOTE](state){      //取消引用
		 state.viplive.quoteId = null
    	state.viplive.quoteUserName = null
	}
	
	
}



export default {
	state,
	getters,
	actions,
	mutations
}
