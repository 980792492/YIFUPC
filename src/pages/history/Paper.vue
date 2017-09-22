<template>
  <div class="content content_model paper_live left content-left">
    <paper :data="item" :key="item.PaperIndex"  v-for="(item, key) in paperData"></paper>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Paper from '@/components/room/Paper'
import Api from '@/utils/Api'

export default {
  name: 'room-live-paper',
  data() {
    return {
    	topicId: 0
    }
  },
  created () {
    const [roomId, topicId] = this.$route.params.id.split('_')
    this.getPapers({topicId: topicId, token: this.authToken}) 
    this.topicId = topicId
  },
  methods: {
    ...mapActions(['getPapers'])
  },
  watch: {
    topicId (id) {
      id > 0 && this.getPapers({ topicId: id, token: this.authToken})
    },
    authToken (token) {
      this.topicId > 0 && this.getPapers({ topicId: this.topicId, token: token})
    }
  },
  computed: {
    ...mapGetters(['authToken', 'paperData', 'isTeacher', 'isInviteTeacher'])
  },
  components: {
    Paper
  }
}
</script>

<style scoped>
  .teacherheight { height: 660px !important;}
</style>