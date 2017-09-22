<template>
<div>
  <div class="main">
    <!-- 右侧 -->
    <div class="main_right right">
      <h3>同学互动</h3>
      <!--同学互动区-->
      <div ref="chat" class="content content-right" :style="{ height: ((isManger || !(isTeacher && isInviteTeacher)) ? 726 : 791) + 'px' }">
        <div class="upButton" v-show="commentData.length > 0 && commentData[0].Index != 0"><a @click="up">向上50条</a></div>
        <!-- components chat -->
        <y-chat v-if="item.Type > 0" :data="item" :key="item.Index" v-for="(item, index) in commentData" v-on:imgLoad="toBottom"></y-chat>
      </div>
      <!--同学互动区 over-->

      <!-- 送礼 -->
      <y-gift v-if="isManger || !(isTeacher && isInviteTeacher)"></y-gift>
      <!-- 送礼 over -->

      <!-- 普通用户区域 -->
      <y-user-area></y-user-area>
      <!-- 普通用户区域 over -->
    </div>
    <!-- 右侧over -->

    <!-- 左侧 -->
    <div class="main_left left">
      <h1 class="title yf-text_16">
        {{ roomData.CreateDate }} 今日主题：{{ roomData.TopicName }}
        <span class="yf-right yf-text_12">参与股友<i class="yf-text_red">{{ roomData.Joins }}</i>人</span>
      </h1>
      <div class="live">
        <router-view></router-view>
      </div>
      <!-- 底部导航 -->
      <y-room-bottom-nav></y-room-bottom-nav>
      <!-- 底部导航 over -->

      <!-- 投票 & 推荐 -->
      <y-vote v-if="isManger || (!isTeacher && !isInviteTeacher)"></y-vote>
      <!-- 投票 & 推荐 over-->

      <!-- 老师区 -->
      <y-editor-wrap v-if="isTeacher || isInviteTeacher"></y-editor-wrap>
      <!-- 老师区 over -->
    </div>
    <!-- 左侧over -->

    <!-- 底部推荐 -->
    <y-elite-introduce v-if="!isTeacher && !isInviteTeacher"></y-elite-introduce>
    <!-- 底部推荐 over -->

    <!--老师直播室下方友情=提示-->
    <div v-if="isTeacher || isInviteTeacher" class="reminder_box clearn">
      <div class="reminder">
        <span>特别提示：</span>严禁播主在网站任何地方有任何明示、暗示的联系方式，如手机号、Q号（昵称）、群号、微信号、QQ截图（抹去QQ号和昵称的除外）、外网的博客、外站网址、微博等。严禁煽动用户诋毁网站决议，损
        害网站在用户心目中的形象。一富财经工作团队奉行积极沟通、全面尊重主播意愿的原则，播主可以采用与网站工作人员私下沟通的方式提出自己的合理建议。禁止采用讽刺、诋毁、谩骂等不文明行为进行恶性竞争。如贬损其他播主、鼓励
        学生到别的直播室捣乱等。
      </div>
    </div>
  </div>

  <!--全局间隔时间未登录的弹出-->
  <el-dialog class="open_popup"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <a target="_blank" href="http://www.yifucj.com/user/UserRegMobile">
    <span class="close_span" @click.stop.prevent="dialogVisible = !dialogVisible"></span>
    <img src="http://room.yifucj.com/images/tanchuang.png"/>
    </a>
  </el-dialog>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Fingerprint2 from 'fingerprintjs2';
import { MessageBox } from 'element-ui';

import YRoomBottomNav from '@/components/room/RoomBottomNav'
import YUserArea from '@/components/room/UserArea'
import YChat from '@/components/room/Chat'
import YGift from '@/components/room/Gift'
import YVote from '@/components/room/Vote'
import YEditorWrap from '@/components/room/EditorWrap'
import YEliteIntroduce from '@/components/room/EliteIntroduce'

import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import Web from '@/utils/Web'
import WebSocketClient from '@/utils/WebSocketClient'
import store from '@/store'
import * as types from '@/store/types'

export default {
  data() {
    return {
      dialogVisible: false,
      top: false,
      bottom: true,

      // 直播室初始化弹窗的时间s
      popT: 300,
      // 人气统计s
      popularityT: 300,
    }
  },
  beforeRouteEnter (to, from, next) {
    if (store.getters.topicId === undefined) {
      MessageBox.alert("老师暂未开通直播").then(_ => next(from))
      return
    }
    if (store.getters.roomStatus == 21) {
      // 今日未开播，进入历史直播
      MessageBox.alert("老师今日未开播，点击进入历史直播").then(_ => next({name: 'history', params: { id: store.getters.roomId + '_' + store.getters.topicId}}))
    } else {
      new Fingerprint2().get((result, components) => {
        window.GUID = result
        next()
      })
    }
  },
  created () {
    this.loadData()
    this.initPopup()
  },
  mounted () {
    this.toBottom()
    // this.loadData(this.topicId)
  },
  destroyed () {
    this.popularityTimer && clearInterval(this.popularityTimer)
    this.ws && this.ws.close()
    this.pollingTimer && clearInterval(this.pollingTimer)
    this.reloadWsTimer && clearTimeout(this.reloadWsTimer)
    this.popTimer && clearInterval(this.popTimer)
  },
  methods: {
    //	直播室初始化登录弹窗
  	initPopup(){
  	  this.popTimer = setInterval(() => {
  			if(!this.authToken) {
					this.dialogVisible = true
					return false
				}
  		}, this.popT * 1000)
  	},

    loadData () {
      this.api = new Api()
      // 人气统计定时器
      this.popularityTimer = setInterval(() => {
        this.popularity()
      }, 1000 * this.popularityT)
      // 马上执行一次
      this.popularity()

      // 3秒轮询
      this.polling()

      // 获取付费观点权限
      if (this.authToken) {
        this.getUserEncryptedView()
      }

      // if ( !window.WebSocket || !user ) {
      //   // 关闭websocket
      //   this.ws && this.ws.close()
      //   // 启用轮询
      //   !this.pollingTimer && this.polling(this.topicId)
      // } else {
      //   // 关闭轮询
      //   if (this.pollingTimer) {
      //     clearInterval(this.pollingTimer)
      //     this.pollingTimer = null
      //   }
      //   // 启用websocket
      //   this.startWebSocket(topicId, user.Id)
      // }
    },
    // 人气统计
    popularity () {
      const api = new Api('stats');
      api.post('Popularity/OnLineStatistics', {
        guid: window.GUID,
        token: this.authToken || undefined,
        topic_id: this.topicId,
        source: 0,
      }).then(resp => {
        resp && resp.AllCount >= 0 && this.$store.commit(types.UPDATE_ROOM_JOINS, resp.AllCount)
      });
    },
    // 轮询
    polling (time = 3000) {
      this.pollingTimer = setInterval(_ => this.updateRoomData(), time)
    },
    // websocket
    // startWebSocket (topicId, userId) {
    //   const _this = this
    //   this.ws = new WebSocketClient({
    //     // 链接成功后登陆ws
    //     onOpen () {
    //       this.login(topicId, userId)
    //     },
    //
    //     // ws 获取到推送数据
    //     getData (data) {
    //       _this.handleWsRoomData(data)
    //     },
    //
    //     onClose () {
    //       // 1分钟后重试
    //       _this.reloadWs(60000)
    //     },
    //
    //     onError () {
    //       // 5分钟后重试
    //       _this.reloadWs(300000)
    //     },
    //   })
    // },
    up () {
      this.top = true
      this.getCommentUp(50)
    },
    toTop () {
      this.$nextTick(() => {
        this.top = false
        setTimeout(() => {
          this.$refs.chat.scrollTop = 0
        }, 200)
      })
    },
    // 滚动到底部
    toBottom () {
      if (!this.bottom) {
        let offset = this.$refs.chat.scrollHeight - this.$refs.chat.scrollTop - this.$refs.chat.offsetHeight
        // 获取最后一个dom的高度
        let list = this.$refs.chat.querySelectorAll('.right-item')
        let lastDomHeight = list.length > 0 ? list[list.length - 1].offsetHeight : 0
        if (offset > lastDomHeight)
          return
      }

      this.$nextTick(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
      })
    },
    // ws 断开链接，开启轮询，并在1分钟之后，重新尝试连接ws
    // reloadWs (timer = 60000) {
    //   !this.pollingTimer && this.polling(this.topicId)
    //   this.reloadWsTimer = setTimeout(() => {
    //     console.log('重新尝试连接')
    //     this.loadData(this.topicId, this.authUser)
    //   }, timer)
    // },
    ...mapActions(['updateRoomData', 'handleWsRoomData', 'getCommentUp', 'getUserEncryptedView'])
  },
  watch: {
    commentData (data, oldData) {
      this.bottom = oldData.length === 0
      if (this.top === true) {
        // 到顶部
        this.toTop()
      } else {
        // 滚动到底部
        this.toBottom()
      }
    },
    newMessageNum (n) {
      if (n > 0) {
        Web.setTitle('【新消息' + n + '条】' + Web.getTitle())
        // 播放声音
        Web.play(this.roomId)
      } else {
        // 清0后返回原来的title
        Web.setTitle(Web.getTitle())
      }
    }
  },
  computed: {
    ...mapGetters(['commentData', 'roomData', 'roomId', 'topicId', 'authToken', 'isTeacher', 'isInviteTeacher', 'isManger', 'roomStatus', 'newMessageNum'])
  },
  components: {
    YChat,
    YRoomBottomNav,
    YUserArea,
    YGift,
    YVote,
    YEliteIntroduce,
    YEditorWrap
  }
}
</script>

<style lang="less" scoped>
.main { width: 1175px; margin: 0 auto;
  .main_right { width: 415px; border-left: 1px solid #e3e3e3;
    h3 { height: 40px; line-height: 40px; padding-left: 21px; background-color: #fff; }
  }
  .main_left { width: 760px;
    h1.title { height: 40px; line-height: 40px; background-color: #f0efed; padding-left: 16px; padding-right: 35px; color: #333; overflow: hidden;
      span { font-weight: normal; }
    }
    .live { height: 726px; }
  }
}

.reminder_box { padding: 10px 0;
  .reminder { width: 1175px; background: #f8f8f8; height: 112px; padding: 28px 22px; line-height: 20px; color: #9f9f9f;
    > span { font-weight: 700; color: #8e8e8e;}
  }
}

//      同学互动区样式
.content-right { background: #ffffff; overflow: auto; padding-left: 26px ; padding-bottom: 20px;
}

/*//元素下边框为红色*/
.router-link-active { border-color:#e03a3c!important;}
</style>
