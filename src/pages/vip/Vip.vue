<template>
	<div class="vip_room">
		<router-view></router-view>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'	
	
export default {
	name: 'vip',
	data(){
		return {
			
		}
	},
	created(){
		if(!this.authUser){
			Auth.openLoginDialog()
			return false
		}
		// 初始化用户数据
	    Auth.isLogin().then(() => {
	      // 已登陆，没有初始化过用户数据，则立即初始化用户数
	      if (!this.authUser) {
	        this.initUserData(this.authToken)
	      }
	    })
	},
	methods: {
    	...mapActions(['initUserData'])
	},
	computed: {
    	...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style lang="less" scoped>

</style>