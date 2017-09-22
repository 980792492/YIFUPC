import * as types from '../types'
import Api from '@/utils/Api'


//1
const state = {
	room: {
		ads:[]
	}
}
//4
const getters = {
	roomAds1: state => {
		return {
			ImageUrl: state.room.ads[0] ? state.room.ads[0].ImageUrl : '',
			LinkUrl: state.room.ads[0] ? state.room.ads[0].LinkUrl : '',
		}
	},
	roomAds2: state => {
		return {
			ImageUrl: state.room.ads[1] ? state.room.ads[1].ImageUrl : '',
			LinkUrl: state.room.ads[1] ? state.room.ads[1].LinkUrl : '',
		}
	}
	
}

//2
const actions = {
//	异步
	initAds ({ commit }){
    	const api = new Api()
    	api.get('RoomRecommand/Room').then(data => {
     		commit(types.GET_ROOM_ADS, data)
    	})
	}
}

//3
const mutations = {
	[types.GET_ROOM_ADS] (state, data) {
    	state.room.ads = data
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
