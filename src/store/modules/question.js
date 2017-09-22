import * as types from '../types'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'


const state = {
	question: {
		myNum: 0,
		Freenum: 0,
		viewNum: 1,
		viewControl: 'QuestionAll'
	}

}

const getters = {
	myquestionNum: state => state.question.myNum,
	myquestionFreenum: state => state.question.Freenum,
	viewnum: state => state.question.viewNum,
	viewcontrol: state => state.question.viewControl
}

const actions = {
//	获取我的问答的显示数目
	InitQuestionNum({commit}, token){
		const api = new Api()
		let params = {}
		params.token = token
		params.type = -1
		api.get('/Ask/List', params).then(resp => {
			commit(types.GET_QUESTION_MYNUM, resp)
		})
	},


//	获取我剩余的免费次数
	initMyfreeNum({commit}){
		const api = new Api()
		let params = {}
		params.token = Auth.getToken()
		params.type = 0
		api.get('/Ask/Teachers', params).then(resp => {
			commit(types.GET_QUESTION_FREENUM, resp)
		})
	},


//	切换问答页面的左侧的选项卡
	TabviewCotrol({commit}, data){
		commit(types.TAB_CONTROL_VIEW, data)
	}
}


const mutations = {
	[types.GET_QUESTION_MYNUM] (state, data) {
		state.question.myNum = data.AskCount
	},

	[types.GET_QUESTION_FREENUM] (state, data) {
		state.question.Freenum = data.FreeCount
	},

	[types.TAB_CONTROL_VIEW] (state, data) {
		state.question.viewNum = data.flag
		state.question.viewControl = data.viewTab
	}

}


export default {
  state,
  getters,
  actions,
  mutations
}
