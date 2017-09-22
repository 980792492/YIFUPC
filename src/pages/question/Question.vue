<template>
	<div class="question_all_wrap">
		<router-view></router-view>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/utils/Auth'

export default {
	name: 'question',
	data(){
		return {
			
		}
	},
	created(){
		// 初始化用户数据 
	    Auth.isLogin().then(() => {
	      // 已登陆，没有初始化过用户数据，则立即初始化用户数
	      if (!this.authUser) {
	        this.initUserData(this.authToken)
	      }
	    })
	},
	methods:{
    	...mapActions(['initUserData'])
		
	},
	computed:{
    	...mapGetters(['authUser', 'authToken'])
	}
	
}

</script>

<style scoped lang="less">

.question_all_wrap {
	
}
</style>