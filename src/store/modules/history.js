/** 历史直播状态管理器
 *
 */

import * as types from '../types'
import Api from '@/utils/Api'

// init room data
const state = {
  messageData: [],
  teacher: null,
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  // set历史直播室基本数据
  [types.SET_HISTORY_ROOM_DATA] (state, data) {
    state.messageData = data.Message
    state.teacher = data.TeacherId
  },

  // 获取上一页message数据
  [types.UP_HISTORY_ROOM_MESSAGE] (state, data) {
    state.room.messageData = data.concat(state.room.messageData)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
