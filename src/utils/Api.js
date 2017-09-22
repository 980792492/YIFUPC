import axios from 'axios'
import jsonp from 'jsonp'
import Jwt from 'jwt-simple'
import Qs from 'qs'
import { Notification } from 'element-ui'
import Router from '@/router'
// import store from '@/store'
import Constant from './Constant'
import Auth from './Auth'


	//有效加载
const Payload = {
  iss: 'YFCJ',
  aud: 'http://wxapi.yifucj.com',
  nbf: 0,
  exp: 0
}

class Api {
	//	es6的class只有静态方法，没有静态属性  （static）

  config = {
    baseURL: Constant.API_URL,
    timeout: 50000,
  // responseType: 'json'
  }
	//	构造器方法
  constructor (type = 'default') {
    this.config.baseURL = type === 'stats' ? Constant.STATS_API_URL : Constant.API_URL
    this.link = axios.create(this.config)
  }


	//	获取授权
  static getAuthorization () {
    let t = parseInt(new Date().getTime() / 1000)
    Payload.nbf = t - 600
    Payload.exp = t + 600
    let authorization = Jwt.encode(Payload, Constant.JWT_SECRET)
    return authorization
  }


  static getUrl (url, type = 'default') {
    return (type === 'base' ? Constant.BASE_API_URL : Constant.API_URL) + url
  }
  

//	处理响应
  static handleResponse (resp) {
    if (resp.error > 0) {
      // 处理错误业务
      if (resp.error === 100) {
        // token无效或已过期，跳转到登陆页面
        // store.dispatch('setReturnPath', Router.currentRoute.fullPath)
        Auth.clearToken()
        Notification.error('操作失败，请重试')
        return Promise.reject('token失效')
      } else {
        // 其他错误处理
        Notification.error(resp.message)
        return Promise.reject(resp)
      }
    } else {
      return Promise.resolve(resp.data)
    }
  }

  get (url, data) {
    return this.link.get(url, {
      params: data,
      headers: { 'Authorization': Api.getAuthorization() }
    }).then(resp => {
      return Api.handleResponse(resp.data)
    })
  }

  post (url, data) {
    return this.link.post(url, Qs.stringify(data), {
      headers: { 'Authorization': Api.getAuthorization() }
    }).then(resp => {
      return Api.handleResponse(resp.data)
    })
  }

  postFile (url, data, file) {
    let formData = new FormData()
    formData.append('file', file)
    for (let i in data) {
      formData.append(i, data[i])
    }
    return this.link.post(url, formData, {
      headers: { 'Authorization': Api.getAuthorization() }
    }).then(resp => {
      return Api.handleResponse(resp.data)
    })
  }



  static getJsonp (url, data = null, cbstr = null) {
    return new Promise((resolve, reject) => {
      if (data) {
        url = url + '?' + Qs.stringify(data)
      }
      const param = cbstr ? { param : cbstr } : null
      jsonp(url, param, (err, data) => {
        if (err) {
          return reject(err.message)
        } else {
          return resolve(data)
        }
      })
    })
  }

}


export default Api
