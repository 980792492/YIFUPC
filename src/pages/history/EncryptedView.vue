<template>
  <div class="content content_model view_live left content-left">
    <y-encrypted-view :key="item.ViewId" :data="item" v-for="(item, key) in encryptedViewData"></y-encrypted-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import YEncryptedView from '@/components/room/EncryptedView'

export default {
  name: 'room-encrypted-view',
  data() {
    return {
    }
  },
  created () {
  	const [roomId, topicId] = this.$route.params.id.split('_')
    this.getEncryptedViews({ topicId: topicId})
  },
  methods: {
    ...mapActions(['getEncryptedViews'])
  },
  computed: {
    ...mapGetters(['encryptedViewData'])
  },
  components: {
    YEncryptedView
  }
}
</script>

<style scoped>
</style>
