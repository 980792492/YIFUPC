<template>
	<div class="article_wrap">
		<router-view></router-view>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
	
import Auth from '@/utils/Auth'
	
export default {
	name:'article',
	data(){
		return {
			str:'1234',
			items:[
				{value:0, label:'name1'},
				{value:1, label:'name2'},
				{value:2, label:'name3'},
				{value:3, label:'name4'},
				{value:4, label:'name5'}
			]
		}
	},
	directives:{
		demo(val){
			console.log(val)
		},
		demo1:{
			bind(){
				console.log(1)
			},
			updata(){
				console.log(2)
			},
			unbind(){
				console.log(3)
			}
		},
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

<style scoped>
	* { font-size: 14px;}
</style>