<template>
  <div ref="evList" class="content content_model view_live content-left">
    <encrypted-view :key="item.ViewId" :data="item" v-for="(item, key) in encryptedViewData"></encrypted-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EncryptedView from '@/components/room/EncryptedView'

export default {
  name: 'room-encrypted-view',
  data() {
    return {
      bottom: true // 是否到底部
    }
  },
  created () {
    this.getEncryptedViews({ topicId: this.topicId})
  },
  mounted () {
    this.toBottom()
  },
  methods: {
    // 滚动到底部
    toBottom () {
      if (!this.bottom) {
				let offset = this.$refs.evList.scrollHeight - this.$refs.evList.scrollTop - this.$refs.evList.offsetHeight
				// 获取最后一个dom的高度
				let list = this.$refs.evList.querySelectorAll('.encry_item')
        let lastDomHeight = list.length > 0 ? list[list.length - 1].offsetHeight : 0
				if (offset > lastDomHeight)
					return
			}

      this.$nextTick(() => {
        this.$refs.evList.scrollTop = this.$refs.evList.scrollHeight
      })
    },
    ...mapActions(['getEncryptedViews'])
  },
  watch: {
    encryptedViewData (data, oldData) {
      this.bottom = oldData.length === 0
      this.toBottom()
    }
  },
  computed: {
    ...mapGetters(['encryptedViewData', 'topicId'])
  },
  components: {
    EncryptedView
  }
}
</script>

<style scoped lang="less">

</style>
