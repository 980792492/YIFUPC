import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import user from './modules/user'
import room from './modules/room'
import view from './modules/view'
import question from './modules/question'
import vip from './modules/vip'
import history from './modules/history'


import ads from './modules/ads'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    user,
    room,
    ads,
    view,
    question,
    vip,
    history
  },
  strict: debug
})
