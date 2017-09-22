<template>
	<div class="viewset_wrap">
		<div class="nowtitle">
			<span class="font_red">*</span><span class="title">今日主题：</span><input class="title_text" type="text" v-model="roomData.TopicName" /><span class="text_number">限14个字</span><input class="btn" @click="save()"  type="button" value="保存" />
		</div>
		<div class="guest">
			<span class="title">邀请嘉宾：</span><input @input="inputlist"  @blur="Focusout()" class="title_text" placeholder="此处仅显示最相似的10条数据" type="text" v-model="title_account" /><input @click="add" class="btn"  type="button" value="添加" />
				<input type="checkbox" v-model="is_permanent" /> 设为常驻嘉宾
			<ul v-show="guestList.length > 0" class="guest_list">
				<li @click="guest_list_check(item.UserName)" v-for="(item, index) in guestList">{{item.UserName}}</li>
			</ul>	
		</div>
		<p class="tishi">请手动输入您要邀请的嘉宾昵称，勾选“设为常驻嘉宾”后下次不用再手动输入</p>
		<p class="jiabin">嘉宾：<span v-for="(item, index) in inviteTeacher">{{item.TeacherName}}<i @click="del(item)" class="icon iconfont icon-chahao"></i></span></p>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'

export default{
	name:'viewset',
	data(){
		return {
			title_text:'',
			title_account:'',
			is_permanent: false,
//			设置可邀请嘉宾预查询列表
			guestList:[]
		}
	},
	mounted(){
	  document.addEventListener('click', (e) => {
   			if (!this.$el.contains(e.target)) {
   				this.guestList = []
   			}
	  })
	},
	created(){
		this.api = new Api()
//		console.log(this.roomData)
		this.getInviteTeacher({ token: Auth.getToken() })
		
		console.log(this.$refs.mybtn)
	},
	methods:{
		
//		邀请嘉宾的处的input事件
		inputlist(){
//			this.bisible = true
			if(this.title_account) {
				let params = {}
				params.name = this.title_account
				this.api.get('/User/MatchingUsers',params).then(resp => {
					this.guestList = resp
				})
			}
		},
		Focusout(){
//			event.preventDefault()
  			
//			this.guestList = []
  				// 这里设置input 绑定的data
  
//				this.bisible = false
			
			
////		this.bisible = false
//		var that = this
//		setTimeout(function(){
//			that.guestList = []
////			this.bisible = false
//		},200)
		},
//		保存直播室今日主题
		save(){
			let params = {}
			params.token = Auth.getToken()
			params.topic_id = this.topicId
			params.topic_name = this.roomData.TopicName
			this.changeRoomTopicname(params).then(data => {
				this.title_account = ''
				this.$notify({
		          title: '成功',
		          message: '更改今日主题成功',
		          type: 'success'
		        });
			})
		},
//		添加直播室嘉宾
		add(){
			let params = {}
			params.token = Auth.getToken()
			params.room_id = this.roomId
			params.topic_id = this.topicId
			params.token = Auth.getToken()
			params.guest_name = this.title_account
			params.is_permanent = this.is_permanent
			params.is_permanent = params.is_permanent == true ? 1 : 0
			this.addInviteTeacher(params).then(data => {
				this.title_account = ''
				this.$notify({
		          title: '成功',
		          message: '添加嘉宾成功',
		          type: 'success'
		        });
			})
		},
//		删除直播室嘉宾
		del(item){
			let params = {}
			params.token = Auth.getToken()
			params.topic_id = this.topicId
			params.guest_name = item.TeacherName
			this.delInviteTeacher( params ).then(data => {
				this.$notify({
		          title: '成功',
		          message: '成功删除嘉宾',
		          type: 'success'
		        });
			})
		},
		guest_list_check(str){
			console.log(str)
			this.title_account = str
			this.guestList = []
		},
		...mapActions(['changeRoomTopicname', 'getInviteTeacher', 'addInviteTeacher', 'delInviteTeacher'])
	},
	watch:{
		topicId(id) {
			if(id > 0) {
//				this.getInviteTeacher()
			}
		}
	},
	computed: {
    ...mapGetters(['roomData','roomId', 'topicId', 'teacherId', '', 'goodsData', 'inviteTeacher'])
  }
}
</script>

<style lang="less" scoped>
	.viewset_wrap {
		padding: 20px 20px;
		> div {padding-left: 10px; height: 30px; line-height: 30px; margin-bottom: 15px;
			
		}
		
		.nowtitle, .guest {
			.font_red { display: inline-block; color: red; font-size: 20px;  vertical-align: middle; margin-right: 5px;}
			.title {display: inline-block; font-size: 14px; color: #3B3B3B; vertical-align: middle; }
			.title_text { padding-left: 5px; display: inline-block; width: 300px; height: 24px; vertical-align: middle; margin-right: 10px; outline: none;}
			.btn { display: inline-block; vertical-align: middle; width: 40px; height: 25px; margin-left: 5px; outline: none;}
		}
		
		.guest { padding-left: 22px; position: relative; 
			> .guest_list { position: absolute; left: 92px; top:27px; width: 150px; border: 1px solid #CECECD; background: #FFFFFF;
				> li {  padding-left: 10px;
					&:hover { background: #CECECD;}
				}
			}
			
		}
		
		
		.tishi { padding-left: 100px; margin-bottom: 15px; color: #888888; font-size: 14px;}
		.jiabin { padding-left: 60px; font-size: 15px; color: #3B3B3B;
			> span { margin: 0 10px;
				> i { cursor: pointer;}
			}
		
		}
		
		
	}


</style>