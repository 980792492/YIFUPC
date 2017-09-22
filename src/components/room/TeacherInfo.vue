<template>
  <div class="people_info">
    <div class="head">
      <img :src="roomData.HeadImg" alt="我是头像" />
    </div>
    <div class="info">
      <p class="info_title">
        <span class="name">{{ roomData.TeacherName }}</span>
        <span class="icon_guanzhu" @click="like">{{ isLike ? '已关注' : '关注' }}</span>
        <!-- todo share -->
        <!-- <span class="icon_fenxiang" @click="fenxiang">分享</span> -->
      </p>
      <p class="info_text">{{ roomData.Introduce }}</p>
    </div>
    <div class="pic">
      <a target="_blank" :href="roomAds1.LinkUrl">
        <img :src="roomAds1.ImageUrl" alt="我的是链接，点我" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
  name: 'teacher-info',
  data () {
    return {
      isLike: false
    }
  },
  props:{

  },
  created:function(){
    this.isLike = this.roomData.IsLike
    this.api = new Api()
  },
  methods:{
    like () {
      if (!this.authToken) {
        Auth.openLoginDialog()
      } else {
        this.api.post('Room/Like', {
          token: this.authToken,
          room_id: this.roomId,
          type: this.isLike ? 1 : 0
        }).then (resp => {
          this.isLike = !this.isLike
        }).catch (error => {
          console.log(error)
        })
      }
    },
    fenxiang: function(){
      alert('点击了分享')
    },
  },
  computed:{
    ...mapGetters(['roomData', 'roomAds1', 'authToken', 'roomId'])
  }
}
</script>

<style lang="less" scoped>
  .people_info {
    > .pic {
      > a { width: 100%; height: 100%;
        > img { width: 100%; height: 100%;}
      }
    }
  }
</style>
