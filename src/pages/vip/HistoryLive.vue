<!--历史直播页面-->
<template>
	<div id="vip_history_live" class="vip_detail_live">
		<div class="detail_info">
			<detail-top-info></detail-top-info>
			<room-live-nav  @child="listen"></room-live-nav>
		</div>
		<!--vip直播中间的左侧直播和右侧混动部分-->
		<div class="content_wrap">
			<div class="content_left left">
				<p class="title">老师观点</p>
				<div class="live_wrap">
					<!--live消息-->
					<vip-live-item v-for="(item, index) in leftData" :key="index"></vip-live-item>
				</div>
			</div>
			<!--右侧-->
			<div class="content_right right">
				<!--历史直播页面的日历-->
				<div class="calendar_wrap" v-show="showFlag">
					<calendar></calendar>
				</div>
				
				<p class="title">同学互动</p>
				<div class="chat_wrap">
					<!--chart消息-->
					<vip-chart-item v-for="(item, index) in rightData" :key="index"></vip-chart-item>
				</div>
			</div>
		</div>
		<div class="tishi_wrap">
			<p class="tishi">您当前查看的是2017年7月3日的特训信息，<router-link :to="{}">查看最新信息 >></router-link></p>
		</div>
		
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
	
	
import VipLiveItem from '@/components/vip/VipLiveItem'        	//左侧消息组件
import VipChartItem from '@/components/vip/VipChartItem'        //右侧chart组件
import 	Calendar from '@//components/vip/VipCalendar'           //引入日历组件
	
	
export default {
	name: 'viphistoryllive',
	data() {
		return {
			leftData: ['','', '', '', '', '', '', ''],   //左侧消息
			rightData: ['', '', '', '','',''],           //右侧chart信息
			showFlag: false,                             //设置日历是否显示
		}
	},
	created(){
		
		
	},
	mounted(){
		
	},
	methods: {
		listen(data){
			console.log(data)
			this.showFlag = data
		}
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
	}
}
</script>

<style lang="less">
	#vip_history_live { overflow: hidden; padding-bottom: 38px; background: url(../../assets/viproom_content_bj.jpg); padding-top: 15px;
		.detail_info { width: 1175px; margin: 0 auto; }
		.content_wrap { width: 1175px; margin: 0 auto; overflow: hidden; position: relative;
			.content_left { width: 760px; background: #ffffff; height: 976px;
				.title { height: 38px; line-height: 38px; font-size: 16px; color: #666666; padding-left: 26px;}
				.live_wrap { height: 938px; padding-left: 30px; padding-right: 26px; padding-bottom: 30px; overflow-y: auto;}
				.user_live_wrap { height: 938px;}
			}
			.content_right { width: 414px; background: #FFFFFF; height: 976px;
				.title { height: 38px; line-height: 38px; font-size: 16px; color: #666666; padding-left: 26px;}
				.teacher_chart { padding-left: 25px; padding-right: 20px; height: 631px;}
				.user_chart { height: 765px; }
				.chat_wrap { padding-left: 25px; padding-right: 20px; height: 938px; overflow-y: auto; padding-bottom: 20px;}
			
			
				.calendar_wrap { position: absolute; background: rgba(38, 2, 45, 0.8);  width: 414px; height: 290px; }
			}
		}

		.tishi_wrap { width: 1175px; height: 50px; background: #71565f; margin: 0 auto; margin-top: 11px;
			.tishi { height: 50px; line-height: 50px; text-align: center; color: #FFFFFF; font-size: 16px;
				a { font-size: 16px; color: #fecb02;}
			} 
		}
		
		
		
	}


</style>