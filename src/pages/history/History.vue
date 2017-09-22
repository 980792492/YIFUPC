<template>
  <div class="history_wrap">

    <div class="history_title">
      <div class="left title_left">
        <p class="left text">当前页面为<span>{{ createDate }}</span>历史直播</p>
        <p class="right order"><router-link :to="{name: 'history-list', params: { id: roomId }}">历史直播列表 >></router-link></p>
      </div>
      <div class="right title_right">
        <router-link v-if="isLive" :to="{name: 'live-main', params: { id: roomId }}">今日直播进行中 >></router-link>
        <div v-else class="">今日未开播</div>
      </div>
    </div>
    <div class="content_wrap contain">
      <div class="content-left left">
        <div class="content_top">
          <div class="title left">{{ createDate }}直播主题：{{ topicName }}</div>
          <p class="number right">参与股友<span>{{ joins }}</span>人</p>
        </div>
        <router-view></router-view>

        <y-history-nav></y-history-nav>
      </div>
      <div class="content-right right">
        <div class="content_top">同学互动</div>
        <div ref="chat" class="content content_datail">
          <!-- 评论组件 -->
          <y-chat :data="item" :key="index" v-for="(item, index) in comment" v-on:imgLoad="toBottom"></y-chat>
        </div>
      </div>
    </div>
    <y-elite-introduce></y-elite-introduce>
  </div>
</template>

<script>
import YChat from '@/components/room/Chat'
import YHistoryNav from '@/components/history/HistoryNav'
import YEliteIntroduce from '@/components/room/EliteIntroduce'
import Api from '@/utils/Api'
import store from '@/store'
import * as types from '@/store/types'

export default {
  name: "history",
  beforeRouteEnter (to, from, next) {
    const [roomId, topicId] = to.params.id.split('_')
    if (roomId > 0 && topicId > 0) {
      const api = new Api()
      api.get('Room/HistoryTopic', { topic_id: topicId }).then(resp => {
        store.commit(types.SET_HISTORY_ROOM_DATA, resp)
        next(vm => {
          vm.createDate = resp.CreateDate
          vm.topicName = resp.TopicName
          vm.topicId = topicId
          vm.roomId = roomId
          vm.isLive = resp.Live == 1
          vm.comment = resp.Comment
          vm.joins = parseInt(resp.Joins)
        })
      })
    } else {
      console.log('错误的历史直播页')
      next(false)
    }
  },
  data () {
    return {
      roomId: 0,
      topicId: 0,
      comment: [],
      createDate: null,
      topicName: null,
      isLive: 0,
      joins: 0,
    }
  },
  created () {
  },
  mounted () {
    this.toBottom()
  },
  methods:{
    loadData () {
      this.api.get('Room/HistoryTopic', { topic_id: this.topicId }).then(resp => {
        this.createDate = resp.CreateDate
        this.topicName = resp.TopicName
        this.isLive = resp.Live == 1
        this.comment = resp.Comment
        this.joins = parseInt(resp.Joins)
        this.$store.commit(types.SET_HISTORY_ROOM_DATA, resp)
      })
    },
    toBottom () {
      this.$nextTick(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
      })
    },
  },
  components:{
    YChat,
    YHistoryNav,
    YEliteIntroduce
  }
}
</script>

<style lang="less" src="../../styles/room.less"></style>
<style lang="less" scoped>
  .history_wrap { background: #E3E3E3;}

  .history_title { width: 1175px; margin: 0 auto; height: 90px; padding: 15px 0; line-height: 60px;
    .title_left { width: 760px; height: 60px; background: #cccccc; padding-left: 15px; padding-right: 31px;
      > .text { font-size: 15px;}
      > .order {font-size: 12px;
        > a {  color: #050505;}
       }
    }
    .title_right { width: 414px;  text-align: center;
      > a {font-size: 15px; color: #f7fff8; display: block; width: 100%; height: 100%; background: #e43a3d;}
      > div {font-size: 15px; color: #656565; background: #CCCCCC;}
    }
  }
  .content_wrap {  width: 1175px; margin: 0 auto; overflow: hidden;
    .content-left { width: 760px;
      .content_top { height: 40px; line-height: 40px; background: #f0efed; padding-left: 16px; padding-right: 36px;
        > .title { font-size: 15px; color: #070604;}
        > .number { color: #676664;
          > span { color: #e54257;}
        }
       }
       .content_datail { height: 730px; background: #FFFFFF; overflow: auto;}



    }
    .content-right { width: 414px; height: 830px; padding-left: 0 !important;
      .content_top { height: 40px; line-height: 40px; background: #ffffff; padding-left: 20px;}
      .content_datail { padding-left: 25px; background: #ffffff; padding-bottom: 20px; height: 790px; overflow: auto;}



    }
    .content_wrap {  width: 1175px; margin: 0 auto; overflow: hidden;
      .content-left { width: 760px;
        .content_top { height: 40px; line-height: 40px; background: #f0efed; padding-left: 16px; padding-right: 36px;
          > .title { font-size: 15px; color: #070604;}
          > .number { color: #676664;
            > span { color: #e54257;}
          }
         }
         .content_datail { height: 726px; background: #FFFFFF; overflow: auto;}
      }
      .content-right { width: 414px; height: 830px;
        .content_top { height: 40px; line-height: 40px; background: #ffffff; padding-left: 20px;}
        .content_datail { padding-left: 25px; background: #ffffff; padding-bottom: 20px; height: 790px; overflow: auto;}
      }
    }
  }
</style>
