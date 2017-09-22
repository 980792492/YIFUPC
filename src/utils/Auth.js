import Vue from 'vue'
import { cookie } from 'cookie_js/cookie'
import store from '@/store'
import * as types from '@/store/types'
import Constant from './Constant'

// 权限验证相关
const Auth = {
  // 弹出登陆框
  openLoginDialog () {
    store.commit(types.OPEN_LOGIN_DIALOG)
  },

  // 关闭登陆框
  closeLoginDialog () {
    store.commit(types.CLOSE_LOGIN_DIALOG)
  },

  // 用户路由层拦截器
  checkUser () {
    return this.isLogin().then(() => {
      if (store.getters.authUser) {
        // 已登录，并初始化过的直接通过
        return Promise.resolve()
      }
      // 已登陆，没有初始化过用户数据，则立即初始化用户数
      return store.dispatch('initUserData', this.getToken())
        .then(_ => Promise.resolve())  // 用户数据加载成功
        .catch(error => Promise.reject('用户数据加载失败！！[initUserData] ' + error))
    }).catch(error => {
      // todo 这里有2种情况 看下是否需要分开处理
      // 1. 未登录
      // 2. 已登录，但是token refresh失败，如接口错误等
      return Promise.resolve()
    })
  },

  /* 处理用户是否登陆，三种情况
   * 1. cookie中有token（直接登陆）
   * 2. cookie中没有token, 但是有yf_user_Info && yf_user（使用user_Info重新交换token）
   * 3. 没有yf_user_Info || yf_user（没有登陆）
   */
  isLogin () {
    // yf_user_Info || yf_user 不存在表示未登陆，不考虑token
    if (!cookie.get('yf_user_Info', null) || !cookie.get('yf_user', null)) {
      return Promise.reject('没有登陆')
    }
    if (!cookie.get('yf_token', null)) {
      return store.dispatch('refreshToken', { cookie: cookie.get('yf_user_Info') })
    }

    // 已登陆
    return Promise.resolve()
  },

  login (data, isRemember = false) {
    cookie.set('yf_user', data.userCookie, {
      expires: isRemember ? 2000 : undefined,
      domain: Constant.COOKIE_DOMAIN,
      path: Constant.COOKIE_PATH
    })
    cookie.set('yf_user_Info', data.userInfoCookie, {
      expires: 2000,
      domain: Constant.COOKIE_DOMAIN,
      path: Constant.COOKIE_PATH
    })
    this.setToken(data.token)

    // 登录成功需要刷新页面
    window.location.reload()
  },

  logout () {
    cookie.removeSpecific(
      ['yf_user', 'yf_user_Info', 'yf_token'],
      { path: Constant.COOKIE_PATH, domain: Constant.COOKIE_DOMAIN }
    )
    //  退出刷新页面
   	window.location.reload()
  },

  getToken () {
    return cookie.get('yf_token', null)
  },

  setToken (token) {
    cookie.set('yf_token', token, {
      expires: 1,
      domain: Constant.COOKIE_DOMAIN,
      path: Constant.COOKIE_PATH
    })
  },

  clearToken () {
    cookie.removeSpecific(
      'yf_token',
      { path: Constant.COOKIE_PATH, domain: Constant.COOKIE_DOMAIN }
    )
  }

}

export default Auth
