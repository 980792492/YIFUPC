<template>
	<div class="allteacher_wrap">
		<div class="title_wrap">
			<p class="title left">请选择要提问的老师</p>
			<div class="title_change right">
				<p class="change_wrap left">
					<span class="left" @click="showChange(0)" :class="{activespan: staticChange == 0 }">按回答数量排序</span><span  class="left" @click="showChange(1)"  :class="{activespan: staticChange == 1 }">按价格排序</span>
				</p>
				<p class="search_wrap left" >
					<input type="text" placeholder="请输入您要查找老师的名字" v-model="TeacherName" /><button @click="search">搜索</button>
				</p>
			</div> 
		</div>
		<div class="item_wrap">
			<div class="item left" v-for="(item, index) in  teacherList " :key="index">
				<div class="img_wrap left">
					<router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId }}"><img :src="item.HeadImg" alt="" /></router-link>
				</div>
				<div class="text_wrap left">
					<p><router-link target="_blank" :to="{name: 'livequestion', params:{id: item.RoomId}}">{{item.TeacherName}}</router-link></p>
					<p><span>{{item.Price}}</span>G币/次</p>
				</div>
				<div class="action_wrap right">
					<p>已回答{{item.AnswerCount}}</p>
					<span @click="ask(item, index)">提问</span>
				</div>
			</div>
			<!--弹窗-->
			<el-dialog class="question_open_wrap"
			  :visible.sync="dialogVisible"
			  :close-on-click-modal='false'
			 >
			 <div class="contant_wrap" v-if="authUser && isask">
			 	<!--付费问-->
			 	<div class="" v-if="teacherItem.Price > 0">
			 		<p class="title">向<span>{{teacherItem.TeacherName}}</span>提问 :</p>
				 	<div class="input_wrap">
				 		<textarea name="" rows="" cols="" maxlength="200" v-model="opencontent" ></textarea>
				 		<p>还剩<span>{{200-opencontent.length}}</span>字</p>
				 	</div>
				 	<p>若老师在次日24点前未回答，G币将退回</p>
				 	<div class="idea_wrap" >
				 		<p class="left paynum">本次提问需花费<span>{{ teacherItem.Price }}</span>G币</p>
				 		<p class="right ownernum">您的G币数： {{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank">充值 >></a></p>
				 	</div>
				 	<div v-if="teacherItem.Price > 0 && authUser.CurrentGcoinsCount - teacherItem.Price < 0" class="warning">
				 		<p><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足，请充值！</p>
				 	</div>
				 	<div class="btn_wrap" :class="{warning_btn_wrap: teacherItem.Price > 0 && authUser.CurrentGcoinsCount - teacherItem.Price < 0 }">
				 		<button @click="submit">提交问题</button>
				 	</div>
			 	</div>
			 	<!--免费问   有剩余条数-->
			 	<div v-if=" !(teacherItem.Price > 0) &&  teacherItem.RemainingCount> 0 " >
			 		<p class="free_title">向<span>{{teacherItem.TeacherName}}</span>提问 :</p>
			 		<p class="free_num">您今日还剩<span>{{teacherItem.RemainingCount}}</span>次免费提问</p>
				 	<div class="input_wrap">
				 		<textarea name="" rows="" cols="" maxlength="200" v-model="opencontent" ></textarea>
				 		<p>还剩<span>{{200-opencontent.length}}</span>字</p>
				 	</div>
					<p class="tishi">若老师在次日24点前未回答，提问将过期</p>
				 	<div class="idea_wrap" >
				 		<p class="left paynum">本次提问需花费<span>{{teacherItem.Price}}</span>G币</p>
				 		<p class="right ownernum">您的G币数： {{authUser.CurrentGcoinsCount}} <a target="_blank" href="//pay.yifucj.com">充值 >></a></p>
				 	</div>
				 	<div v-if="teacherItem.Price > 0 && authUser.CurrentGcoinsCount - teacherItem.Price < 0" class="warning">
				 		<p><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足，请充值！</p>
				 	</div>
				 	<div class="btn_wrap" :class="{warning_btn_wrap:teacherItem.Price > 0 && authUser.CurrentGcoinsCount - teacherItem.Price < 0 }">
				 		<button @click="submit">提交问题</button>
				 	</div>
			 	</div>
			 	<!--免费问，无剩余条数-->
			 	<div v-if=" !(teacherItem.Price > 0) &&  !teacherItem.RemainingCount > 0 " >
			 		<!--免费机会用完显示-->
						<div class="asked_success  error">
							<div class="icon_wrap">
								<span><i class="icon iconfont icon-chahaozhuanhuan"></i></span>
							</div>
							<p class="tishi">您今日的免费问次数已用完，您还可以选择质量更高的付费问~</p>
							<div class="asked_btn_wrap">
								<router-link class="go_my_answer left" target="_blank"  :to="{name: 'allteacher', params: {id: 'pay'}}">去付费问答</router-link>
								<a  @click="dialogVisible = false" class="go_self right" href="javasript:void(0)">关闭继续浏览</a>
							</div>
						</div>
			 	</div>
			 	
			 	
			 </div>
			 
			<div v-if="!isask" class="asked_success">
				<div class="icon_wrap">
					<span><i class="icon iconfont icon-duihao"></i></span>
				</div>
				<p class="tishi">您的提问已推送给老师，请耐心等待~~</p>
				<div class="asked_btn_wrap">
					<a class="go_my_answer left" @click="gomyquestion" >查看我的提问</a>
					<a  @click="openclose" class="go_self right">关闭继续浏览</a>
				</div>
			</div>
					
			
			 
			</el-dialog>
		</div>
		<div class="page_wrap">
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
</template>

<script>
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import { mapGetters, mapActions } from 'vuex'	
	
export default {
	name: 'allteacher',
	data(){
		return {
			staticChange:0,
			
			teacherList: [],
			TeacherName: '',    //用于模糊查询
//			设置显示第几页
			page: 1,
//			设置每页显示数目
			num: 40,
			allTotal : 100,
			dialogVisible: false,
			isask: true,
			
			
//			用于存放提问的老师信息
			teacherItem: {},
			opencontent: ''
		}
	},
	created(){
		if(this.$route.query.orderBy){       
			console.log(this.$route.query.orderBy)
			this.staticChange = 1
		}
		this.api = new Api()
		this.loadTeacherList()
//		this.initMyfreeNum()

	},
	methods:{
		loadTeacherList(){
			let params = {}
			if(this.TeacherName){
				params.teacher_name = this.TeacherName
			}
			params.order = this.staticChange
			params.page = this.page
			params.num = this.num
			this.api.get('/Ask/TeacherList', params).then(resp => {
				this.allTotal = resp.TotalCount
				this.teacherList = resp.List
			})
		},
		showChange(str){
			this.staticChange = str
			if(str == 0){
				this.$router.push({name:'allteacher'})	
			}
			if(str == 1){
				this.$router.push({name:'allteacher',query:{orderBy: 'gold'}})	
			}
			this.loadTeacherList()
		},
		search(){
			this.loadTeacherList()
		},
		handleSizeChange(val) {
          this.num = val
		  this.loadTeacherList()
      	},
      	handleCurrentChange(val) {
          this.page = val
		  this.loadTeacherList()
      	},
      	ask(item,str){
      	//		判断是否登陆
			if(!this.authUser) {
				Auth.openLoginDialog()
				return false
			}
			this.api.get('/Ask/Price', {teacher_id: item.TeacherId, token: this.authToken}).then(resp => {
      			this.teacherItem = resp
			})
      		this.dialogVisible = true
      		
      	},
      	submit(){
      		if( !(this.teacherItem.Price - this.authUser.CurrentGcoinsCount > 0) || this.$route.params.id =='free'){
      			let　params = {}
      			params.token = this.authToken
      			params.teacher_id = this.teacherItem.TeacherId
      			params.content = this.opencontent
      			
      			if(this.$route.params.id =='free'){
      				params.type = 0
      			}
      			if(this.$route.params.id =='pay'){
      				params.type = 1
      			}
      			this.api.post('/Ask/SendQuestion', params).then(resp => {
      				this.isask = false
      				this.opencontent = ''
//    				this.initMyfreeNum()
      			})
      		}
      	},
      	openclose(){
      		this.dialogVisible = false
      		this.isask = true
      	},
      	gomyquestion(){
			this.TabviewCotrol({flag: '4', viewTab: 'QuestionMy'})
			this.$router.push({name:'questionmain',params: {id: 'my'}})
      	},
		...mapActions(['getUserChangeData', 'initquestion', 'TabviewCotrol'])

	},
	computed:{
		...mapGetters(['authUser', 'authToken',  'myquestionNum', 'myquestionFreenum'])
	}
}
</script>

<style scoped lang="less">
	.allteacher_wrap { padding: 60px 0; width: 1175px; margin: 0 auto;
	
		.title_wrap {  overflow: hidden; height: 89px;
			.title { font-size: 30px; color: #999999;}
			.title_change { padding-top: 2px;
				.change_wrap { margin-right: 20px;}
				span { display: inline-block; padding: 2px 4px; border: 1px solid #cccccc; cursor: pointer; }
				span:nth-child(1) { border-right-color:#ee8687; padding: 9px 15px;}
				span:nth-child(2) { border-left: none; padding: 9px 15px;}
				.activespan { border-color: #ee8687; color: #CC0000;}
				.search_wrap { height: 36px; 
					input { height: 36px; width: 200px; vertical-align: middle; border: 1px solid #CCCCCC; padding-left: 10px; outline: none;}
					button {height: 36px; width: 80px; border: none; background: #CC0000; outline: none; font-size: 14px; cursor: pointer; color: #FFFFFF; vertical-align: middle;}
				}
				
			}
		}
		
		.item_wrap { overflow: hidden;
			.item { width: 231px; height: 55px; margin-right: 83px; margin-bottom: 54px;
				.img_wrap { width: 56px; 
					img { width: 50px; height: 50px; border-radius: 50%;}
				}
				.text_wrap {
					p:nth-child(1) { height: 26px; line-height: 26px; font-size: 14px;
						a { font-size: 14px; color: #666666;
						&:hover { color: #C61420;}
						}
					}
					p:nth-child(2) { color: #666666; font-size: 14px;
						span { color: #e43a3d; font-size: 16px; margin-right: 3px;}
					}
					
						
				}
				.action_wrap {  text-align: right;
					p { font-size: 14px; line-height: 26px; margin-bottom: 4px; color: #999999;}
					span { border: 1px solid #e33b3b; color: #e6393b; padding: 4px 15px; border-radius: 5px; cursor: pointer;}
				}
			
			
			}
			.item:nth-child(4n) { margin-right: 0;}
			
			.question_open_wrap {
				.el-dialog { width: 650px; height: 445px;
					.contant_wrap {padding: 0 30px;
						.title { height: 75px; line-height: 75px; font-size: 20px; color: #666666;
							span { color: #e33a3d; font-size: 20px;}
						}
						.free_title {height: 60px; line-height: 60px; font-size: 20px; color: #666666;
							span { color: #e33a3d; font-size: 20px;}
						}
						.free_num { height: 30px; text-align: right; font-size: 14px; color: #999999;
							span { color: #e33a3d; font-size: 14px;}
						}
						.input_wrap { width: 550px; height: 120px; border: 1px solid #DDDDDD;
							textarea { width: 100%; height: 90px; border: none; resize: none; outline: none; }
							p { text-align: right; padding-right: 10px; padding-bottom: 10px;
								span { color: #55a9ff;}
							}
						} 
						.idea_wrap { padding-top: 30px; overflow:hidden;
							.paynum {  color: #343434; 
								span { color: #e33a3d;}
							}
							.ownernum { width:160px; text-align: right;
								a { color: #fe0000;}
							}
						}
						
						.warning { margin-top: 10px; height: 30px; line-height: 30px; background: #fbfba5; 
							p { font-size: 14px; color: #E03A3C;
								span { margin: 0 10px;}
								span i { font-size: 16px; }
							}
						 }
						
						.btn_wrap { margin-top: 51px; text-align: center;
							button { outline: none; width: 300px; height: 50px; background: #e43a3d; border: none; font-size: 16px; color: #FFFFFF; cursor: pointer;}
						}
						
						.warning_btn_wrap {margin-top: 30px;
							button { background: #CCCCCC;}
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
				.error { padding: 0;
					.icon_wrap { padding-top: 50px; padding-bottom: 20px;
						 i { font-size: 120px !important;}}
					.asked_btn_wrap { margin-top: 80px;}
				}
					
				
				}
			}
			
			
		}
		
		.page_wrap { text-align: center;}
		
		
	}

</style>