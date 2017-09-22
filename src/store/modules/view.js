/**
 * 观点相关状态管理器
 * 包括常用观点、普通观点、评论观点等
 */

import * as types from '../types'
import Api from '@/utils/Api'

const state = {
  // 直播观点
  live: {
    status: false,
    quoteId: -1,
    quoteUserName: null,
  },
  // 评论观点
  chat: {
    status: false,
    replyId: -1,
    replyUserName: null,
  },
  // 常用观点
  normal: {
    isLoading: false,
    message: null,
    list: [],
  },
}

const getters = {
		normalViewList: state => state.normal.list ? state.normal.list : []
}

const actions = {
  // 获取常用观点列表
  getNormalViewList ({ commit, rootState }) {
    if (!rootState.user.token) {
      return Promise.reject('未登陆')
    }
    commit(types.GET_NORMAL_VIEW_ING)
    const api = new Api()
    api.get('/Teacher/AnaList', {token: rootState.user.token}).then(resp => {
      commit(types.GET_NORMAL_VIEW_SUCCESS, resp)
    }).catch(error => {
      commit(types.GET_ENCRYTED_VIEW_FAIL, error)
    })
  },

  // 增加常用观点
  addNormalView ({ commit, rootState }, { content }) {
    if (!rootState.user.token) {
      return Promise.reject('未登陆')
    }
    const api = new Api()
    const params = {
      token: rootState.user.token,
      content: encodeURIComponent(content)
    }
    return api.post('Teacher/AddAna', params).then(resp => {
      commit(types.UPDATE_NORMAL_VIEW, {
        id: resp.Id,
        content: resp.Content
      })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },

  // 更新单个常用观点
  updateNormalView ({ commit, rootState }, { id, content }) {
    if (!rootState.user.token) {
      return Promise.reject('未登陆')
    }
    const api = new Api()
    const params = {
      token: rootState.user.token,
      id: id,
      content: encodeURIComponent(content)
    }
    return api.post('Teacher/UpdateAna', params).then(resp => {
      commit(types.UPDATE_NORMAL_VIEW, {
        id: id,
        content: resp.Content
      })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },

  // 删除单个常用观点
  removeNormalView ({ commit, rootState }, { id }) {
    if (!rootState.user.token) {
      return Promise.reject('未登陆')
    }
    const api = new Api()
    const params = {
      token: rootState.user.token,
      id: id,
    }
    return api.post('Teacher/RemoveAna', params).then(resp => {
      commit(types.REMOVE_NORMAL_VIEW, { id: id })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  }
}

const mutations = {
  // 设置引用
  [types.SET_LIVE_QUOTE] (state, { id, username }) {
    state.live.status = !state.live.status
    state.live.quoteId = id
    state.live.quoteUserName = username
  },

  // 取消引用
  [types.CANCEL_LIVE_QUOTE] (state) {
    state.live.quoteId = -1
    state.live.quoteUserName = null
  },

  // 设置回复
  [types.SET_CHAT_REPLY] (state, { id, username }) {
    state.chat.status = !state.chat.status
    state.chat.replyId = id
    state.chat.replyUserName = username
  },

  // 取消回复
  [types.CANCEL_CHAT_REPLY] (state) {
    state.chat.replyId = -1
    state.chat.replyUserName = null
  },

  // 获取常用观点列表
  [types.GET_NORMAL_VIEW_ING] (state) {
    state.normal.isLoading = true
    state.normal.message = null
  },

  [types.GET_NORMAL_VIEW_SUCCESS] (state, data) {
    state.normal.isLoading = false
    state.normal.list = data
  },

  [types.GET_NORMAL_VIEW_FAIL] (state, error) {
    state.normal.isLoading = false
    state.normal.message = error
  },

  // 修改常用观点
  [types.UPDATE_NORMAL_VIEW] (state, { id, content }) {
    let index = state.normal.list.findIndex(item => {
      return item.Id == id
    })
    if (index !== -1) {
      let newData = state.normal.list[index]
      newData.Content = content
      state.normal.list.splice(index, 1, newData)
    } else {
      state.normal.list.unshift({Id: id, Content: content})
    }
  },

  // 删除常用观点
  [types.REMOVE_NORMAL_VIEW] (state, { id }) {
    let index = state.normal.list.findIndex(item => {
      return item.Id == id
    })
    index !== -1 && state.normal.list.splice(index, 1)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}