<!--vip直播详情页-->
<template>
	<div id="vip_detail_live" class="vip_detail_live">
		<div class="detail_info">
			<detail-top-info v-if="resData"  :topData="resData"></detail-top-info>   <!--直播页的头部信息-->
			<room-live-nav v-if="resData" :topData="resData" @child="listen" ></room-live-nav>      <!--直播页面的导航-->
		</div>
		<!--vip直播中间的左侧直播和右侧混动部分--> 
		<div class="content_wrap">
			<div class="content_left left" :class="{vipliveleft: isClose}">
				<p class="title">老师观点</p>
				<div class="live_wrap" :class="{user_live_wrap: !isTeacher}  ">
					<!--live消息-->
					<vip-live-item v-for="(item, index) in leftData" :key="index" :itemData="item"></vip-live-item>
				</div>
				<div class="action_wrap" v-if="isTeacher">
					<div class="left" @click="check('view')"  :class="{actived : currentIndex == 'view' }" >发表观点</div>
					<div class="left" ><router-link :to="{name : 'changesetview'}" target="_blank">修改特训班设置</router-link></div>
					<div class="left" @click="check('normal')" :class="{actived : currentIndex == 'normal' }" >常用观点设置</div>
					<div class="left" @click="check('ban')" :class="{actived : currentIndex == 'ban' }" >禁言用户管理</div>
					<div class="left" @click="actionClose">{{isClose ? '开启右侧互动' : '关闭右侧互动' }}</div>
					<div v-if="isClose" class="action_sound sound_icon left">
						<span @click="sound"  class="right"><i class="icon iconfont" :class="soundshow ? 'icon-shengyin-copy' : 'icon-jingyin' "></i></span>
					</div>
				</div>
				<div class="teacher_set" v-if="isTeacher">
					<component :is="currentView">
  					</component>
				</div>
			</div>
			<!--右侧-->
			<div v-if="!isClose" class="content_right right">
				<div class="calendar_wrap" v-show="showFlag">
					<calendar></calendar>
				</div>
				<p class="title">同学互动</p>
				<div class="chat_wrap" :class="isTeacher ? 'teacher_chart' : 'user_chart' ">
					<!--chart消息-->
					<vip-chart-item  v-if="rightData.length > 0"  v-for="(item, index) in rightData" :key="index" :itemData="item"></vip-chart-item>
				</div>
				<div class="sound_icon_wrap">
					<div class="teacher_hudong left" v-if="isTeacher">互动</div>
					<div class="user_hudong left" @click="userCheck('1')" v-if="!isTeacher" :class="{actived: rightshow == '1'}">互动</div>
					<div class="user_toupiao left"  @click="userCheck('2')"  v-if="!isTeacher" :class="{actived: rightshow == '2'}" >投票</div>
					<a class="user_chongzhi left" target="_blank" href="//pay.yifucj.com" v-if="!isTeacher">充值</a>
					<div class="sound_icon right" @click="sound">
						<span><i class="icon iconfont" :class="soundshow ? 'icon-shengyin-copy' : 'icon-jingyin' "></i></span>
					</div>
				</div>
				<div class="hudong_wrap">
					<vip-room-review v-if="rightshow == '1' && resData ":status="resData"></vip-room-review>    <!--互动-->
					<vip-room-vote v-if="rightshow == '2' "  :status="resData" ></vip-room-vote>     <!--投票-->
				</div>
			</div>
			<div class="clearn"></div>
			<!--老师关闭互动时 的用户显示-->
			<div v-if=" !isTeacher && isClose" class="close_usershow">老师已关闭互动
				<span @click="sound"  class="right"><i class="icon iconfont" :class="soundshow ? 'icon-shengyin-copy' : 'icon-jingyin' "></i></span>
			</div>
		</div>
		
		<div class="tishi_wrap" v-if="!isNotHistory" >
			<p class="tishi">您当前查看的是{{historyShowDate}}的特训信息，<router-link :to="{}">查看最新信息 >></router-link></p>
		</div>
		
		
		<!--关闭或开启右侧互动弹窗-->
		<el-dialog
		  class="Pop_open_wrap"
		  :visible.sync="dialogVisible"
		  >
			<div class="pop_body">
				<div class="title">{{ isClose ? '您确定要开启右侧互动吗?' : '您确定要关闭右侧互动吗 ? '}}</div>
				<p class="text">{{ isClose ? '开启后,右侧互动区将显示，用户可右侧发言,开启后您可以随时关闭。' : '关闭后，右侧互动区将隐藏，所有用户将无法发言。关闭后您可以随时打开。'}}</p>
				<div class="btn_wrap"><button @click="ensureAction">{{isClose ? '确认开启' : '确认关闭'}}</button></div>
			</div>
		  </span>
		</el-dialog>
		
		
		
	</div>
</template>

<script>
import DetailTopInfo from '@/components/vip/DetailTopInfo'
import RoomLiveNav from '@/components/vip/RoomLiveNav'
import VipRoomReview from '@/components/vip/VipRoomReview'
import VipTeacherView from '@/components/vip/VipTeacherView'      //老师发表观点
import VipTeacherSet from '@/components/vip/VipTeacherSet'        //修改特训班设置
import VipTeacherNormal from '@/components/vip/VipTeacherNormal'        //常用观点设置
import VipTeacherNoSpeech from '@/components/vip/VipTeacherNoSpeech'        //禁言用户管理
import VipRoomVote from '@/components/vip/VipRoomVote'        //用户的投票操作组件
	
	
import VipLiveItem from '@/components/vip/VipLiveItem'        //左侧消息组件
import VipChartItem from '@/components/vip/VipChartItem'        //右侧chart组件
import 	Calendar from '@//components/vip/VipCalendar'           //引入日历组件

import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
	
	
export default {
	name: 'vipdetaillive',
	data() {
		return {
			resData: '',  //初始化页面的数据
			
			isHundong: true,
			soundshow: true,
			isClose: false,      //关闭互动标志
			dialogVisible: false,
			currentView: VipTeacherView,
			currentIndex : 'view',
			rightshow: '1',   //设置右侧操作选项
			leftData: [],   //左侧消息
			rightData: [],       //右侧chart信息
			showFlag: false,                   //设置日历是否显示
			
		}
	},
	created(){
		this.api = new Api()
		this.initData()
	},
	methods: {
		initData(){        //初始化vip直播室的头部信息
			let params = {}
			params.token = this.authToken
			params.id = this.$route.params.id

			this.api.get('/TrainingRoom/Room', params).then(resp => {
				this.initVipLiveData(resp)
				this.resData = resp
				this.isClose = !resp.EnableInteract
			})
			
		},
		actionClose(){      //关闭右侧互动按钮
			this.dialogVisible = true
		},
		ensureAction(){  //确认开启或关闭右侧操作
			let params = {}
			params.token = this.authToken
			params.id = this.$route.params.id
			params.type = 2
			params.open_close = Number(this.isClose)
			this.api.post('/TrainingRoom/Set', params).then(resp => {
				this.dialogVisible = false
				this.isClose = !this.isClose
			})
		},
//		更改声音问题
		sound(){
			this.soundshow = !this.soundshow
		},
//		老师切换左侧操作
		check(str) {
			this.currentIndex = str
			switch (str){
				case 'view':
					this.currentView  = VipTeacherView
					break;
					case 'set':
					this.currentView  = VipTeacherSet
					break;
					case 'normal':
					this.currentView  = VipTeacherNormal
					break;
					case 'ban':
					this.currentView = VipTeacherNoSpeech	
					break;
				default: 
					this.currentView  = VipTeacherView
					break;
			}
		},
//		用户切换右侧的互动,投票,充值
		userCheck(str){
			this.rightshow = str
			
		},
		listen(data){      //日历显示监测
			console.log(data)
			this.showFlag = data
		},
		liveMessage(val){       //查看直播室消息（老师观点在左边）
			let params = {}
			params.token = this.authToken
			params.id = this.$route.params.id
			params.start_date = new Date(val).getFullYear()+'-'+(new Date(val).getMonth()+1)+'-'+new Date(val).getDate() 
			params.end_date = new Date(val).getFullYear()+'-'+(new Date(val).getMonth()+1)+'-'+new Date(val).getDate() 
			console.log(params)
			this.api.get('/TrainingRoom/Message', params).then(resp => {
				this.leftData =  resp.filter((x) => {    // 获取左侧消息
					return  x.Type == 1 
				})
				
				this.rightData = resp.filter((x) => {    // 获取右侧的消息
					return  x.Type != 1 
				})
				
				
			})
		},
//		liveRightMessage(val){    //加载直播室的其他的相关的信息（//vip直播室其他的观点在右边）
//			let params = {}
//			params.type = 2      
//			params.token = this.authToken
//			params.id = this.$route.params.id
//			params.start_date = new Date(val).getFullYear()+'-'+(new Date(val).getMonth()+1)+'-'+new Date(val).getDate() 
//			params.end_date = new Date(val).getFullYear()+'-'+(new Date(val).getMonth()+1)+'-'+new Date(val).getDate() 
//			console.log(params)
//			this.api.get('/TrainingRoom/Message', params).then(resp => {
//				this.rightData = resp
//			})
//		},
		...mapActions(['initVipLiveData', 'initLiveMessage'])
	},
	components: {
		DetailTopInfo,
		RoomLiveNav,
		VipRoomReview,
		VipTeacherView,
		VipTeacherSet,
		VipTeacherNormal,
		VipTeacherNoSpeech,
		VipRoomVote,
		VipLiveItem,
		VipChartItem,
		Calendar           //日历组件
	},
	computed:{
		...mapGetters(['authUser', 'authToken', 'vipRiliDate']),
		isTeacher(){
			return this.resData.TeacherId  == this.authUser.Id
		},
		isNotHistory(){
			return  new Date(this.vipRiliDate).getDate()  > new Date().getDate() || new Date(this.vipRiliDate).getDate() == new Date().getDate()
		},
		historyShowDate(){
			return   this.vipRiliDate ?  new Date(this.vipRiliDate).getFullYear()+'年'+ (new Date(this.vipRiliDate).getMonth()+1)+'月'+new Date(this.vipRiliDate).getDate()+'日' : ''
		}
	},
	watch:{
		vipRiliDate(val, oldval){
//			alert(new Date(val))
			this.liveMessage(val)
		}
	}
}
</script>

<style lang="less">
	#vip_detail_live {  background: url(../../assets/viproom_content_bj.jpg); padding-top: 15px; padding-bottom: 38px;
		.detail_info { width: 1175px; margin: 0 auto; }
		.content_wrap { width: 1175px; margin: 0 auto; 
			.vipliveleft { width: 100% !important;}      /*左侧直播展开样式*/
			.close_usershow { height: 50px; background: #dcb57c; text-align: center; color: #9e7353; font-size: 14px; line-height: 50px;    /*关闭互动时的用户下方显示*/
				span { padding-right: 16px; cursor: pointer; i { font-size: 20px; font-weight: 600; color: #e34441;}}
			}  
			 
			.content_left { width: 760px; background: #ffffff; min-height: 976px;
				.title { height: 38px; line-height: 38px; font-size: 16px; color: #666666; padding-left: 26px;}
				.live_wrap { height: 631px; padding-left: 30px; padding-right: 26px; padding-bottom: 30px; overflow-y: auto;}
				.user_live_wrap { height: 938px;}
				
				.action_wrap { height: 40px;
					> div { height: 40px; width: 152px; cursor: pointer; background: #dcb57c; font-size: 14px; color: #855843; border-right: 1px solid #e7cba4; line-height: 40px; text-align: center;  border-bottom: 2px solid #dcb57c ;}
					> div:nth-child(2) { a { font-size: 14px; color: #855843;}}
					> div:nth-child(5) { border-right: none;}
					.action_sound {width: 415px; padding-right: 6px;
						span { padding: 0 10px;};
						i { font-size: 20px; font-weight: 600; color: #e34441; }
					}
					.actived { border-bottom-color: #e43a3d; color: #e43a3d;}
				}
				
				.teacher_set { height: 266px;}
			
			}
			.content_right { width: 414px; background: #FFFFFF; min-height: 976px;
				.calendar_wrap { position: absolute; background: rgba(38, 2, 45, 0.8);  width: 414px; height: 290px; }   /*日历wrap的样式*/
			
				.title { height: 38px; line-height: 38px; font-size: 16px; color: #666666; padding-left: 26px;}
				.teacher_chart { padding-left: 25px; padding-right: 20px; height: 631px;}
				.user_chart { height: 765px; }
				.chat_wrap { padding-left: 25px; padding-right: 20px; overflow-y: auto; padding-bottom: 20px;}
				
				.sound_icon_wrap { height: 40px; line-height: 40px; background: #dcb57c;
					.teacher_hudong { width: 137px; height: 40px; font-size: 14px; text-align: center; color: #e6393d; border-bottom: 2px solid #e6393d;}
					.user_hudong { cursor: pointer; width: 120px; height: 40px; font-size: 14px; text-align: center; color: #855940; border-bottom: 2px solid #dcb57c; border-right: 1px solid #e5c384;}
					.user_toupiao { cursor: pointer; width: 120px; height: 40px; font-size: 14px; text-align: center; color: #855940; border-bottom: 2px solid #dcb57c;  border-right: 1px solid #e5c384; }
					.user_chongzhi { cursor: pointer; width: 120px; height: 40px; font-size: 14px; text-align: center; color: #855940; border-bottom: 2px solid #dcb57c;  border-right: 1px solid #e5c384; }
					.actived { border-bottom-color: #e43a3d; color: #e43a3d;}
					.sound_icon {  padding-right: 16px; cursor: pointer; i { font-size: 20px; font-weight: 600; color: #e34441;}}
				}
				
				.hudong_wrap { position: relative;}
				
			}
			
		
		}
		
		.tishi_wrap { width: 1175px; height: 50px; background: #71565f; margin: 0 auto; margin-top: 11px; 
			.tishi { height: 50px; line-height: 50px; text-align: center; color: #FFFFFF; font-size: 16px;
				a { font-size: 16px; color: #fecb02;}
			} 
		}
		
		.Pop_open_wrap { 
			.el-dialog { width: 650px; height: 350px;
				.pop_body { padding-top: 50px;
					.title { font-size: 20px; color: #666666; text-align: center; margin-bottom: 35px;}
					.text { font-size: 16px; color: #333333; text-align: center; margin-bottom: 78px;}
					.btn_wrap {text-align: center;
						button { width: 300px; height: 50px; border: none; font-size: 16px; color: #FFFFFF; outline: none; cursor: pointer; background: #e43a3d;}
					}
				}
			
			}
		}
		
		
		
	}


</style>