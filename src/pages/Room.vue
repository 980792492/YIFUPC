<template>
  <div id="room">
  	<y-teacher-info></y-teacher-info>
  	<y-user-nav title='直播'></y-user-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import YTeacherInfo from '@/components/room/TeacherInfo'
import YUserNav from '@/components/room/UserNav'
import Auth from '@/utils/Auth'
import Web from '@/utils/Web'
import store from '@/store'

export default {
  name: 'room',
  beforeRouteEnter (to, from, next) {
    store.dispatch('initRoomData', { id: to.params.id, token: store.getters.authToken })
    .then(_ => next())
    .catch(error => {
      console.log('直播室数据加载失败！！[room beforeRouteEnter initRoom] ' + error)
      next(false)
    })
  },
  created () {
  	//初始化房间广告位数据
  	this.initAds()
    this.initGoods()
    Web.initTitle(this.roomData.TeacherName)
  },
  methods: {
    ...mapActions(['initGoods', 'initAds'])
  },
  computed: {
    ...mapGetters(['roomData'])
  },
  components: {
  	YTeacherInfo,
		YUserNav,
  }
}
</script>
<style scoped>
	 #room{ padding-bottom: 13px !important; background: #e3e3e3; padding-top: 19px;}
</style>
<style lang="less" src="../styles/room.less"></style>
