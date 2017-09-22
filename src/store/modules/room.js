import * as types from '../types'
import Api from '@/utils/Api'

// init room data
const state = {
  // 直播室
  room: {
    id: null,
    isLoading: false,
    message: null,
    data: null,
    messageData: [],
    commentData: [],
    mIndex: 0,
    cIndex: 0,
    dIndex: 0,
    newMessageNum: 0,
    inviteTeacher:[],
//  禁言用户列表
		nospeechlist:[]
  },
  // 可售卖商品
  goods: {
    isLoading: false,
    message: null,
    data: null,
  },
  // 纸条
  papers: {
    isLoading: false,
    message: null,
    data: null,
  },
  // 付费观点
  encryptedViews: {
    isLoading: false,
    message: null,
    data: null,
    monthGolds: null,
  }
}

// getters
const getters = {
  // room
  messageData: state => state.room.messageData,
  commentData: state => state.room.commentData,
  newMessageNum: state => state.room.newMessageNum,
  roomData: state => {
    return {
      Describ: state.room.data ? state.room.data.Describ : '',
      HeadImg: state.room.data ? state.room.data.HeadImg : '',
      Joins: state.room.data ? state.room.data.Joins : 0,
      TeacherName: state.room.data ? state.room.data.TeacherName : '',
      TopicName: state.room.data ? state.room.data.TopicName : '',
      CreateDate: state.room.data ? state.room.data.CreateDate : '',
      Introduce: state.room.data ? state.room.data.Introduce : '',
      IsLike: state.room.data ? state.room.data.IsLike : 0,
      RecommendGoods: state.room.data ? state.room.data.RecommendGoods : 0,
    }
  },
  roomStatus: state => state.room.data ? state.room.data.Status : null,
  teacherId: state => state.room.data ? state.room.data.TeacherId : null,
  topicId: state => state.room.data ? state.room.data.TopicId : null,
  roomId: state => state.room.id,

//  获取嘉宾列表
  inviteTeacher: state => state.room.inviteTeacher,
//禁言人员列表
	nospeechlist: state => state.room.nospeechlist,

  // goods
  goodsData: state => state.goods.data ? state.goods.data.Goods : [],
  goodsCount: state => {
    return {
      CjgCount: state.goods.data ? state.goods.data.CjgCount : 0,
      VipCount: state.goods.data ? state.goods.data.VipCount : 0,
      ViewCount: state.goods.data ? state.goods.data.ViewCount : 0,
      PaperCount: state.goods.data ? state.goods.data.PaperCount : 0,
    }
  },

  // papers
  paperData: state => state.papers.data ? state.papers.data : [],

  // encryptedViews
  encryptedViewData: state => state.encryptedViews.data ? state.encryptedViews.data : [],
  encryptedViewMonthGolds: state => state.encryptedViews.monthGolds
}

// actions
const actions = {
  // 获取直播室基础数据
  initRoomData ({ commit }, { id, token }) {
    if (!id) {
      return Promise.reject('数据错误: initRoomData')
    }
    commit(types.INIT_ROOM_ID, id)
    commit(types.GET_ROOM_DATA_ING)
    const api = new Api()
    return api.get('Room/Topic', {
      id: id,
      token: token || undefined
    }).then(data => {
      commit(types.GET_ROOM_DATA_SUCCESS, data)
      return Promise.resolve(data)
    }).catch(error => {
      commit(types.GET_ROOM_DATA_FAIL, error)
      return Promise.reject(error)
    })
  },

  // 获取可购买商品数据
  initGoods ({ commit, state }) {
    if (!state.room.data) {
      return Promise.reject('数据错误: initGoods')
    }
    commit(types.GET_ROOM_GOODS_ING)
    const api = new Api()
    return api.get('Room/Goods', {
      teacher_id: state.room.data.TeacherId,
      topic_id: state.room.data.TopicId
    }).then(data => {
      commit(types.GET_ROOM_GOODS_SUCCESS, data)
      return Promise.resolve(data)
    }).catch(error => {
      commit(types.GET_ROOM_GOODS_FAIL, error)
      return Promise.reject(error)
    })
  },

  // 获取纸条
//getPapers ({ commit, state }, { topicId, token }) {
//  if (state.room.data === null) {
//    return false
//  }
//  commit(types.GET_ROOM_PAPERS_ING)
//  const api = new Api()
//  return api.get('Room/Papers', {
//    topic_id: topicId > 0 ? topicId : state.room.data.TopicId,
//    room_id: state.room.data.RoomId,
//    token: token || undefined
//  }).then(data => {
//    commit(types.GET_ROOM_PAPERS_SUCCESS, data)
//    return Promise.resolve(data)
//  }).catch(error => {
//    commit(types.GET_ROOM_PAPERS_FAIL, error)
//    return Promise.reject(error)
//  })
//},

//更新字条数目




  // 获取付费观点
  getEncryptedViews ({ commit, state }, { topicId }) {
    commit(types.GET_ENCRYTED_VIEW_ING)
    const api = new Api()
    return api.get('EncryptedView/EncryptedViews', {
      topic_id: topicId
    }).then(data => {
      commit(types.GET_ENCRYTED_VIEW_SUCCESS, data)
      return Promise.resolve(data)
    }).catch(error => {
      commit(types.GET_ENCRYTED_VIEW_FAIL, error)
      return Promise.reject(error)
    })
  },

  // 获取付费观点包月价格
  getEncryptedViewsMonthGolds ({ commit, state }, token) {
    const api = new Api()
    return api.get('EncryptedView/MonthGold', {
      token: token
    }).then(data => {
      let gold = data ? data.MonthGold : 0
      commit(types.UPDATE_ENCRYTED_VIEW_MONTH_GOLDS, gold)
      return Promise.resolve(data)
    })
  },

  // 加载更多之前的消息数据
  getMessageUp ({ commit, state }, n) {
    if (state.room.data === null) {
      return false
    }
    const api = new Api()
    return api.get('Room/UpMessage', {
      topic_id: state.room.data.TopicId,
      end: state.room.messageData[0].Index - 1,
      num: n
    }).then(data => {
      commit(types.UP_ROOM_MESSAGE, data)
      return Promise.resolve(data)
    }).catch(error => {
      return Promise.reject(error)
    })
  },


  //加载嘉宾列表
  getInviteTeacher({ commit, state }, { token }) {
		if(state.room.data === null){
			return false
		}
		const api = new Api()
		return api.get('/Teacher/Guests', {
			topic_id: state.room.data.TopicId,
			token: token || undefined
		}).then(data => {
			var dataarr = []
			data.forEach(function(v){
				var item = {}
				item.TeacherId = v.GuestId
				item.TeacherName = v.GuestName
				dataarr.push(item)
			})
			data = dataarr
			commit(types.GET_TEACHER_INVITE, data)
		})
	},

  //添加邀请嘉宾
  addInviteTeacher({ commit }, params) {
  	const api = new Api()
  	return api.post('/Teacher/AddGuest', params).then(data => {
  		commit(types.ADD_TEACHER_INVITE, data)
  		return Promise.resolve(data)
  	})
  },

  //	删除邀请嘉宾
  delInviteTeacher({ commit }, params ){
  	const api = new Api()
  	console.log(params)
  	return api.post('/Teacher/RemoveGuest', params).then(data => {
  		commit(types.REMOVE_TEACHER_INVITE, params)
      return Promise.resolve(data)
  	}).catch(error => {
        return Promise.reject(error)
      })
  },


//加载禁言用户列表(普通直播间)
	getnospeechlist({commit, state}, id ){
//		if(state.room.data === null){
//			return false
//		}
		const api = new Api()
		return api.get('/Teacher/ForbidUserList', {
			room_id: id
		}).then(resp => {
			commit(types.GET_NO_SPEECH_LIST, resp)
		})
	},
	
//添加禁言用户操作
	addnospeechlist({commit, state}, params){
		const api = new Api()
		return api.post('Teacher/ForbidUser', params).then(resp => {
				commit(types.ADD_NO_SPEECH_LIST,params)

      	return Promise.resolve(resp)
		})
	},


  //更改直播室今日主题
  changeRoomTopicname({ commit }, params) {
  	const api = new Api()
  	return api.post('Teacher/EditTopicName', params).then(data => {
  		commit(types.CHANGE_ROOM_TOPICNAME, params)
  		return Promise.resolve(data)
  	})
  },

  // 加载更多之前的互动数据
  getCommentUp ({ commit, state }, n) {
    if (state.room.data === null) {
      return false
    }
    const api = new Api()
    return api.get('Room/UpComment', {
      topic_id: state.room.data.TopicId,
      end: state.room.commentData[0].Index - 1,
      num: n
    }).then(data => {
      commit(types.UP_ROOM_COMMENT, data)
      return Promise.resolve(data)
    }).catch(error => {
      return Promise.reject(error)
    })
  },

  //加载嘉宾列表
  getInviteTeacher({ commit, state }, { token }) {
    if(state.room.data === null){
      return false
    }
    const api = new Api()
    return api.get('/Teacher/Guests', {
      topic_id: state.room.data.TopicId,
      token: token || undefined
    }).then(data => {
      var dataarr = []
      data.forEach(function(v){
        var item = {}
        item.TeacherId = v.GuestId
        item.TeacherName = v.GuestName
        dataarr.push(item)
      })
      data = dataarr
      commit(types.GET_TEACHER_INVITE, data)
    })
  },

  //  删除邀请嘉宾
  delInviteTeacher({ commit }, params ){
    const api = new Api()
    // console.log(params)
    return api.post('/Teacher/RemoveGuest', params).then(data => {
      commit(types.REMOVE_TEACHER_INVITE, params)
    })
  },



}

// mutations
const mutations = {
  // 初始化roomId
  [types.INIT_ROOM_ID] (state, id) {
    state.room.id = id
  },

  // 获取直播室基本数据
  [types.GET_ROOM_DATA_ING] (state) {
    state.room.isLoading = true
    state.room.message = null
  },

  [types.GET_ROOM_DATA_SUCCESS] (state, data) {
    state.room.isLoading = false
    state.room.data = data
    // 初始化消息数据
    if (data.Message !== undefined && data.Message.length > 0) {
      state.room.messageData = data.Message
      state.room.mIndex = parseInt(data.Message[data.Message.length - 1].Index) + 1
    }
    // 初始化评论数据
    if (data.Comment !== undefined && data.Comment.length > 0) {
      state.room.commentData = data.Comment
      state.room.cIndex = parseInt(data.Comment[data.Comment.length - 1].Index) + 1
    }
    // 初始化嘉宾
    if (data.InviteTeacher !== undefined && data.InviteTeacher.length > 0) {
      state.room.inviteTeacher = data.InviteTeacher
    }
  },

  [types.GET_ROOM_DATA_FAIL] (state, error) {
    state.room.isLoading = false
    state.room.message = error.message
  },

  // 增加单条message数据
  [types.ADD_ROOM_MESSAGE] (state, data) {
    let index = state.room.messageData.findIndex(item => {
      return item.Index == data.Index
    })
    if (index === -1) {
      state.room.messageData.push(data)
      state.room.mIndex = data.Index*1 + 1
      if ( data.Type != 4 && data.Type != 3 ) {
        state.room.newMessageNum++
      }
    }
  },

  // 更新单条message数据
  [types.UPDATE_ROOM_MESSAGE] (state, { i, data }) {
    let index = state.room.messageData.findIndex(item => {
      return item.Index == i
    })
    if (index !== -1) {
      let newData = state.room.messageData[index]
      newData.Body = data.Body
      state.room.messageData.splice(index, 1, newData)
    }
  },

  // 获取上一页message数据
  [types.UP_ROOM_MESSAGE] (state, data) {
    state.room.messageData = data.concat(state.room.messageData)
  },

  // 移除message
  [types.REMOVE_ROOM_MESSAGE] (state, i) {
    let index = state.room.messageData.findIndex(item => {
      return item.Index === i
    })
    index !== -1 && state.room.messageData.splice(index, 1)
  },

  // 增加单条comment数据
  [types.ADD_ROOM_COMMENT] (state, data) {
    let index = state.room.commentData.findIndex(item => {
      return item.Index === data.Index
    })
    if (index === -1) {
      state.room.commentData.push(data)
      state.room.cIndex = data.Index*1 + 1
    }
  },

  // 更新comment（单条）
  [types.UPDATE_ROOM_COMMENT] (state, { i, data }) {
    let index = state.room.commentData.findIndex(item => {
      return item.Index == i
    })
    if (index !== -1) {
      let newData = state.room.commentData[index]
      newData.Body = data.Body
      state.room.commentData.splice(index, 1, newData)
    }
  },

  // 获取上一页comment数据
  [types.UP_ROOM_COMMENT] (state, data) {
    state.room.commentData = data.concat(state.room.commentData)
  },

  // 移除comment
  [types.REMOVE_ROOM_COMMENT] (state, i) {
    let index = state.room.commentData.findIndex(item => {
      return item.Index === i
    })
    index !== -1 && state.room.commentData.splice(index, 1)
  },

  // 更新/删除(用于轮询)
  // 坑1: 不能直接删除，因为删除index为0的数据，无法识别是否已经到最顶部，所以只能修改为只有一个index元素的数据
  // 坑2: 必须判断undefined，因为有可能会有index为0的删除项
  // 坑3: 判断index不能用全等，必须使用==，以为有时候index可能为字符串（可以使用强制类型转换）
  [types.UPDATE_ROOM_DEL] (state, { data, topicId }) {
    for ( let v of data ) {
      // 识别主题id
      if (v.TId != topicId) continue

      if (v.Update) {
        // todo update
        console.log('todo update')
        console.log(v.Update)
      } else if (v.MIndex !== undefined && v.MIndex > -1) {
        // del message
        let index = state.room.messageData.findIndex(item => {
          return item.Index == v.MIndex
        })
        index !== -1 && state.room.messageData.splice(index, 1, { Index: v.MIndex })
      } else if (v.CIndex !== undefined && v.CIndex > -1) {
        let index = state.room.commentData.findIndex(item => {
          return item.Index == v.CIndex
        })
        index !== -1 && state.room.commentData.splice(index, 1, { Index: v.CIndex })
      }
    }
    state.room.dIndex = parseInt(data[data.length - 1].Index) + 1
  },

  // 获取直播室可销售数据
  [types.GET_ROOM_GOODS_ING] (state) {
    state.goods.isLoading = true
    state.goods.message = null
  },

  [types.GET_ROOM_GOODS_SUCCESS] (state, data) {
    state.goods.isLoading = false
    state.goods.data = data
  },

  [types.GET_ROOM_GOODS_FAIL] (state, error) {
    state.goods.isLoading = false
    state.goods.message = error.message
  },

  // 获取直播室纸条
  [types.GET_ROOM_PAPERS_ING] (state) {
    state.papers.isLoading = true
    state.papers.message = null
  },

  [types.GET_ROOM_PAPERS_SUCCESS] (state, data) {
    state.papers.isLoading = false
    state.papers.data = data
  },

  [types.GET_ROOM_PAPERS_FAIL] (state, error) {
    state.papers.isLoading = false
    state.papers.message = error.message
  },

//// 更新纸条
[types.UPDATE_ROOM_PAPER] (state, data) {
    const newPaper = {
      PaperIndex: data.Index,
      UserId: data.UserId,
      UserName: data.UserName,
      Gold: data.Gold,
      Body: data.Body || null,
      AnswerUserId: data.AnswerUserId || null,
      AnswerUserName: data.AnswerUserName || null,
      AnswerBody: data.Answer || null,
      CreateDate: data.CreateDate,
    }
    if (data.Status == 0) {
    	// 新纸条未读数量+1
      state.goods.data ? state.goods.data.PaperCount++ : state.goods.data.PaperCount = 1
    }

    if (data.Status == undefined) {
    	// 回答纸条数量 - 1
      state.goods.data ? state.goods.data.PaperCount-- : state.goods.data.PaperCount = 1
    }


    if (state.papers.data === null) {
      state.papers.data = [newPaper]
    } else {
      state.papers.data.unshift(newPaper)
    }
},

//更改今日直播 主题
	[types.CHANGE_ROOM_TOPICNAME] (state, data) {
		state.room.data.TopicName = data.topic_name
	},

  //获取初始化的直播室嘉宾列表
	[types.GET_TEACHER_INVITE] (state, data) {
		state.room.inviteTeacher = data
	},

//添加邀请嘉宾
	[types.ADD_TEACHER_INVITE] (state, data){
		var mydata = {}
		mydata.TeacherName = data.GuestName
		mydata.TeacherId = data.GuestId
		if( state.room.inviteTeacher.indexOf(mydata) == -1) {
			state.room.inviteTeacher.push(mydata)
		}
	},
//	删除邀请嘉宾列表
	[types.REMOVE_TEACHER_INVITE] (state, data) {
		for(var i=0; i< state.room.inviteTeacher.length; i++) {
			if(state.room.inviteTeacher[i].TeacherName == data.guest_name ){
				state.room.inviteTeacher.splice(i,1)
			}
		}
	},
//	获取嘉宾列表
	[types.GET_NO_SPEECH_LIST](state, data) {
		state.room.nospeechlist = data
	},
	[types.ADD_NO_SPEECH_LIST](state,data){
		let item = {}
		item.Id = data.user_id
		item.UserName = data.user_name
		state.room.nospeechlist.push(item)
	},




  // 获取直播室付费观点
  [types.GET_ENCRYTED_VIEW_ING] (state) {
    state.encryptedViews.isLoading = true
    state.encryptedViews.message = null
  },

  [types.GET_ENCRYTED_VIEW_SUCCESS] (state, data) {
    state.encryptedViews.isLoading = false
    state.encryptedViews.data = data
  },

  [types.GET_ENCRYTED_VIEW_FAIL] (state, error) {
    state.encryptedViews.isLoading = false
    state.encryptedViews.message = error.message
  },

  // 更新单条付费观点数据
  [types.UPDATE_ENCRYTED_VIEW] (state, data) {
    if (state.encryptedViews.data === null) {
      state.encryptedViews.data = [data]
      // 增加数量统计
      state.goods.data ? state.goods.data.ViewCount++ : state.goods.data.ViewCount = 1
    } else {
      let index = state.encryptedViews.data.findIndex(item => {
        return item.ViewId === data.ViewId
      })
      if (index !== -1) {
        // 付费观点已存在，更新
        state.encryptedViews.data.splice(index, 1, data)
      } else {
        // 付费观点不存在
        state.encryptedViews.data.push(data)
        // 增加数量统计
        state.goods.data ? state.goods.data.ViewCount++ : state.goods.data.ViewCount = 1
      }
    }
  },

  // 设置包月价格
  [types.UPDATE_ENCRYTED_VIEW_MONTH_GOLDS] (state, golds) {
    state.encryptedViews.monthGolds = golds
  },

  // 清除newMessageNum
  [types.CLEAR_NEW_MESSAGE_NUM] (state) {
    state.room.newMessageNum = 0
  },

  // 更新joins数据
  [types.UPDATE_ROOM_JOINS] (state, num) {
    state.room.data.Joins = num
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
