<!--用于直播室的问答-->
<template>
	<div class="item_inner">
		<div target="_blank"  class="item" v-for="(item, index) in status">
			<div class="question">
				<div class="icon_wrap left">
					<span>问</span>
				</div>
				<div class="text_wrap left">
					<p class="name_wrap">{{item.UserName}}： <span>{{item.CreateDate}}</span></p>
					<router-link target="_blank" :to="{name: 'questiondetail', params:{id: item.Id}}" class="text">{{item.Body}} <span v-if="item.Gold > 0"><i class="icon iconfont icon-xianxing1"></i>{{item.Gold}}G币</span></router-link>
				</div>
			</div>
			<div class="answer">
				<div class="icon_wrap left">
					<img :src="item.AnswerHeadImg" v-if="!(isTeacher && item.Status == 0) || (isTeacher && Teacheranswer == index)" alt="" />
				</div>
				
				<!--用户-->
				<div v-if="!isTeacher" class="text_wrap left">
					<p class="name_wrap" >
						<span class="name">{{item.AnswerUserName}}：</span>
						<span class="time" >{{item.AnswerDate}}</span>          <!--已回答-->
						<span v-if="authUser && item.UserId == authUser.Id && item.Status == 0" class="dengdai" >等待回答</span>
						<span v-if=" !(item.Gold > 0) && item.Status == 2"  class="guoqi_free" >超时未回答，提问已过期</span>
						<span v-if="item.Gold > 0 && item.Status == 2" class="guoqi_pay" >超时未回答，G币已退回</span>
					</p>
					
					<p v-if="item.Status == 1 &&　item.CanLook" class="text">{{item.Answer}}</p>
					<p v-if="item.Status == 1 &&　!item.CanLook" class="tishi" @click.prevent="paylook(item.Id)">老师已经回答，点击查看详细内容</p>
				</div>
				
				<!--老师-->
				<div v-if="isTeacher" class="teacher_text_wrap left"">
					<p class="name_wrap" v-if="item.Status == 1 " >
						<span class="name">{{item.AnswerUserName}}：</span>
						<span class="time">{{item.AnswerDate}}</span>
					</p>				
					<p class="text" v-if="item.Status == 1" >{{item.Answer}}</p>
					<p class="lijianswer" v-if="item.Status == 0 && Teacheranswer != index"  @click.prevent="show(index)" >立即回答该问题</p>
					<div class="answer_wrap" v-if="Teacheranswer == index">
						<textarea placeholder="请输入回答内容" maxlength="150" v-model="content"></textarea> 
						<p><span>限制150字</span><button @click.prevent="answer(item.Id)">发送</button></p>
					</div>
				</div>
				
			</div>
		</div> 	
		

		<el-dialog class="open_question_all_show"
		  :visible.sync="clickshow">
		  <div v-if="authUser" class="content_wrap">
		  	<div class="title_wrap">解锁问答</div>
		  	<div class="text_wrap">
		  		<p class="title">{{unlookView.UserName}} 支付了 <i>{{unlookView.Price}}</i> G币获得此问题的答案！您只需要支付 <i>{{unlookView.Gold}}</i> G币即可查看答案！</p>
		 	</div>
		  	<div class="owner_wrap">
		  		<p class="left">本次提问花费 <i>{{unlookView.Gold}}</i> G币</p>
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
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
	
export default {
	name: 'livequestionItem',
	data() {
		return {
//			ismy: true,        /*是自己的纸条*/
			clickshow: false,    /*弹窗显示控制*/
			Teacheranswer: null,
			content: '',
			unlookView: {}      /*老师已经回答的弹窗信息*/
		}
	},
	created() {
		this.api = new Api()
		
	},
	props:{
		status: {
			type: Array,
			default() {
				return {}
			}
		}
	},
	methods: {
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
		       this.$emit('child', '1')
		       
			})
		},
//		老师 的立即回答该问题按钮
		show(index){
			this.Teacheranswer = index
		},
//		老师回答操作
		answer(str) {
			let params = {}
			params.token = this.authToken
			params.id = str
			params.answer = this.content
			this.api.post('/Ask/Answer', params).then(resp => {
			   this.Teacheranswer = null
			   this.content = ''
		       this.$emit('child', '1')

			})
		},
	},
	computed: {
		...mapGetters(['roomData','teacherId', 'isTeacher', 'authUser', 'authToken'])
	}
}
</script>

<style lang="less" scoped>
.item_inner { padding: 0 50px; min-height: 1570px;
	.item { border-bottom: 1px solid #f2f2f2; padding-bottom: 15px; display: block;
		.question { overflow: hidden;
			.icon_wrap { width: 37px;  padding-top: 15px;
				span { display: block; width: 28px; height: 28px; text-align: center; line-height: 28px; font-size: 14px; color: #ffffff; border-radius: 50%; background: #e43a3d;}
			}
			.text_wrap { width: 1038px;
				.name_wrap { padding-top: 20px; padding-bottom: 4px; font-size: 14px; color: #666666; 
					span { color: #999999; }
				}
				.text { display: inline-block; font-size: 16px; color: #333333; line-height: 30px;
					&:hover { color: #CC0000;}
					span { margin-left: 4px; border: 1px solid #ffcc66; color: #e43a3b; border-radius: 35px; padding: 1px 6px; font-size: 14px; i { font-size: 18px; color: #ffb040;} }
				 }
			}
		}	
		.answer { overflow: hidden; margin-top: 10px;
			.icon_wrap { width: 36px; min-height: 28px;
				> img { width: 28px; height: 28px; border-radius: 50%;}
			}
			.text_wrap { width: 1038px;
				.name_wrap { height: 28px; line-height: 28px; color: #999999;
					/*span { font-size: 14px; color: #e53b3e;}*/
					.name { font-size: 14px; color: #e53b3e;}
					.time {}
					.dengdai { color: #FFFFFF; padding: 4px 22px; background: #CCCCCC; border-radius: 5px;}
					.guoqi_free { color: #a3a1a2; padding: 4px 22px; background: #f3f1f2; border-radius: 5px;}
					.guoqi_pay {color: #ffffff; padding: 4px 22px; background: #a6bbfa; border-radius: 5px;}
				}
				.text { line-height: 24px; font-size: 14px; color: #666666;}
				.tishi { color: #6098ed; font-size: 14px; cursor: pointer;}
				
			}
			
			.teacher_text_wrap { width: 1038px;
				.name_wrap { height: 28px; line-height: 28px; color: #999999;}
				.text {line-height: 24px; line-height: 24px; font-size: 14px; color: #666666; } 
				.lijianswer { padding-top: 10px; color: #5e98ec; font-size: 14px; cursor: pointer;}
				.answer_wrap {  width: 1033px; height: 102px; border: 1px solid #dddee2;
					textarea { width: 1030px; height: 66px; text-indent: 10px; font-size: 14px;  resize: none; border: none; outline: none;}
					p { text-align: right; 
						span { vertical-align: bottom; margin-right: 8px; color: #cccccc;}
						button { width: 78px; height: 30px; margin-right: 6px; border: none; background: #6098ed; font-size: 14px; color: #FFFFFF; border-radius: 5px; cursor: pointer; }
					}
				}
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


</style>