<template>
<div class="vip_room_vote" id="user_viproomvote">
	<p class="num_wrap" v-if="voteInfo">
		老师本月得票<span>{{voteInfo.VoteCount}}</span>,排名{{voteInfo.Rank}}<span><i class="icon iconfont icon-xiangshangjiantou"></i></span>
	</p>
	<div class="ipt_wrap">
		<p class="btn_wrap">
			<input type="text" v-model="num" placeholder="请输入支持老师的票数" /><button @click="userVote">投票</button>
		</p>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
	name: 'viproomvote',
	data() {
		return {
			num:'',
			voteInfo:null,    //投票信息显示
		}
	},
	props:{
		status:{
			type:Object,
			default(){
				return {}
			}
		}
	},
	created(){
		this.api = new Api()
		
		this.getVoteInfo()
		
	},
	methods:{
		getVoteInfo(){    //获取投票信息
			this.api.get('/Room/VoteInfo', {teacher_id:this.status.TeacherId}).then(resp => {
//				console.log(resp)
				this.voteInfo = resp
			})
			
		},
		userVote(){   //投票操作
			let params = {}
			params.token = this.authToken
			params.room_id = this.status.RoomId
			params.training_room_id = this.$route.params.id
			params.data = JSON.stringify([{tid: this.status.TeacherId , num:this.num }])
			this.api.post('/TrainingRoom/Vote', params).then(resp => {
				alert('成功投票')
			})
		}
	},
	computed:{
		...mapGetters(['authToken'])
	}
}
</script>

<style lang="less">
	#user_viproomvote { padding-top: 17px;
		.num_wrap {  line-height: 34px; height: 34px; font-size: 14px; text-align: center; color: #666666;
			span { color: #e33a3f; font-size: 14px; 
				i { font-size: 16px; color: #e33b3a;}
			}
		}
		.ipt_wrap { padding-left: 57px; 
			input { height: 30px; width: 240px; border: 1px solid #ffc2c7;  border-right: none; padding-left: 10px;}
			button { width: 60px; height: 30px; border: none; background: #e43a3d; color: #FFFFFF; cursor: pointer;}
		}
	}
</style>