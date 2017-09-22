<template>
	<div class="detail_wrap">
		<div class="detail" v-if="articleData">
			<div class="detail_text left">
				<div class="question">
					<div class="icon_wrap left">
						<span>问</span>
					</div>
					<div class="text_wrap left">
						<p class="text">{{articleData.Body}}
							<span class="icon_wrap"><i class="icon iconfont icon-xianxing1"></i>{{articleData.Gold}}G币</span></p>
						<p class="name_wrap">
							<span class="left">提问者：{{articleData.UserName}}</span>
							<span class="right">{{articleData.CreateDate}}</span>
						</p>
					</div>
				</div>
				<div class="answer">
					<div class="top">
						<div class="img_wrap left">
							<img :src="articleData.AnswerHeadImg" alt="" />
						</div>
						<div class="name_wrap left" v-if="articleData.Look == 1 && articleData.Status == 1 ">
							<span>{{articleData.AnswerUserName}}</span> :  {{articleData.AnswerDate}}
						</div>
						<div class="name_wrap left" v-if="articleData.Look == 1 && articleData.Status == 2 ">
							<span>{{articleData.AnswerUserName}}</span> : <span :class="articleData.Gold ? 'answer_status_tuihui' : 'answer_status_guoqi' ">{{articleData.Gold > 0? '超时未回答，G币已退回' : '超时未回答，提问已过期'}}</span>  {{articleData.AnswerDate}}
						</div>
						<!--本人问题，老师未回答（可以查看，老师未回答）-->
						<div class="name_wrap left" v-if="articleData.Look == 1 && articleData.Status == 0 && authUser.Id != articleData.AnswerUserId ">
							<span>{{articleData.AnswerUserName}}</span> : <span class="answer_status">等待老师回答</span> {{articleData.AnswerDate}}
						</div>
						<div class="teacher_lijianswer left" v-if="authUser.Id == articleData.AnswerUserId && articleData.Status == 0">
							<a v-if="!answerShow" @click="answerShow = !answerShow">立即回答该问题</a>	
							<div class="teacher_lijianswer_content_wrap" v-if="answerShow">
								<textarea class="teacher_lijianswer_content" maxlength="150" v-model="answerContent" placeholder="请输入回答内容"></textarea>
								<p class="action_wrap"><span>限制150字</span><button @click="answerAction">发送</button></p>
							</div>
						</div>
					</div>
					
						
					<!--问答详情的无权限查看-->
					<div v-if="articleData.Look == 0" class="inner_nolimit" @click="unlock">
						<div class="icon_wrap">
							<span><i class="icon iconfont icon-suo"></i></span>
						</div>
						<p class="info_tetx">老师已回答，您只需要支付<i>{{articleData.UnlockPrice}}</i>G币即可解锁查看答案>></p>
					</div>
					<div v-if="articleData.Look == 1" class="inner_limit">
						{{articleData.Answer}}
					</div>
					
				</div>
			</div>
			<div class="teacher_info right">
				<div class="top" v-if="teacherInfo">
					<p class="img_wrap"><img :src="teacherInfo.HeadImg"/></p>
					<p class="action_wrap">{{teacherInfo.UserName}}<span :class="{quxiao: teacherInfo.Attaction == 1 }" @click="guanzhu">{{teacherInfo.Attaction == 0 ? '关注' : '取消关注' }}</span> 
						<router-link target="_blank" :to="{name: 'room', params:{id: teacherInfo.RoomId}}">看直播</router-link></p>
					<p class="info_wrap">{{teacherInfo.Info}}</p>
				</div>
				<!--详情页面推荐位-->
				<div class="recommend">
					<div class="item" v-for="(item, index) in recommendList" :key="index">
						<div class="top">
							<div class="img_wrap left">
								<img :src="item.HeadImg"/>
							</div>
							<div class="text_wrap left">
								<p class="name_wrap"><span class="name left">{{item.TeacherName}}</span> <span class="num right">已回答<i>{{item.AnswerCount}}</i></span></p>
								<p class="info">{{item.Introduce}}</p>
							</div>
						</div>
						<div class="bottom">
							<span class="num left">{{item.Price}}<i>G币/次</i></span>
							<span class="tiwen right" @click="lijiask(item)">立即提问</span>
						</div>
					</div>
				</div>
				<router-link class="to_allteacher" target="_blank" :to="{name: 'allteacher'}">查看更多老师  >> </router-link>
			</div>
		</div>
		
		<!--无权限查看的解锁弹窗-->
		<el-dialog
		  class="open_question_all_show"
		  :visible.sync="dialogVisible"
		  >
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
		
		<!--推荐位点击立即提问弹窗-->
		<el-dialog class="recommend_question_open_wrap"
		  :visible.sync="recommendopenshow"
		 >
		 <div class="contant_wrap" v-if="authUser && !isask" >
		 	<p class="title">向<span>{{recommendinner.TeacherName}}</span>提问 :</p>
		 	<div class="input_wrap">
		 		<textarea name="" rows="" cols="" maxlength="200"  v-model="recommendcontent"  ></textarea>
		 		<p>还剩<span>{{200 - recommendcontent.length}}</span>字</p>
		 	</div>
		 	<p class="tishi">若老师在次日24点前未回答，G币将退回</p>
		 	
		 	<div class="idea_wrap">
		 		<p class="left paynum">本次提问需花费<span>{{recommendinner.Price}}</span>G币</p>
		 		<p class="right ownernum">您的G币数： {{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank">充值 >></a></p>
		 		
		 	</div>
		 	<p class="warning" v-if="authUser.CurrentGcoinsCount - recommendinner.Price < 0"><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足，请充值</p>
		 	<div class="btn_wrap"  :class="{btn_wrap_wraning: authUser.CurrentGcoinsCount - recommendinner.Price < 0 }">

		 		<button @click="lijisubmit">提交问题</button>
		 	</div>
		 </div>
		 
		 
		 <!--提问成功弹窗显示-->
		<div v-if="isask" class="asked_success">
			<div class="icon_wrap">
				<span><i class="icon iconfont icon-duihao"></i></span>
			</div>
			<p class="tishi">您的提问已推送给老师，请耐心等待~~</p>
			<div class="asked_btn_wrap">
				<a class="go_my_answer left" target="_blank"  @click="gomyquestion"  href="javascript:void(0)">查看我的答案</a>
				<a  @click="recommendopenshow = false" class="go_self right" href="javasript:void(0)">关闭继续浏览</a>
			</div>
		</div>
 
		 
		 
		 
		</el-dialog>
		
		
	</div>
</template>

<script>
import Api from '@/utils/Api'	
import Auth from '@/utils/Auth'	
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'questiondetail',
	data() {
		return {
			dialogVisible: false , 
			
			articleData: null,  /*文章详情*/
			teacherInfo: {},   /*老师信息*/
			unlookView: {},     /*解锁的纸条信息*/     
			recommendList: [],	/*加载推荐位信息*/
			recommendopenshow: false,  /*推荐位信息弹窗*/
			recommendinner: {},   /*推荐位的显示内容绑定*/
			recommendcontent: '',
			isask: false,
			answerContent: '',  //老师的回答输入内容
			answerShow:false,   //是否显示回答操作部分
			
		}
	},
	created(){
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
		this.api = new Api()
		
		this.loadData()
		this.loadTeacherData()
		this.loadRecommend()
	},
	methods:{
//		加载文章详情
		loadData(){
			let params = {}
			params.id = this.$route.params.id
			params.token = this.authToken
			this.api.get('ask/Detail', params).then(resp => {
				this.articleData = resp
			})
		},
//		加载老师信息
		loadTeacherData() {
			if(this.articleData){
				let params = {}
				params.token = this.authToken
				params.teacher_id = this.articleData.AnswerUserId
				this.api.get('/ask/TeacherInfo', params).then(resp => {
					this.teacherInfo = resp
				})
			}
		},
//		点击解锁
		unlock() {
//			未登录,操作登录
			if(!this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			
			let params = {}
			params.id = this.$route.params.id
			params.token = this.authToken
			this.api.get('/Ask/UnlockInfo', params).then(resp => {
				this.unlookView = resp
			})
			
			this.dialogVisible = true
		},
//		用户查看别人的付费操作
		tijiaowenti(str){
			let params = {}
			params.token = 	this.authToken
			params.id = str
			this.api.post('/Ask/UnLock', params).then(resp => {
				this.$notify({
		          title: '成功',
		          message: '提问成功',
		          type: 'success'
		       });
		       this.dialogVisible = false
			   this.loadData()
			})
		},
		guanzhu(){
			let params = {}
			params.token = this.authToken
			params.room_id = this.teacherInfo.RoomId
			params.type = this.teacherInfo.Attaction == '0' ? '0' : '1'
			this.api.post('/Room/Like', params).then(resp => {
				this.teacherInfo.Attaction = !this.teacherInfo.Attaction
			})
		},
		loadRecommend(){
			this.api.get('/Ask/Recommand').then(resp => {
				this.recommendList = resp
			})
		},
		lijiask(str){
			this.recommendinner = str
			this.isask = false
			this.api.get('/Ask/Price', {teacher_id: str.TeacherId}).then(resp => {
				this.recommendinner.Price = resp.Price
			})
			this.initUserData(this.authToken)
			this.recommendopenshow = true
			
		},
		lijisubmit(){
//			当账户的余额大于需消费金额时可用
			if( !(this.authUser.CurrentGcoinsCount - this.recommendinner.Price < 0)) {
				let params = {}
				params.token = this.authToken
				params.teacher_id = this.recommendinner.TeacherId
				params.content = this.recommendcontent
				params.type = 1
				this.api.post('/Ask/SendQuestion', params).then(resp => {

					this.recommendcontent = ''
	//				提问成功显示
					this.isask = true
	
				})
			}
		},
		gomyquestion(){
			this.recommendopenshow = false
			this.$router.push({name: 'questionmain'})
		},
//		老师查看自己详情回答按钮
		answerAction(){
			let params = {}
			params.token =  this.authToken
			params.id =  this.articleData.Id
			params.answer = this.answerContent
			this.api.post('/Ask/Answer', params).then(resp => {
				window.location.reload()
			})
			
		},
		...mapActions(['initUserData'])
	},
	watch: {
		articleData(val) {
			this.loadTeacherData()
		}
	},
	computed: {
		...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style lang="less" scoped>
	.detail_wrap {  background: #e3e3e3; padding-top: 15px; padding-bottom: 200px;
		.detail { width: 1175px;  margin: 0 auto; overflow: hidden;
			.detail_text { min-height: 742px; width: 760px; padding: 0 40px;  background: #FFFFFF;
				.question { overflow: hidden;  padding-top: 80px; padding-bottom: 16px; border-bottom: 1px solid #f2f2f2;
					.icon_wrap { width: 37px;
						span { display: block; width: 28px; height: 28px; font-size: 14px; background: #e43b3e; border-radius: 50%; text-align: center; line-height: 28px; color: #FFFFFF;}
					}
					.text_wrap { overflow: hidden;
						.text { font-size: 14px; color: #333333; width: 643px; padding-bottom: 4px; padding-top: 4px; word-break: break-all;
							.icon_wrap { margin-left: 20px; border: 1px solid #ffcc67; padding: 2px 8px; border-radius: 15px; color: #e43a3d; font-size: 14px;
								i { color: #ff9900; font-size: 18px; }
							}
						}
						.name_wrap { span { font-size: 14px; color: #999999;} }
					}
				}
				.answer {  
					.top { height: 58px; 
						.img_wrap { width: 38px; padding-top: 20px;
							> img { width: 28px; height: 28px; border-radius: 50%;}
						}
						.name_wrap { height: 58px; line-height: 58px; font-size: 14px; color: #999999;
							span { font-size: 14px; color: #e53b3b;}
							.answer_status {padding: 2px 20px; margin-left: 10px; background: #C1C1C1; border-radius: 15px; color: #FFFFFF;}
						 	.answer_status_guoqi { padding: 2px 20px; background: #f3f3f3; color: #FFFFFF; border-radius: 15px; margin-left: 10px;}
						 	.answer_status_tuihui { padding: 2px 20px; background: #A9BBFD; color: #FFFFFF; border-radius: 15px; margin-left: 10px; }
						 }
						 .teacher_lijianswer { padding-top: 20px;	
						 	a { display: inline-block; height: 24px; line-height: 24px; font-size: 14px; color: #5f98ef;}
						 	.teacher_lijianswer_content_wrap { width: 640px;  border: 1px solid #dddee2;
						 		.teacher_lijianswer_content { resize: none; width: 638px; height: 80px; font-size: 14px; outline: none; text-indent: 10px; border: none;  }
						 		.action_wrap { text-align: right; padding-bottom: 4px;
						 			span { color: #cbcbcb; margin-right: 10px;}
						 			button { width: 78px; height:30px; border-radius: 5px; border: none; outline: none; cursor: pointer; background: #6098ef; color: #FFFFFF; margin-right: 10px;} 
						 		}
						 	}
						  }
						 
						 
					}
					/*无访问权限*/
					.inner_nolimit { width: 680px; height: 287px; background: #f2effa; padding-top: 54px; cursor: pointer;
						.icon_wrap { text-align: center; width: 76px; height: 76px; background: #d7d2e6; border-radius: 50%; margin: 0 auto;
							> span { display:inline-block; width: 68px; height: 68px; line-height: 62px; margin-top: 4px; border: 4px solid #f3f0fb; border-radius: 50%;
								i { font-size: 36px; color: #f2effa;}
							}
						}
						.info_tetx { text-align: center; font-size: 20px; color: #988cb0; padding-top: 24px;
							i { font-size: 20px; color: #e23c3c;}
						}
					}
					
					/*有访问权限*/
					.inner_limit { padding-left: 37px; line-height: 24px; font-size: 14px; color: #666666; word-break: break-all;}
					
					
				
				}
			}
			
			/*右侧的老师详情以及推荐位*/
			.teacher_info { min-height: 742px; width: 414px;  background: #FFFFFF; padding-top: 29px;
				> .top { overflow: hidden;  border-bottom: 1px solid #EEEEEE; padding-bottom: 15px;
					.img_wrap { height: 90px; text-align: center;
						img { width: 90px; height: 90px; border-radius: 50%;}
					}
					.action_wrap { height: 45px; line-height: 45px; text-align: center; font-size: 16px; color: #333333;
						span { margin-left: 8px; margin-right: 4px; border: 1px solid #e6393f; padding: 3px 18px; font-size: 14px; border-radius: 8px; color: #e6393f; cursor: pointer;}
						.quxiao { color: #CCCCCC; border-color: #CCCCCC; font-size: 12px;}
						a { border: 1px solid #e6393f;  padding: 3px 18px; font-size: 14px; border-radius: 8px; color: #e6393f; cursor: pointer;}
					}
					.info_wrap { padding: 0 22px; line-height: 20px; font-size: 14px; color: #676767;}
				}
			
				.recommend { padding: 0 20px; padding-top: 30px;
					.item { overflow: hidden;
						.top { overflow: hidden; padding-top: 20px;
							.img_wrap { width: 65px; 
								> img { width: 50px; height: 50px; height: 50px; border-radius: 50%;}
							}
							.text_wrap {   width: 308px; overflow: hidden;
								.name_wrap {  overflow: hidden; 
									.name { font-size: 16px;}
									.num { font-size: 14px; color: #989898; i { color: #e3393c; font-size: 14px;}}
								}
								.info { color: #666666; height: 20px; line-height: 20px; overflow: hidden; text-overflow: ellipsis;  white-space: nowrap;}
							}
						}
						.bottom { padding-left: 65px; height: 50px; border-bottom: 1px solid #EEEEEE;
							 .num { font-size: 24px; color: #e33a3d; i { font-size: 14px; color: #666666;}}
							 .tiwen { width: 100px; height: 30px; border: 1px solid #e33b3b; line-height: 30px; text-align: center; font-size: 14px; color: #e53c39; border-radius: 15px; cursor: pointer;}
						}
					}
				}
				.to_allteacher { display: block; padding-top: 20px; font-size: 14px; text-align: center; }
				
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


/*推荐位的弹窗样式*/
	.recommend_question_open_wrap {
				.el-dialog { width: 650px; height: 445px;
					.contant_wrap {padding: 0 30px;
						.title { height: 75px; line-height: 75px; font-size: 20px; color: #666666;
							span { color: #e33a3d; font-size: 20px;}
						}
						.input_wrap { width: 550px; height: 120px; border: 1px solid #DDDDDD;
							textarea { width: 100%; height: 90px; border: none; resize: none; outline: none; }
							p { text-align: right; padding-right: 10px; padding-bottom: 10px;
								span { color: #55a9ff;}
							}
						} 
						.tishi { padding-top: 6px; color: #999999;}
						.idea_wrap { overflow: hidden;  padding-top: 25px;
							.paynum {  color: #343434; 
								span { color: #e33a3d;}
							}
							.ownernum { width:160px; text-align: right;
								a { color: #fe0000;}
							}
						}
						.warning { height: 30px; font-size: 14px; line-height: 30px; background: #fbfba5; color: #E03A3C; margin-top: 10px;
							span { margin: 0 10px; i {font-size: 18px;} }
						 }
						.btn_wrap { margin-top: 51px; text-align: center;
							button { width: 300px; height: 50px; background: #e43a3d; border: none; font-size: 16px; color: #FFFFFF; cursor: pointer;}
						}
						
						.btn_wrap_wraning { margin-top: 21px; text-align: center;
							button { width: 300px; height: 50px; outline: none; background: #CCCCCC; border: none; font-size: 16px; color: #FFFFFF; cursor: pointer;}
						}
						
						
						
						
					
					}
				
				}
			}
			
	/*提问成功的弹窗显示*/
	.asked_success { padding: 0 38px;
		.icon_wrap { padding-top: 20px; text-align: center;
			span {
				i { font-size: 160px; color: #e33b3b;}
			}
		}
		.tishi { font-size: 16px; text-align: center; color: #000000;}
		.asked_btn_wrap { margin-top: 50px; overflow: hidden;
			a { display: block;}
			.go_my_answer { background: #e33b3b; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #FFFFFF;}
			.go_self { border: 1px solid #999999; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #666666;}
		}
		
		
	}
	
	
	


</style>