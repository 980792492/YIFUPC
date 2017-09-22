<!--直播室问答-->
<template>
	<div v-if="obj" class="question_wrap">
		<div class="action_wrap">
			<p v-if="isTeacher" class="tishi left">
				提问将在提问时间的隔日24点过期，届时未回答提问的G币将自动退回用户账户
			</p>
			<p v-if="!isTeacher" class="tishi left">
				老师累计已回答<span>{{obj.AnswerCount}}</span>个提问
			</p>
			<p v-if="isTeacher" class="action right">您当前设置的问答价格为：<span>{{obj.Price}}</span>G币/次 <button @click="revamp">修改</button></p>
			<p v-if="!isTeacher" class="action right">老师当前设置的问答价格为：<span>{{obj.Price}}</span>G币/次 <button @click="ask">向TA提问</button></p>
		</div>
		<div v-if="!isTeacher" class="user_nav">
			<span @click="switcher(1)" :class="{spanred: staticItem == 1}">老师已回答的</span><span  @click="switcher(0)" :class="{spanred: staticItem == 0}">我的</span>
			<router-link v-if="authUser" target="_blank" :to="{name: 'questionmain', params:{id: 'my' }}">查看我的所有提问>></router-link>
			<router-link v-else target="_blank" :to="{name: 'questionmain', params:{id: 'all' }}">查看所有提问>></router-link>
		</div>
		<div class="item_wrap">

			<live-question-item :status="data" @child="listen"></live-question-item>

			<div class="page">
				<el-pagination
		     		 @size-change="handleSizeChange"
		      		@current-change="handleCurrentChange"
		      		:current-page="page"
		      		:page-sizes="[10, 20, 30, 40]"
		      		:page-size="num"
		      		layout="total, sizes, prev, pager, next, jumper"
		      	:total="allTotal">
		   </el-pagination>
		</div>

		</div>


		<!--点击向他提问按钮弹窗-->
		<el-dialog class="recommend_question_open_wrap"
			:visible.sync="recommendopenshow"
			 >
			 <div  class="contant_wrap" v-if="authUser && isask" >
			 	<p class="title">向<span>{{roomData.TeacherName}}</span>提问 :</p>
			 	<div class="input_wrap">
			 		<textarea name="" rows="" cols="" maxlength="200"  v-model="recommendcontent"  ></textarea>
			 		<p>还剩<span>{{200 - recommendcontent.length}}</span>字</p>
			 	</div>
			 	<p class="tishi">若老师在隔日24点前未回答，G币将退回</p>

			 	<div class="idea_wrap">
			 		<p class="left paynum">本次提问需花费<span>{{recommendinner.Price}}</span>G币</p>
			 		<p class="right ownernum">您的G币数： {{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank">充值 >></a></p>

			 	</div>
			 	<p class="warning" v-if="authUser.CurrentGcoinsCount - recommendinner.Price < 0"><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足，请充值</p>
			 	<div class="btn_wrap"  :class="{btn_wrap_wraning: authUser.CurrentGcoinsCount - recommendinner.Price < 0 }">

			 		<button @click="lijisubmit">提交问题</button>
			 	</div>
			 </div>
			 <div class="asked_success" v-if="!isask">
			 	<div class="icon_wrap">
					<span><i class="icon iconfont icon-duihao"></i></span>
				</div>
				<p class="tishi">您的提问已推送给老师，请耐心等待~~</p>
				<div class="asked_btn_wrap">
					<a class="go_my_answer left"  @click="gomyquestion" >查看我的提问</a>
					<a  @click="recommendopenshow = false" class="go_self right">关闭继续浏览</a>
				</div>
			 </div>
		</el-dialog>


		<!--老师的修改价格弹窗-->
		<el-dialog
			class="open_change_price"
		  :visible.sync="dialogVisible">
			<div class="input_wrap">
				<div class="title">修改问答价格</div>
				<div class="my_input">
					<input type="text" placeholder="请输入价格" v-model="price" /><button @click="ensure">提交</button>
				</div>
			</div>
		</el-dialog>

	</div>
	<div v-else class="question_wrap"><h1 class="tip">老师暂未开通问答功能</h1></div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

import LiveQuestionItem from '@/components/question/LiveQuestionItem'
export default {
	name: 'question',
	data() {
		return {
//			isTeacher: true,   /*是否老师*/
			staticItem: 1,       /*默认的为1*/
			obj: null,          /*设置默认对象用于接受默认请求的数据*/
			data: [],
			page: 1,
			num: 10,
			allTotal: null,
			recommendopenshow: false,
			isask: true,
			recommendcontent: '',
			recommendinner: {},   /*提问的弹窗的显示内容绑定*/
			dialogVisible: false,    /*老师修改价格弹窗*/
			price: ''

		}
	},
	created(){
		this.api = new Api()
		this.loadStaticList()
	},
	methods:　{
		revamp() {
			this.dialogVisible = true
		},
		ask() {
			if(!this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			this.isask = true
			this.initUserData(this.authToken)

			this.api.get('/Ask/Price', {teacher_id: this.teacherId}).then(resp => {
				this.recommendinner = resp
			})
			this.recommendopenshow = true
		},
		lijisubmit(){
//			当账户的余额大于需消费金额时可用
			if( !(this.authUser.CurrentGcoinsCount - this.recommendinner.Price < 0)) {
				let params = {}
				params.token = this.authToken
				params.teacher_id = this.teacherId
				params.content = this.recommendcontent
				params.type = 1
				this.api.post('/Ask/SendQuestion', params).then(resp => {
					this.recommendcontent = ''
//					提问成功显示
					this.isask = false
					this.loadStaticList()
				})
			}
		},
		switcher(str) {
			if (str === 0 && !this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			this.page = 1
			this.num = 20
			this.staticItem = str
		},
//		默认加载直播室老师回答的
		loadStaticList(){
			if(!this.teacherId ){
				return false
			}
			let params = {}
			params.token = this.authToken
			params.teacher_id = this.teacherId
			params.type = this.staticItem
			params.num = this.num
			params.page = this.page
			this.api.get('/Ask/RoomPaperList', params).then(resp => {
				if (resp.Price == -1) {
					return false
				}
				this.obj = resp
				this.data = resp.List
				this.allTotal = resp.TotalCount
				document.body.scrollTop = 0
				document.documentElement.scrollTop = 0
			})


		},
//		用户的点击弹窗的查看我的问答
		gomyquestion() {
			this.recommendopenshow = false
			this.staticItem = 0
			this.loadStaticList()
		},
//		老师的价格修改弹窗的提交按钮
		ensure(){
			let params = {}
			params.token  = this.authToken
			params.price = this.price
			this.api.post('/Ask/SetPrice', params).then(resp => {
				 this.$notify({
		          title: '成功',
		          message: '价格修改成功',
		          type: 'success'
		        });
		        this.dialogVisible = false
		        this.loadStaticList()
			})
		},
		listen(data){
			this.loadStaticList()
		},
		handleSizeChange(val) {
        	this.num = val
        	this.loadStaticList()
        	/*document.body.scrollTop = 0
			document.documentElement.scrollTop = 0*/
      	},
      	handleCurrentChange(val) {
        	this.page = val
        	this.loadStaticList()
        	/*document.body.scrollTop = 0
			document.documentElement.scrollTop = 0*/
      	},
		...mapActions(['initUserData'])
	},
	watch: {
		staticItem(id){
			this.loadStaticList()
		},
		teacherId(id) {
			this.loadStaticList()
		}
	},
	computed:{
		...mapGetters(['roomData','teacherId', 'isTeacher', 'authUser', 'authToken'])
	},
	components: {
		LiveQuestionItem
	}

}
</script>

<style lang="less" scoped>
	.question_wrap { width: 1175px; margin: 0 auto;
		.action_wrap { height: 60px; background: #f8f8f8;
			.tishi { height: 60px; background: url(../assets/ts.png) no-repeat 35px 15px; line-height: 60px; padding-left: 70px; font-size: 14px; color: #676767;
				span { font-size: 14px; color: #e4393f;}
			 }
			.action { height: 60px; line-height: 60px;  font-size: 14px; color: #666666;
				span { font-size: 14px; color: #e43a3d;}
				button { margin-right: 30px; padding: 0 20px; height: 30px; margin-left: 12px; border-radius: 5px; outline: none; cursor: pointer; border: none; background: #e43a3d; color: #FFFFFF; font-size: 14px;}
			}
		}
		.user_nav { height: 69px; padding-top: 30px; background: #FFFFFF; padding-left: 45px;
			span { display: inline-block; cursor: pointer; font-size: 14px; width: 120px; height: 30px; text-align: center; line-height: 30px; border: 1px solid #999999;}
			span:nth-child(1) { border-right:1px solid #e43a3b;}
			span:nth-child(2) { border-left:none;}
			.spanred { border-color: #e43a3b; color: #e43a3b;}
			a { font-size: 14px; margin-left: 14px; color: #666666;}
		}


		.item_wrap { background: #FFFFFF;min-height: 1664px; margin-bottom: 15px;
			.page {padding-top: 40px; padding-bottom: 60px; text-align: center;}
		}


	}


	/*向某人提问的弹窗样式*/
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
					.icon_wrap { padding-top: 25px; text-align: center;
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

/*老师修改价格弹窗*/
.open_change_price {
		.el-dialog { width: 650px; height: 250px;
			.input_wrap { padding-top: 20px; padding-left: 30px;
				.title { font-size: 30px; color: #CCCCCC;}
				.my_input { padding-top: 28px;
					input { width:400px ; height: 40px; padding-left: 12px; font-size: 16px;}
					button { width: 150px; height: 40px; border: none; background: #e43a3d; font-size: 16px; color: #FFFFFD; margin-left: 16px; cursor: pointer;}

				}
			}

		}
	}

h1.tip { background: #fff; text-align: center; font-size: 20px; line-height: 72px; color: #ccc; }
</style>
