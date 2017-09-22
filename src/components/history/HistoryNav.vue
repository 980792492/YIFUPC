<template>
  <div class="bottom_nume_left left">
    <div class="roomnav">
      <router-link :to="{name: 'history'}">
        直播
      </router-link>
      <router-link :to="{name: 'history-paper'}">
        加密观点
      </router-link>
      <router-link target="_blank" :to="{name: 'cjg', params: { id: roomId }}">
        藏金阁/文章
      </router-link>
      <router-link target="_blank" :to="{name: 'vip', params: { id: roomId }}">
        特训班
      </router-link>
      <router-link target="_blank" :to="{name: 'livequestion', params: { id: roomId }}">
        问答
      </router-link>
    </div>
    <a><i class="icon iconfont icon-shengyin-copy"></i></a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name:'history-nav',
  data(){
    return {
      roomId: null,
      topicId: null,
    }
  },
  created () {
    [this.roomId, this.topicId] = this.$route.params.id.split('_')
  }
}
</script>

<style lang="less" scoped>
.bottom_nume_left { width: 760px; position: relative;  background: #f7f7f7; text-align: center; height: 60px;  line-height: 60px;
    > .roomnav { width: 696px; float: left; height: 64px;  font-size: 16px; position: relative;
         > a {display: block; width: 138px; float: left; border-bottom: 4px solid #f7f7f7; cursor: pointer; font-size: 16px; color: #666666;
            &:hover {color: #e03a3c;}
         }
    }
    > a {padding: 5px 23px; padding-right: 23px; height: 64px; display: block; cursor: pointer;  border-bottom: 4px solid #f7f7f7; line-height: 54px;
        i { font-weight: 700; width: 20px; height: 20px; color: #e7383f; font-size: 20px;}
    }
}

.router-link-active { border-color:#e03a3c!important;}
</style>
