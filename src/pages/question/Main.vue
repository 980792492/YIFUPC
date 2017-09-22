<template>
	<div>
		<div class="top_img_wrap">
			<img src="../../assets/question_top.jpg"/>
		</div>
		<div class="content_wrap">
			<!--问答左侧-->
			<div class="content-left  left">
				<div class="nav_wrap">
					<div @click="changenav(1)" class="left"  :class="{activenav: viewnum == 1 }" >全部问答</div>
					<div @click="changenav(2)" class="left"  :class="{activenav: viewnum == 2}" >付费问答</div>
					<div @click="changenav(3)" class="left"  :class="{activenav: viewnum == 3}" >免费问答</div>
					<div @click="changenav(4)" class="left"  :class="{activenav: viewnum == 4 }" >我的问答 <span>{{myquestionNum}}</span></div>
				</div>
				<div class="content_detail">
					<div class="class_wrap">
						<!--动态组件-->
						<component :is="viewcontrol"></component>
					</div>
				</div>
			</div>
			<!--问答右侧-->
			<div class="content-right right">
				<p class="right_pay_question">
					<button @click="askaction(1)">付费问</button>
				</p>
				<p class="right_free_question">
					<button @click="askaction(0)">免费问</button>
				</p>
				<!--免费问和付费问弹窗-->
				<el-dialog class="dialog_open"
					:visible.sync="dialogVisible">

					<!--提问显示 （付费问 ）-->
  					<div v-if="isask"  class="dialog_content_wrap">
  						<div v-if ="isPay && authUser">
  							<p class="title" >选择老师：</p>
	  						<div class="change">
	  							<div @click="selectItem(item, index+1)" v-for="(item, index) in TeacherList " :key="index+1" class="teacher_item" :class="{active_item: staticitem == index+1 }">
	  								<div v-if="staticitem == index+1 " class="dagou"></div>
	  								<div class="img_wrap left">
	  									<img :src="item.HeadImg"/>
	  								</div>
	  								<div class="text_wrap left">
	  									<p>{{item.TeacherName}}</p>
	  									<p><span>{{item.Price}}</span>G币/次</p>
	  								</div>
	  							</div>
	  							<div class="teacher_item link_item"><router-link target="_blank" :to="{name:'allteacher'}">更多老师..</router-link></div>
	  						</div>
	  						<div class="content_text_wrap">
	  							<p :class="{ispay_p: isPay}">提出你的问题 <i class="tishi" >若老师在次日24点前未回答，G币将退回</i></p>
	  							<div class="text_area" :class="{ispay_text_area: isPay}">
	  								<textarea name="" rows=""  cols="" maxlength="120" v-model="content"  placeholder="请输入提问问题"></textarea>
	  								<div class="worldnum">还剩余<span>{{ 120 - content.length }}</span>字</div>
	  							</div>
	  						</div>
	  						<!--付费提问的个人G币显示-->
	  						<div class="pay_Gbi_show" v-if="isPay && authUser">
	  							<p class="left">本次提问需花费<span>{{teacherItem.Price}}</span>G币</p>
	  							<p class="right">您的G币数：{{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank">充值 >></a></p>
	  						</div>
	  						<div v-if="isPay && authUser.CurrentGcoinsCount - teacherItem.Price < 0 ">
	  							<p class="warning"><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足</p>
	  						</div>
	  						<div class="btn_wrap_pay" :class="{ispay_btnwrap: isPay &&  authUser.CurrentGcoinsCount - teacherItem.Price < 0 }">
	  							<button @click="submit">提交问题</button>
	  						</div>
  						</div>
  						<!--免费问-->
  						<div v-if ="!isPay && freeNum != 0">
  							<p class="title" >选择老师：</p>
	  						<div class="change">
	  							<div @click="selectItem(item, index+1)" v-for="(item, index) in TeacherList " :key="index+1" class="teacher_item" :class="{active_item: staticitem == index+1 }">
	  								<div v-if="staticitem == index+1 " class="dagou"></div>
	  								<div class="img_wrap left">
	  									<img :src="item.HeadImg"/>
	  								</div>
	  								<div class="text_wrap left">
	  									<p>{{item.TeacherName}}</p>
	  									<p><span>{{item.Price}}</span>G币/次</p>
	  								</div>
	  							</div>

	  							<div class="teacher_item link_item"><router-link target="_blank" :to="{name:'allteacher', query:{orderBy: 'gold'}}">更多老师..</router-link></div>
	  						</div>
	  						<div class="content_text_wrap">
	  							<p :class="{ispay_p: isPay}">提出你的问题<span >您今日还剩<i>{{freeNum}}</i>次免费提问</span></p>
	  							<div class="text_area" :class="{ispay_text_area: isPay}">
	  								<textarea name="" rows=""  cols="" maxlength="120" v-model="content"  placeholder="请输入提问问题"></textarea>
	  								<div class="worldnum">还剩余<span>{{ 120 - content.length }}</span>字</div>
	  							</div>
					 			<p class="tishi">若老师在次日24点前未回答，G币将退回</p>
	  						</div>
	  						<div class="btn_wrap" :class="{ispay_btnwrap: isPay}">
	  							<button @click="submit">提交问题</button>
	  						</div>
  						</div>

  						<!--免费机会用完显示-->
						<div v-if="freeNum == 0 && !isPay" class="asked_success  error">
							<div class="icon_wrap">
								<span><i class="icon iconfont icon-chahaozhuanhuan"></i></span>
							</div>
							<p class="tishi">您今日的免费问次数已用完，您还可以选择质量更高的付费问~</p>
							<div class="asked_btn_wrap">
								<a class="go_my_answer left" @click="dialogVisible = false">去付费问答</a>
								<a   @click="dialogVisible = false" class="go_self right">关闭继续浏览</a>
							</div>
						</div>
  					</div>

  					<!--提问成功弹窗显示-->
					<div v-if="!isask" class="asked_success">
						<div class="icon_wrap">
							<span><i class="icon iconfont icon-duihao"></i></span>
						</div>
						<p class="tishi">您的提问已推送给老师，请耐心等待~~</p>
						<div class="asked_btn_wrap">
							<a class="go_my_answer left"  @click="gomyquestion" >查看我的提问</a>
							<a  @click="closeOpen" class="go_self right" >关闭继续浏览</a>
						</div>
					</div>



				</el-dialog>

				<!--推荐位-->
				<div class="right_top">
					<div v-for="(item, index) in RecommandList " :key="index" class="item">
						<div class="item_top">
							<div class="img_wrap left">
								<router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId }}"><img :src="item.HeadImg" alt="" /></router-link>
							</div>
							<div class="text_wrap left">
								<p class="name"><router-link :to="{name: 'livequestion', params:{id: item.RoomId }}" target="_blank">{{item.TeacherName}}</router-link></p>
								<p class="text">{{item.Introduce}}</p>
							</div>
							<div class="answer_num right">
								已回答<span>{{item.AnswerCount}}</span>
							</div>
						</div>
						<div class="item_bottom">
							<p><span>{{item.Price}}</span>G币/次 <button @click="lijiask(item)">立即提问</button></p>
						</div>
					</div>

					<!--推荐位的立即提问的弹窗-->
					<el-dialog class="recommend_question_open_wrap"
					  :visible.sync="recommendopenshow"
					 >
					 <!--推荐位付费-->
					 <div class="contant_wrap" v-if="authUser　&& recommendinner.Price > 0"　 >
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
					 <!--推荐位免费(有剩余次数)-->
					 <div class="contant_wrap" v-if="authUser && recommendinner.Price == 0 &&　recommendinner.RemainingCount >  0"　 >
					 	<p class="title"> 向<span>{{recommendinner.TeacherName}}</span>提问 : <i class="right">您今日还剩剩<em>{{recommendinner.RemainingCount}}</em>次免费问</i></p>
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
					 <!--推荐位免费(无剩余次数)-->
					 <div class="contant_wrap noNum error" v-if="authUser &&recommendinner.Price == 0  &&　recommendinner.RemainingCount == 0"　 >
					 	<div class="icon_wrap">
							<span><i class="icon iconfont icon-chahaozhuanhuan"></i></span>
						</div>
						<p class="tishi">您今日的免费问次数已用完，您还可以选择质量更高的付费问~</p>
						<div class="asked_btn_wrap">
							<a class="go_my_answer left"  @click="recommendopenshow = false">去付费问答</a>
							<a  @click="recommendopenshow = false" class="go_self right" >关闭继续浏览</a>
						</div>
					 </div>

					</el-dialog>

				</div>
				<!--30日排行榜-->
				<div class="right_recommed">
					<p class="paihang_wrap"><img src="../../assets/question_paihang.png"/><span>30日问答排行榜</span></p>
					<div v-for="(item, index) in  RankList" :key="index" class="item">
						<div class="item_top">
							<div class="img_wrap left">
								<router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId }}"><img :src="item.HeadImg" alt="" /></router-link>
							</div>
							<div class="text_wrap left">
								<p class="name"><router-link :to="{name: 'livequestion', params:{id: item.RoomId}}">{{item.TeacherName}}</router-link></p>
								<p class="text">{{item.Introduce}}</p>
							</div>
							<div class="answer_num right">
								已回答<span>{{item.AnswerCount}}</span>
							</div>
						</div>
						<div class="item_bottom">
							<p><span>{{item.Price}}</span>G币/次 <button @click="lijiask(item)" >立即提问</button></p>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import QuestionAll from '@/components/question/QuestionAll'
import QuestionPay from '@/components/question/QuestionPay'
import QuestionFree from '@/components/question/QuestionFree'
import QuestionMy from '@/components/question/QuestionMy'
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'


export default {
	name: 'questionmain',
	data () {
		return {
//			staticnav: 1,
//			currentView: QuestionAll,
			dialogVisible: false,
			viewnum: 1,
			viewcontrol: '',
			staticitem: 1,
//			判断显示的是提问还是提问成功
			isask: true,
//			判断显示的是付费问还是免费问
			isPay: false,
//			提问弹窗老师列表
			TeacherList: [],

//			推荐位列表
			RecommandList:[],

//			设置选择老师的信息存储
			teacherItem: {},
//			剩余免费提问次数
			freeNum: 3,
//			提问弹窗的信息绑定
			content:'',
			recommendinner: {},  /*推荐位的显示内容绑定*/
			recommendopenshow: false,   /*推荐位的立即提问弹窗显示*/
			recommendcontent: '',         /*推荐位弹窗的输入内容绑定*/

//			七日排行版列表
			RankList: [],
//			myquestionNum: 0,  //问题个数显示



		}
	},
	created(){
		this.api = new Api()

		this.InitTab(this.$route.params.id)
		this.initquestion(this.$route.params.id)

//		加载推荐位
		this.loadRecommand()
//		加载七日排行版
		this.loadRankList()

	},
	mounted(){
		if (this.authToken) {
			this.InitQuestionNum(this.authToken)
		}
	},
	methods:{
//		关闭继续浏览
		closeOpen(){
//			this.dialogVisible = false
			window.location.reload()
		},
		
//		设置页面加载左侧组件
		InitTab(str){
			if(str == 'all'){ this.viewnum = 1; this.viewcontrol = QuestionAll }
			if(str == 'pay'){this.viewnum = 2; this.viewcontrol = QuestionPay}
			if(str == 'free'){this.viewnum = 3; this.viewcontrol = QuestionFree }
			if(str == 'my'){this.viewnum = 4; this.viewcontrol = QuestionMy }
		},
//		左侧组件加载
		initquestion(str){

		},
//		加载推荐位数据
		loadRecommand(){
			this.api.get('/Ask/Recommand').then(resp => {
				this.RecommandList = resp
			})
		},
		lijiask(str){
//			判断是否登录
			if(!this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			this.api.get('/Ask/Price', {teacher_id: str.TeacherId, token: this.authToken}).then(resp => {
				this.recommendinner = resp

			})
			this.recommendopenshow = true
		},
//		立即提问的提交按钮
		lijisubmit(){
//			当账户的余额大于需消费金额时可用
			if( !(this.authUser.CurrentGcoinsCount - this.recommendinner.Price < 0)) {
				let params = {}
				params.token = this.authToken
				params.teacher_id = this.recommendinner.TeacherId
				params.content = this.recommendcontent
				params.type = 1
				this.api.post('/Ask/SendQuestion', params).then(resp => {
					this.recommendopenshow = false
					this.recommendcontent = ''
//					提问成功显示
					this.isask = false
					this.dialogVisible = true
					this.initquestion(this.$route.params.id)
				})
			}
		},
//		加载七日排行数据
		loadRankList(){
			this.api.get('/Ask/RankingList').then(resp => {
				this.RankList = resp
			})
		},
		changenav (str){
			// this.viewnum = str
			switch (str){
				case 1:
					this.$router.push({name:'questionmain', params:{id:'all'}})
					break;
				case 2:
					this.$router.push({name:'questionmain', params:{id:'pay'}})
					break;
				case 3:
					this.$router.push({name:'questionmain', params:{id:'free'}})
					break;
				case 4:
					if(!this.authUser){
						Auth.openLoginDialog()
						return false
					}
					this.$router.push({name:'questionmain', params:{id:'my'}})
					break;
			}
		},
//		点击付费问或者免费问按钮
		askaction(str){
		//		判断是否登陆
			if(!this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			this.initUserData(this.authToken)
			this.isask = true
//			付费
			if(str == 1){
				this.isPay = true
				let params = {}
				params.token = this.authToken
				params.type = 1
				this.api.get('/Ask/Teachers', params).then(resp => {
					this.TeacherList = resp.List
					this.teacherItem = resp.List[0]
				})
			}
//			免费
			if (str == 0){
				if(this.freeNum == 0){

				}
				this.isPay = false
				let params = {}
				params.token = this.authToken
				params.type = 0
				this.api.get('/Ask/Teachers', params).then(resp => {
					this.TeacherList = resp.List
					this.teacherItem = resp.List[0]
					this.freeNum = resp.FreeCount
				})
			}
			this.dialogVisible = true


		},
		selectItem(item, str){
			this.teacherItem = item
			this.staticitem = str
		},
//		免费和付费问的提交按钮
		submit(){
			if(!(this.authUser.CurrentGcoinsCount - this.teacherItem.Price < 0)){
				let params = {}
				params.token = this.authToken
				params.teacher_id = this.teacherItem.TeacherId
				params.content = this.content
				params.type = Number(this.isPay)
				this.api.post('/Ask/SendQuestion', params).then(resp => {
					this.isask = false
					this.content = ''

				})
			}
		},
		gomyquestion(){
			this.dialogVisible = false
			this.$router.push({name:'questionmain', params:{id: 'my'}})
			window.location.reload()
		},
		...mapActions(['getUserChangeData', 'initUserData', 'TabviewCotrol', 'InitQuestionNum'])
	},
	computed:{
		...mapGetters(['authUser', 'authToken', 'myquestionNum'])
	},
	watch:{
		$route () {
			this.InitTab(this.$route.params.id)
    }
//		viewcontrol(val){
//			this.currentView = val
//		}
	},
	components:{
		QuestionAll,
		QuestionPay,
		QuestionFree,
		QuestionMy
	}
}

</script>


<style lang="less" scoped>
	.top_img_wrap { font-size: 0; width: 100%; text-align: center; background: #4e75f6;
		img { width: 1175px; height: 298px; margin: 0 auto;}
	}
	.content_wrap {  background: #FFFFFF; overflow: hidden; width: 1175px; margin: 0 auto;
		.content-left { width: 720px;  padding-top: 15px;
			.nav_wrap {  background: #f7f7f7; overflow: hidden;
				> div { width: 180px; height: 60px; border-bottom: 2px solid #F7F7F7; font-size: 16px; line-height: 60px; color: #000000; text-align: center; cursor: pointer;}
				> div:nth-last-child(1) {
					span { background: #dd1c1f;color: #FFFFFF; padding: 1px 10px; border-radius: 15px;}
				}
			}
			.content_detail {  min-height: ;

			}
		}

		.content-right {  width: 374px; padding-top: 50px;
			.right_pay_question { height: 60px;
				button { width: 100%; height: 100%; background: #e43a3d; border: none; border-radius: 35px; font-size: 30px; color: #FFFFFF; cursor: pointer; outline: none; }
			 }
			.right_free_question { height: 60px; margin-top: 15px;
				button {  background: #d7ecff;  width: 100%; height: 100%; border: none; border-radius: 35px; font-size: 30px; color: #367df9; cursor: pointer; outline: none;}
			}

			.dialog_open {
				.el-dialog { width: 650px; height: 500px;}

				.dialog_content_wrap { padding-left: 28px; padding-right: 24px;
					.title { font-size: 20px; color: #999999; height: 36px; line-height: 36px;}
					.change {  overflow: hidden;
						.teacher_item { width: 176px; height: 70px; float: left; border: 1px solid #dddddd; margin-right:10px; margin-bottom: 6px; position: relative; cursor: pointer;
							.img_wrap { width: 70px; padding-left:10px; padding-top: 8px;
								img { width: 50px; height: 50px; border-radius: 50%;}
							}
							.text_wrap { padding-top: 10px;
								p { line-height: 27px; font-size: 14px;
									span { color: #e43a3b; font-size: 18px; margin-right: 4px;}
								}
							}
							.dagou { position: absolute; width: 22px; height: 22px; background: url(../../assets/dagou.png) no-repeat; bottom: 0; right: 0; }
						}

						.active_item { border: 1px solid #FE9D0E;}
						.link_item { text-align: center; line-height: 70px; border: none;
							a { color: #e43c3c; font-size: 14px; }
						}
					}

					.content_text_wrap {
						 > p  { font-size: 20px; color: #999999; padding-top: 26px; padding-bottom: 12px;
							span { margin-left: 275px; color: #323232; font-size: 14px;
								i { color: #3366ff; font-size: 14px; padding: 0 2px;}
							 }
						}
						.ispay_p { padding-top: 4px; padding-bottom: 8px;
							.tishi { float: right;  margin-right: 10px; vertical-align: middle; padding-top: 10px;}
						}

						.text_area { width: 550px; height: 146px; border: 1px solid #5C5C5C;
							textarea { width: 100%; height: 122px ; font-size: 14px; text-indent: 14px; resize: none; border: none; outline: none; }
							.worldnum { text-align: right; padding-right: 10px; padding-bottom: 5px;
								span { color: #0099FF;}
							}
						}
						.tishi { font-size: 12px; padding-top: 6px; padding-bottom: 0; }

						.ispay_text_area { height: 100px;
							textarea { height: 76px;}
						}


					}

					.pay_Gbi_show { overflow: hidden; padding-top: 5px;
						p { color: #323232; padding-right: 10px;
							span { color: #e43a3d;}
							a { color: #e43a3d;}
						}
					}

					.warning {color: #e6393d; background: #fbfba5; height: 30px; line-height: 30px;
						span { margin-right: 6px; i { font-size: 18px;}}
					}
					.btn_wrap { width: 550px;  text-align: center; margin-top: 34px;
						button { width: 300px; height: 50px; outline: none; background: #e43a3d; border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; outline: none;}
					}
					.btn_wrap_pay {width: 550px;  text-align: center; margin-top: 24px;
						button { width: 300px; height: 50px; outline: none; background: #e43a3d; border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; outline: none;}
					}
					.ispay_btnwrap { margin-top: 6px;
						button { background: #CCCCCC;}
					}
				}



				/*提问成功的弹窗显示*/
				.asked_success { padding: 0 38px;
					.icon_wrap { padding-top: 70px; text-align: center;
						span {
							i { font-size: 160px; color: #e33b3b;}
						}
					}
					.tishi { font-size: 16px; text-align: center; color: #000000;}
					.asked_btn_wrap { margin-top: 50px; overflow: hidden;
						a { display: block; cursor: pointer;}
						.go_my_answer { background: #e33b3b; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #FFFFFF;}
						.go_self { border: 1px solid #999999; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #666666;}
					}


				}

				.error { padding: 0;
					.icon_wrap { padding-top: 50px; padding-bottom: 20px;
						 i { font-size: 120px !important;}}
					.asked_btn_wrap { margin-top: 80px;}
				}



			}





			.right_top { overflow: hidden; margin-top: 22px;
				.item { overflow: hidden; padding-top: 24px; border-bottom: 1px solid #EEEEEE; padding-bottom: 17px;
					.item_top { overflow: hidden;
						.img_wrap { width: 64px;
							img { width: 50px; height: 50px; border-radius: 50%;}
						}
						.text_wrap { width: 230px;
							.name { font-size:16px ;
								a { font-size: 16px; color: #666666;
									&:hover { color: #C61420;}
								}
							}
							.text { font-size: 14px; width: 220px; height: 20px; line-height: 20px; margin-top: 4px; color:#666666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
						}
						.answer_num { font-size: 14px; color: #999999;
							span { color: #e6393d; font-size: 14px;}
						}
					}
					.item_bottom { overflow: hidden; margin-top: 6px;
						p {  padding-left: 66px; font-size: 14px; color: #666666;
							span {  color: #e43a3d; font-size: 24px;}
							button { width: 100px; height: 30px; outline: none; float: right; border: 1px solid #e43a3b; background: none; font-size: 14px; color: #e43a3d; border-radius: 15px; cursor: pointer;};
						}
					}
				}
			}
			.right_recommed { padding-top: 50px;
				.paihang_wrap {
					img { vertical-align: middle; }
					span {font-size: 16px; vertical-align: middle; margin-left: 10px;font-weight: 900; color: #555;}
				}
				.item { overflow: hidden; padding-top: 24px; border-bottom: 1px solid #EEEEEE; padding-bottom: 17px;
					.item_top { overflow: hidden;
						.img_wrap { width: 64px;
							img { width: 50px; height: 50px; border-radius: 50%;}
						}
						.text_wrap { width: 225px;
							.name { font-size: 16px;
								a { font-size: 16px; color: #666666;
									&:hover { color: #CC0000;}
								}
							}
							.text { font-size: 13px; color: #666666; width: 225px; height: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  }
						}
						.answer_num { font-size: 14px; color: #999999;
							span { color: #e6393d; font-size: 14px;}
						}
					}
					.item_bottom { overflow: hidden;
						p {  padding-left: 66px; font-size: 14px; color: #666666;
							span {  color: #e43a3d; font-size: 24px;}
							button { width: 100px; height: 30px; float: right; outline: none; border: 1px solid #e43a3b; background: none; font-size: 14px; color: #e43a3d; border-radius: 15px; cursor: pointer;};
						}
					}
				}
			}
		}

	}


	/*推荐位的弹窗样式*/
	.recommend_question_open_wrap {
				.el-dialog { width: 650px; height: 445px;
					.contant_wrap { padding: 0 30px;
						.title { height: 75px; line-height: 75px; font-size: 20px; color: #666666;
							span { color: #e33a3d; font-size: 20px;}
							i { 
								em { color: #C61420;}
							}
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
					.noNum { padding: 0 38px;
						.icon_wrap { padding-top: 70px; text-align: center;
							span {
								i { font-size: 160px; color: #e33b3b;}
							}
						}
						.tishi { font-size: 16px; text-align: center; color: #000000;}
						.asked_btn_wrap { margin-top: 50px; overflow: hidden;
							a { display: block; cursor: pointer;}
							.go_my_answer { background: #e33b3b; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #FFFFFF;}
							.go_self { border: 1px solid #999999; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px; color: #666666;}
						}
					}
					.error {
						.icon_wrap { padding-top: 50px; padding-bottom: 20px;
							 i { font-size: 120px !important;}}
						.asked_btn_wrap { margin-top: 80px;}
					}


				}
			}













	.activenav { border-bottom-color: #de1b1f !important; color: #de1b1f !important;}
</style>
