<template>
  <div ref="live" class="content content_datail room_live">
    <y-live :topic="topicId" :data="item" :key="index" v-for="(item, index) in message" v-on:imgLoad="toBottom"></y-live>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import YLive from '@/components/room/Live'

export default {
  name: 'history-live',
  data() {
    return {
    }
  },
  mounted () {
    this.toBottom()
  },
  methods: {
    toBottom () {
      this.$nextTick(() => {
        this.$refs.live.scrollTop = this.$refs.live.scrollHeight
      })
    },
  },
  computed: {
    ...mapState({
      topicId: state => state.history.topic,
      message: state => state.history.messageData
    })
  },
  components: {
    YLive
  }
}
</script>
<style scoped>
  .room_live { padding-bottom: 20px;}
</style>
