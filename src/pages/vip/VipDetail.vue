<!--vip详情页-->
<template>
	<div class="detail_wrap">
		<div class="detail_info" v-if="hasTXB">
			<detail-top-info v-if="resData" :topData="resData"></detail-top-info>
			<detail-top-nav></detail-top-nav>
		</div>
		<div class="detail_class_wrap" v-if="hasTXB">
			<detail-class></detail-class>
		</div>
		
		<!--跳转特训班详情无特训班-->
		<el-dialog
		  class="vip_open_detail"
		  :close-on-click-modal="false"
		  :visible.sync="dialogVisible">
			<div class="content">
				<div class="icon_wrap"><span><i class="icon iconfont icon-jinggao"></i></span><span>您还没有特训班</span></div>
				<div class="info">
					新版特选班创建后可长期存在，不需要再每月创建。老师可自由控制是否开放订阅，在开放订阅期间，用户可随到随订任意一种服务期限，
					到期自动移除。若老师点击暂停订阅，则在暂停期间，用户无法订阅。
				</div>
				<div class="action_wrap">
					<a href="">查看老版历史特训班</a><router-link target="_blank" :to="{ name: 'vipmain', params:{id: 'my'}}">立即创建</router-link>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DetailTopInfo from '@/components/vip/DetailTopInfo'
import DetailTopNav from '@/components/room/UserNav'
import DetailClass from '@/components/vip/DetailClass'
import DetailRoomLive from '@/components/vip/DetailRoomLive'

import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
	name: 'vipdetail',
	data() {
		return {
			hasTXB: true,
			dialogVisible: false,
			resData:'',   //请求回来的特训班详情数据
		}
	},
	created() {
		this.api = new Api()
		this.initDetail()

	},
	methods: {
		initDetail(){
			let params = {}
			params.token = this.authToken
			params.teacher_id = this.$route.params.id
			
			this.api.get('/TrainingRoom/Info', params).then(resp => {
				this.hasTXB = resp.Id
				this.dialogVisible = !this.hasTXB
				this.resData = resp
			})
		}
	},
	components:{
		DetailTopInfo,
		DetailTopNav,
		DetailClass,
		DetailRoomLive
	},
	computed:{
		...mapGetters(['authToken'])
	}
}
</script>

<style lang="less" scoped>
	.detail_wrap { height: 1052px; background: url(../../assets/viproom_content_bj.jpg); padding-top: 15px;
		.detail_info { width: 1175px; margin: 0 auto; }
		.detail_class_wrap { width: 1175px; margin: 0 auto; margin-top: 16px;}
	
		.vip_open_detail {
			.content { padding: 0 45px;
				.icon_wrap {text-align: center; padding-top: 50px;
					span:nth-child(1) {i { font-size: 30px; color: #fd9a00 ;} }
					span:nth-child(2) { font-size: 30px; margin-left: 6px; color: #666666;}
				}
				.info { padding-top: 40px; line-height: 30px; color: #666666; font-size: 14px;} 
				.action_wrap { padding-top: 88px;
					a { display: inline-block; width: 250px; height: 50px; text-align: center; line-height: 50px; font-size: 16px;}
					a:nth-child(1) { border: 1px solid #999999; color: #666666;}
					a:nth-child(2) { background: #e43a3d; margin-left: 20px; color: #FFFFFF;}	
				}
			}
		}
	
	}
</style>