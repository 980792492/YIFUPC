import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import * as types from '../types'

// init user data
const state = {
  showDialog: false,
  isLoading: false,
  message: null,
  data: null,
  token: null,
  returnPath: null,
  userchangedata:null,
  encryptedView: null,
}

// getters
const getters = {
  showLoginDialog: state => state.showDialog,
  authToken: state => state.token,
  authUser: state => state.data,
  authUserchagedata: state => state.userchangedata,
  authUserEncryptedView: state => state.encryptedView
}

// actions
const actions = {
  login ({ commit }, { username, password, type = 0, remember = false }) {
    commit(types.LOGIN_ING)
    const api = new Api()
    return api.post('User/Login', {username: username, password: password, type: type})
      .then(data => {
        commit(types.LOGIN_SUCCESS, data.token)
        // 缓存cookie
        Auth.login(data, remember)
        return Promise.resolve(data.token)
      }).catch(error => {
        commit(types.LOGIN_FAIL, error)
        return Promise.reject(error)
      })
  },

  refreshToken ({ commit }, { cookie }) {
    commit(types.REFRESH_TOKEN_ING)
    const api = new Api()
    return api.post('User/GetToken', {yf_user_Info: cookie})
      .then(data => {
        commit(types.REFRESH_TOKEN_SUCCESS, data.token)
        Auth.setToken(data.token)
        return Promise.resolve(data.token)
      }).catch(error => {
        commit(types.REFRESH_TOKEN_FAIL, error)
        return Promise.reject(error)
      })
  },

  initUserData ({ commit, state }, token) {
    if (!token) {
      return false
    }
    commit(types.GET_USER_DATA_ING)
    // 如果token没有，则初始化token
    state.token || commit(types.LOGIN_SUCCESS, token)
    // 远程调用获取用户数据
    const api = new Api()
    return api.get('User/Info', { token: token })
      .then(data => {
        commit(types.GET_USER_DATA_SUCCESS, data)
        return Promise.resolve(data)
      })
      .catch(error => {
        // console.log(error)
        commit(types.GET_USER_DATA_FAIL, error)
        return Promise.reject(error)
      })
  },

  //获取用户变动数据
	getUserChangeData({ commit }, params) {
		const api = new Api()
		return api.get('/User/Data', params).then( data => {
			// console.log(data)
			commit(types.GET_USER_CHANGE_DATA, data)
		})
	},

  // 获取用户已购买的付费观点
  getUserEncryptedView ({ commit, state, rootState }) {
    if (!rootState.room.room.data || !state.token) {
      return false
    }
    const api = new Api()
    return api.get('EncryptedView/Topic', {
      topicId: rootState.room.room.data.TopicId,
      token: state.token
    }).then(resp => {
      commit(types.UPDATE_USER_ENCRYPTED_VIEW, resp)
      return Promise.resolve(resp)
    }).catch(error => {
      return Promise.reject(error)
    })
  }
}

// mutations
const mutations = {
  // 登陆弹窗
  [types.OPEN_LOGIN_DIALOG] (state) {
    state.showDialog = true
  },

  [types.CLOSE_LOGIN_DIALOG] (state) {
    state.showDialog = false
  },

  // 登陆
  [types.LOGIN_ING] (state) {
    state.isLoading = true
    state.token = null
    state.message = null
  },

  [types.LOGIN_SUCCESS] (state, token) {
    state.isLoading = false
    state.token = token
  },

  [types.LOGIN_FAIL] (state, error) {
    state.isLoading = false
    state.message = error.message
  },

  // 刷新token
  [types.REFRESH_TOKEN_ING] (state) {
    state.isLoading = true
    state.message = null
  },

  [types.REFRESH_TOKEN_SUCCESS] (state, token) {
    state.isLoading = false
    state.token = token
  },

  [types.REFRESH_TOKEN_FAIL] (state, error) {
    state.isLoading = false
    state.message = error.message
  },

  // 获取用户数据
  [types.GET_USER_DATA_ING] (state) {
    state.isLoading = true
    state.data = null
    state.message = null
  },

  [types.GET_USER_DATA_SUCCESS] (state, data) {
    state.isLoading = false
    state.data = data
  },

  [types.GET_USER_DATA_FAIL] (state, error) {
    state.isLoading = false
    state.message = error.message
  },

  [types.GET_USER_CHANGE_DATA] (state, data) {
  	state.userchangedata = data
  },

  [types.UPDATE_USER_ENCRYPTED_VIEW] (state, data) {
    state.encryptedView = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
