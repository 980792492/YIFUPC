<template>
  <div class="bottom_nume_left">
    <div class="roomnav">
      <router-link :to="{name: 'live-main'}">
        直播
      </router-link>
      <router-link :to="{name: 'live-encrypted-view'}">
        加密观点
        <span v-show="!isTeacher && !isInviteTeacher && goodsCount.ViewCount > 0">[<i>{{ goodsCount.ViewCount }}</i>]</span>
      </router-link>
      <router-link :to="{name: 'cjg'}">
        藏金阁/文章
        <img v-show="!isTeacher && !isInviteTeacher && goodsCount.CjgCount > 0" src="../../assets/order-icon.png" />
      </router-link>
      <router-link :to="{name: 'vip'}">
        特训班
        <img v-show="!isTeacher && !isInviteTeacher && goodsCount.VipCount > 0" src="../../assets/order-icon.png" />
      </router-link>
      <router-link :to="{name: 'livequestion'}">
        问答
        <span v-show="isTeacher && goodsCount.PaperCount > 0">[<i>{{ goodsCount.PaperCount }}未答</i>]</span>
      </router-link>
    </div>
    <a class="sound" @click="quite"><i class="icon iconfont" :class="isQuite ? 'icon-jingyin' : 'icon-shengyin-copy'"></i></a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'
import Web from '@/utils/Web'

export default {
  name:'room-bottom-nav',
  data () {
    return {
//      老师端切换推送(控制是否显示)
      isQuite: false
    }
  },
  created () {
    this.isQuite = !Web.isPlay(this.roomId)
  },
  methods:{
    quite(){
      Web.setPlay(this.isQuite, this.roomId)
      this.isQuite = !this.isQuite
    },
  },
  computed:{
    ...mapGetters(['goodsCount', 'teacherId', 'isTeacher', 'roomId', 'isInviteTeacher'])
  }
}
</script>

<style lang="less" scoped>
.bottom_nume_left { position: relative; background: #f7f7f7; text-align: center; height: 64px;  line-height: 64px;
    > .roomnav { width: 693px; height: 64px;  font-size: 16px; position: relative; float: left;
        > a {font-size: 16px; color: #666; display: block; width: 138px; border-bottom: 4px solid #f7f7f7; height: 64px; cursor: pointer; float: left;
            &:hover {color: #e03a3c;}
            > span {
              > i  {  color: #e3384a;font-size: 14px;}
            }
        }
    }
    .sound {padding: 5px 23px; padding-right: 23px; height: 64px; display: block; cursor: pointer; border-bottom: 4px solid #f7f7f7; line-height: 54px;
        i { font-weight: 700; width: 20px; height: 20px; color: #e7383f; font-size: 20px;}
    }
}



.router-link-active { border-color:#e03a3c!important; color: #e03a3c!important; }
</style>
