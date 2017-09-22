<template>
	<div ref="live" class="content content_model room_live content-left">
		<div class="upButton" v-show="messageData.length > 0 && messageData[0].Index != 0"><a @click="up">向上50条</a></div>
		<live :topic="topicId" :data="item" :key="index" v-for="(item, index) in messageData" v-on:imgLoad="toBottom"></live>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Live from '@/components/room/Live'

export default {
	name: 'room-live-main',
	data() {
		return {
			top: false,		// 是否到顶部
			bottom: true // 是否到底部
		}
	},
	mounted () {
		this.toBottom()
	},
	methods: {
		up () {
			this.top = true
			this.getMessageUp(50)
		},
		// 滚动到底部
		toBottom () {
			if (!this.bottom) {
				let offset = this.$refs.live.scrollHeight - this.$refs.live.scrollTop - this.$refs.live.offsetHeight
				// 获取最后一个dom的高度
				let list = this.$refs.live.querySelectorAll('.live_item')
        let lastDomHeight = list.length > 0 ? list[list.length - 1].offsetHeight : 0
				if (offset > lastDomHeight)
					return
			}
			this.$nextTick(() => {
				this.$refs.live.scrollTop = this.$refs.live.scrollHeight
			})
		},

		// 滚动到顶部
		toTop () {
			this.$nextTick(() => {
				this.top = false
				setTimeout(() => {
					this.$refs.live.scrollTop = 0
				}, 200)
			})
		},

		...mapActions(['getMessageUp'])
	},
	computed: {
		...mapGetters(['topicId', 'messageData', 'isTeacher', 'isInviteTeacher'])
	},
	watch: {
		messageData (data, oldData) {
			this.bottom = oldData.length === 0
			if (this.top === true) {
				// 到顶部
				this.toTop()
			} else {
				// 滚动到底部
				this.toBottom()
			}
		}
	},
	components: {
		Live
	}
}
</script>
<style scoped>
	.room_live { padding-bottom: 20px;}
</style>
