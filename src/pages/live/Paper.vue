<template>
  <div class="content content_model paper_live content-left">
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
    }
  },
  created () {
    this.getPapers({token: this.authToken})

  },
  methods: {
    ...mapActions(['getPapers'])
  },
  watch: {
    topicId (id) {
      this.getPapers({token: this.authToken})
    },
    authToken (token) {
      this.getPapers({token: token})
    }
  },
  computed: {
    ...mapGetters(['topicId', 'authToken', 'paperData', 'isTeacher', 'isInviteTeacher'])
  },
  components: {
    Paper
  }
}
</script>

<style scoped>

</style>