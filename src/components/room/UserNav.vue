<template>
  <div class="content-nav">
    <router-link :to="{ name: 'live-main' }" title="直播">直播</router-link>
    <router-link :to="{ name: 'cjg' }" title="藏金阁/文章">
      藏金阁/文章
      <img v-show="!isTeacher && !isInviteTeacher && this.goodsCount.CjgCount > 0" src="../../assets/order-icon.png" alt="" />
    </router-link>
    <router-link :to="{ name: 'vipdetail', params:{id: teacherId} }" title="特训班">
      特训班
      <img v-show="!isTeacher && !isInviteTeacher && this.goodsCount.VipCount > 0" src="../../assets/order-icon.png" alt="" />
    </router-link>
     <!--<router-link :to="{ name: 'video' }">视频</router-link>--> 
    <!--<a v-show="teacherId > 0" :href="`//room.yifucj.com/NewVideo/TeacherList?teacherid=${teacherId}`" target="_blank" title="视频" >视频</a>-->
    <router-link  :to="{name: 'livequestion'}">问答</router-link>
    <!-- <router-link :to="{ name: 'video' }">视频</router-link> -->
    <a v-show="teacherId > 0" :href="`//room.yifucj.com/NewVideo/TeacherList?teacherid=${teacherId}`" target="_blank" title="视频" >视频</a>
    <!-- <a :href="`//q.yifucj.com/lswz?uid=${teacherId}`" target="_blank" title="博文">博文</a> -->
    <router-link :to="{ name: 'intro' }" title="老师介绍">老师介绍</router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'user-nav',
  computed: {
    ...mapGetters(['goodsCount', 'teacherId', 'isTeacher', 'isInviteTeacher'])
  }
}
</script>

<style lang="less" scoped>
.content-nav { width: 1175px; height: 64px; background: #ffffff; margin: 0 auto; margin-bottom: 15px;
       > a { display: block; float: left;  width: 195px; text-align: center; line-height: 60px; border-bottom: 4px solid #fefefe; font-size: 16px; cursor: pointer; color: #666;
          &:hover {  color: #e03a3c;}
        }
       .navcolor {border-color: #e03a3c; color: #e03a3c; }
//       > div:nth-child(1) { border-color: #e73b3b;}
  }
 //元素下边框为红色
.router-link-active { border-color:#e03a3c!important;}
</style>
