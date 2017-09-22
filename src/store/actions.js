import Api from '@/utils/Api'
import * as types from './types'

// 调用轮询接口更新直播室消息数据
export const updateRoomData = ({ commit, state, getters }) => {
  if (!getters.topicId) return false

  const param = {
    topicId: getters.topicId,
    mIndex: state.room.room.mIndex,
    cIndex: state.room.room.cIndex,
    dIndex: state.room.room.dIndex
  }
  return Api.getJsonp('http://roomapi.yifucj.com/chat', param, 'jsoncallback').then(resp => {
    if (!resp) {
      return false
    }

    // 获取到message消息
    if (resp.message.length > 0) {
      for (let item of resp.message) {
        if (item.Index === undefined) continue
        // 更新单条消息
        commit(types.ADD_ROOM_MESSAGE, item)
        // 如果有纸条数据，推送到纸条列表
        if (item.Type*1 === 2) {
          // 更新纸条
          commit(types.UPDATE_ROOM_PAPER, item)
        }
        // 如果有付费观点数据，推送到付费观点列表
        if (item.Type*1 === 10 && item.Body) {
          commit(types.UPDATE_ENCRYTED_VIEW, JSON.parse(item.Body))
        }
      }
    }

    // 获取到comment消息
    if (resp.comment.length > 0) {
      for (let item of resp.comment) {
        if (item.Index === undefined) continue
        commit(types.ADD_ROOM_COMMENT, item)
      }
    }

    // 获取del消息 批量处理
    if (resp.delchat.length > 0) {
      commit(types.UPDATE_ROOM_DEL, { data: resp.delchat, topicId: getters.topicId })
    }
  }).catch(err => {
  })
}

// 处理直播室轮询数据
export const handleWsRoomData = ({ commit }, data) => {
  // console.log(data)
  // 1(老师发言), 2(纸条), 5(系统推送),7(藏金阁),9(博文),10(付费观点)
  switch(data.Type*1) {
    // 删除message
    case 998:
      commit(types.REMOVE_ROOM_MESSAGE, data.DelIndex)
      break
    // 删除comment
    case 999:
      commit(types.REMOVE_ROOM_COMMENT, data.DelIndex)
      break
    // 添加／更新comment区 103(投票)104(送礼) 6(评论)
    case 103:
    case 104:
    case 6:
      if (data.Update && data.Update == 1) {
        data.CIndex != -1 && commit(types.UPDATE_ROOM_COMMENT, { i: data.CIndex, data: data })
      } else {
        // console.log(data)
        commit(types.ADD_ROOM_COMMENT, data)
      }
      break
    // 添加／更新message区 1(老师发言), 2(纸条), 5(系统推送),7(藏金阁),9(博文),10(付费观点)
    case 1:
    case 2:
    case 5:
    case 7:
    case 9:
    case 10:
      if (data.Update && data.Update == 1) {
        data.MIndex != -1 && commit(types.UPDATE_ROOM_MESSAGE, { i: data.MIndex, data: data })
      } else {
        commit(types.ADD_ROOM_MESSAGE, data)
      }

      // 纸条和付费观点特殊处理
      if (data.Type*1 === 2) {
        commit(types.UPDATE_ROOM_PAPER, data)
      } else if (data.Type*1 === 10) {
        // console.log(data)
        data.Body && commit(types.UPDATE_ENCRYTED_VIEW, JSON.parse(data.Body))
      }
      break
    default:
      console.log('unknow type')
  }
}
