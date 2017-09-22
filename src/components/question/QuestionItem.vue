<template>
	<div class="question_item_wrap" >
		<div  class="item"  v-for="(item, index) in status" :key="index">
			<div class="ask_wrap">
				<div class="img_wrap left">
					<div class="ask">问</div>
				</div>
				<div class="text_wrap left">
					<p class="title">{{item.UserName}}： <span>{{item.CreateDate}}</span></p>
					<router-link target="_blank" :to="{name: 'questiondetail', params:{id: item.Id}}"  class="text">{{item.Body}}<span v-if="item.Type == 1"><i class="icon iconfont icon-xianxing1"></i><em>{{item.Gold}}G币</em></span></router-link>
				</div>
			</div>
			
			<!--item的通用部分-->
			<div  v-if="belong != 'my'" class="answer_wrap">
				<div class="img_wrap left">
					<router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId} }"><img class="ask teacherimg" :src="item.AnswerHeadImg" alt="头像" /></router-link>
				</div>
				<!--回答右侧-->
				<div class="text_wrap left">
					<p class="title"><router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId}}">{{item.AnswerUserName}} </router-link>: <span>{{item.AnswerDate}}</span></p>
					<!--有权限查看-->
					<p class="text"  v-if="item.CanLook == 1">{{item.Answer}}</p>
					<!--无权限查看-->
					<div class="text" v-if="item.CanLook == 0" >
						<a @click.prevent="paylook(item.Id)">老师已回答，点击查看详细内容</a>
					</div>
				</div>
				<!--回答框块-->
				<div v-if="Teacheranswer" class="area_wrap left">
					<textarea @click.prevent="click" placeholder="请输入回答答案" ></textarea>
					<p class="btn_wrap"><span>限150字</span><button>发送</button></p>
				</div>
			</div>
			
			
			<!--我的问答item的回答部分-->
			<div v-if="belong == 'my'" class="answer_wrap">
				<div class="img_wrap left">
					<router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId}}"><img v-if="Teacheranswer == index || item.Status == 1 || item.Status == 0 || item.Status == 2"  class="ask teacherimg"  :src="item.AnswerHeadImg" alt="" /></router-link>
				</div>
				<!--回答右侧-->
				<div  class="text_wrap left" v-if="authUser">
					<!--已经回答(用户和老师)-->
					<p class="name_wrap" v-if="item.Status == 0 && authUser.UserIdentity != 2"><router-link target="_blank" :to="{name:'livequestion', params:{id: item.RoomId}}"><span class="name">{{item.AnswerUserName}}</span></router-link><span class="time">：</span><span class="weihuida" v-if="authUser.UserIdentity != 2 && item.Status == 0">等待回答</span></p>
					<p class="name_wrap" v-if="item.Status == 2 && authUser.UserIdentity != 2"><router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId }}"><span class="name">{{item.AnswerUserName}}</span><span class="time">：</span></router-link><span :class="item.Type > 0 ? 'pay' : 'free' " class="weihuida_tuihui" v-if="authUser.UserIdentity != 2 && item.Status == 2">{{item.Type == 1 ? '超时未回答，G币已退回' : '超时未回答，提问已过期'}}</span></p>

					<p class="name_wrap" v-if="item.Status == 1 && isTeacher"> <router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId}}"><span class="name" v-if="item.Status == 1" >{{item.AnswerUserName}}</span></router-link><span class="time" v-if="item.Status == 1">：{{item.AnswerDate}}</span><span class="weihuida" v-if="authUser.UserIdentity != 2 && item.Status == 0">等待回答</span></p>
					<p class="text" v-if="item.Status == 1">{{item.Answer}}</p>
					<!--未回答(laoshi)-->
					<div class="text" v-if="authUser.UserIdentity == 2 && item.Status == 0" >
						<a @click.prevent="show(index)" class="teacher_action" v-if="isTeacher && Teacheranswer != index" href="javascript:void(0)">立即回答该问题</a>
					</div>
				</div>
				<!--回答框块-->
				<div v-if="Teacheranswer == index" class="area_wrap left">
					<textarea placeholder="请输入回答答案" maxlength="150" v-model = "content" ></textarea>
					<p class="btn_wrap"><span>限150字</span><button @click="answer(item.Id)">发送</button></p>
				</div>
			</div>
		</div>
		
		<!--老师已回答，点击查看详细的弹窗-->
		<el-dialog class="open_question_all_show"
		  :visible.sync="clickshow">
		  <div v-if="authUser" class="content_wrap">
		  	<div class="title_wrap">解锁问答</div>
		  	<div class="text_wrap">
		  		<p class="title">{{unlookView.UserName}} 支付了 <i>{{unlookView.Price}}</i> G币获得此问题的答案！您只需要支付 <i>{{unlookView.Gold}}</i> G币即可查看答案！</p>
		 	</div>
		  	<div class="owner_wrap">
		  		<p class="left">本次解锁花费 <i>{{unlookView.Gold}}</i> G币</p>
		  		<p class="right">您的G币数：{{authUser.CurrentGcoinsCount}}  <a href="//pay.yifucj.com" target="_blank">充值 >></a></p>
		  	</div>
		  	<div class="btn_wrap">
		  		<p v-if="authUser.CurrentGcoinsCount - unlookView.Gold < 0" class="warning"><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足</p>
		  		<button :class="{warningshow: authUser.CurrentGcoinsCount - unlookView.Gold > 0}"  @click="tijiaowenti(unlookView.Id)" >确认解锁</button>
		  	</div>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
	
export default {
	name: 'questionitem',
	data(){
		return {
			isTeacher: true,
			
			isMy: true,
//			回答框是否显示
			Teacheranswer:null,
			content: '',
			
			
			
			clickshow: false,   /*老师已回答，点击查看详细的弹窗*/
			unlookView: {}   /*老师已经回答的弹窗信息*/
		}
	},
	props:{
		status: {
			type: Array,
			default: function() {
				return {}
			}
		},
		belong: {
			 type: String
		}
	},
	created(){
		this.api = new Api()
		
	},
	methods:{
//		老师 的立即回答该问题按钮
		show(index){
			this.Teacheranswer = index
		},
//		用户的查看别人的解锁
		paylook(str){
			if(!this.authUser){
				Auth.openLoginDialog()
				return false
			}
			let params = {}
			params.token = this.authToken
			params.id = str
			this.api.get('/Ask/UnlockInfo', params).then(resp => {
				this.unlookView = resp
			})
			this.clickshow = true
		},
		
//		用户查看别人的付费操作
		tijiaowenti(str){
			let params = {}
			params.token = 	this.authToken
			params.id = str
			this.api.post('/Ask/UnLock', params).then(resp => {
				this.$notify({
		          title: '成功',
		          message: '解锁成功',
		          type: 'success'
		       });
		       this.clickshow = false
		       this.$emit('child', this.clickshow)
		       
			})
		},
//		老师回答操作
		answer(str){
			let params = {}
			params.token = this.authToken
			params.id = str
			params.answer = this.content
			this.api.post('/Ask/Answer', params).then(resp => {
			   this.Teacheranswer = null
			   this.content = ''
		       this.$emit('child', this.clickshow)
			})
		}
		
	},
	computed:{
    	...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style scoped lang="less">
 .question_all_wrap {
 	.item { display: block; padding-top:25px; border-bottom: 1px solid #f2f2f2; padding-bottom: 15px;
 		.ask_wrap { overflow: hidden;
 			.img_wrap { width: 38px;
 				.ask { width: 27px; height: 27px; background: #e53b3c; color: #FFFFFF; text-align: center; line-height: 27px; font-size: 16px; border-radius: 50%;}
 			}
 			.text_wrap { width: 682px;
 				.title { line-height: 24px; height: 24px; font-size: 14px; color: #666666;

 				 }
 				.text { line-height: 24px; overflow: hidden; width: 680px; max-height: 52px; display:inline-block;  font-size: 16px; color: #666666;  padding: 2px 0; padding-bottom: 0; word-break: break-all;
 					&:hover { color: #CC0000;}
 					span { border: 1px solid #ffcd64; padding: 2px 10px; border-radius: 15px; margin-left: 6px;
 						i { color: #ffcd64; font-size: 18px;}
 						em { color: #e43a3b; font-size: 16px; margin-left: 2px;}
 					}
 				}
 			}
 		}
 		.answer_wrap {overflow: hidden;
 			.img_wrap { width: 38px; height: 30px;
 				.ask { width: 27px; height: 27px; background: #e53b3c; color: #FFFFFF; text-align: center; line-height: 27px; font-size: 16px; border-radius: 50%;}
 			}
 			.text_wrap { width: 682px;
 				.name_wrap { height: 30px; line-height: 30px;
 					span { font-size: 14px;}
 					.name { color: #e43a3d;}
 					.time { color: #999999;}
 					.weihuida {display: inline-block; width: 100px; height: 24px; line-height: 24px; text-align: center; border-radius: 8px; background: #CCCCCC;color: #FFFFFF;  }
 					.weihuida_tuihui {display: inline-block; padding: 0 20px; height: 24px; line-height: 24px; text-align: center; border-radius: 8px; background: #CCCCCC;color: #FFFFFF;  }
 					.pay { background: #A9BBFD;}
 					.free { background: #F4F4F4; color: #A2A0A1;}
 				}
 			
 				.title { line-height: 24px; height: 24px; font-size: 14px; color: #666666; 
 					a { font-size: 14px; color: #666666; 
 						&:hover { color: #C61420;}
 					}
 					span { color: #999999;};
 				 }
 				.text { font-size: 16px; word-break: break-all; color: #666666; line-height: 24px; max-height: 50px;
 					.teacher_action { color: #5f98ef;}
 					a { color: #5e98ec; font-size: 14px;}
 				}
 			}
 			
 			.area_wrap { width: 682px; border: 1px solid #dddee2;
 				textarea { width: 680px; border: none; resize: none; height: 80px; font-size: 14px; outline: none; text-indent: 14px;}
 				.btn_wrap { height: 36px; text-align: right;
 					span { color: #cbcbcb;}
 					button { background: #6098ef; color: #FFFFFF; width:78px ; height: 30px; border: none; border-radius: 5px; margin: 0 5px;  }
 				}
 				
 			}
 			
 			
 		}
 	}
 	
 	
 	
 	.open_question_all_show {
 		.content_wrap { padding: 0 28px; padding-top: 15px;
 			.title_wrap { font-size: 20px; color: #999999;  padding-bottom: 24px;}
 			.text_wrap {
 				.title { font-size: 14px; padding-bottom: 28px; border-bottom:2px solid #e6e6e6 ; i { color: #e53b3e; font-size: 14px;}  }
 			}
 			.owner_wrap { padding-top: 40px; padding-bottom: 8px; overflow: hidden;
 				p { font-size: 14px; i { color: #ff0133; font-size: 14px;}  a { color:#ff0133; margin-left: 10px;}}
 			}
 			.btn_wrap {  text-align: center;
 				.warning { text-align: left; background: #fbfba5; height: 30px; line-height: 30px; color: #e53b3c; font-size: 14px; span { margin:0 8px; i { font-size: 18px;}}}
 				button { border: none; background: #CCCCCC; width: 300px; height: 50px; font-size: 16px; color: #ffffff; margin-top:14px; cursor: pointer;}
 				.warningshow {margin-top:44px; background: #e43a3d;}
 			}
 			 
 		}
 	}
 	
 	
 	
 }	



</style>