<template>
	<div class="order_record_wrap">
		<div class="order_content">
			<div class="top">
				<p class="left">特训班订阅记录</p>
				<p class="right"><router-link :to="{name: ''}">进入特训班>></router-link></p>
			</div>
			<div class="content_wrap">
				<div class="action_wrap">
					<p><span>时间：</span> <el-date-picker v-model="startdate"  type="datetime"  placeholder="选择日期时间"> </el-date-picker><span>
							  至</span> <el-date-picker  v-model="enddate"  type="datetime"  placeholder="选择日期时间"> </el-date-picker><span>状态： </span>
							<select v-model="type"><option value="0">全部</option><option value="1">服务中</option><option value="2">已到期</option></select>
							<input type="button" @click="search" value="查询" />
					</p>
				</div>
				<div class="tab_wrap">
					<div class="tab_wrap_top">
						<div class="NO left">序号</div>
						<div class="time left">订阅时间</div>
						<div class="period left">订阅周期</div>
						<div class="time_limit  left" >服务期限</div>
						<div class="name left" >用户名</div>
						<div class="old_price left" >原价</div>
						<div class="order_price left" >订阅价</div>
						<div class="status left">状态</div>						
					</div>
					<div class="tab_content" v-if="dataList" v-for="(item, index) in dataList">
						<div class="NO left">1</div>
						<div class="time left">2017/03/31 09:20:20</div>
						<div class="period left">30交易日</div>
						<div class="time_limit  left" >2017/07/31 00:00至2017/07/31 00:00</div>
						<div class="name left" >光头涨</div>
						<div class="old_price left" >1000</div>
						<div class="order_price left" >100</div>
						<div class="status left" :class=" item.Status ? 'ordering' : 'endserver' ">{{item.Status ? '服务中' : '已到期'}}</div>					
					</div>
				</div>
				<div class="page" v-if="allTotal">
					<el-pagination
				      @current-change="handleCurrentChange"
				      :page-size="10"
				      layout="prev, pager, next, jumper"
				      :total="allTotal">
				    </el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Api from '@/utils/Api'
export default {
	name: 'orderrecord',
	data(){
		return {
			dataList:[],
			startdate:'',
			enddate:'',
			type:0,
			allTotal:200,
			page: 1,
		}
	},
	created(){
		this.api = new Api()
		this.initOrderList()
	},
	methods:{
		initOrderList(){
			let params = {}
			params.token = this.authToken
			params.id = this.$route.params.id
			params.type = this.type
			params.page = this.page
			params.num = 10
			params.start_date =  this.startdate || undefined
			params.end_date = this.enddate || undefined
			this.api.get('/TrainingRoom/Order', params).then(resp => {
				this.dataList = resp.List
				this.allTotal = resp.TotalCount
			})
		},
		search(){
			this.initOrderList()
		},
		handleCurrentChange(val){
			this.page = val
			this.initOrderList()
		}
	},
	computed:{
		...mapGetters(['authToken'])
	}
}
	
</script>

<style lang="less" scoped>
	.order_record_wrap { height: 934px; width: 100%; background: url(../../assets/viproom_content_bj.jpg);  padding-top: 30px;
		.order_content { width: 1175px; height: 854px; margin: auto;
			.top { background: #e0b664; width: 1175px; height: 60px; line-height: 60px; padding: 0 50px;
				p:nth-child(1) { font-size: 16px; font-weight: 600; color: #845a42;}
				p:nth-child(2) {
						a { font-size: 15px; color: #845a42; }
				}
			}
			.content_wrap { height: 794px; background: #ffffff; padding: 0 50px; position: relative;
				.action_wrap { height: 105px;   padding-top: 44px;
					* { display: inline-block; }
					span { font-size: 14px; font-weight: 600;}
					input { height: 30px; width: 200px;}
					select { height: 30px; width: 123px;}
					span:nth-child(3){ margin:0 10px;}
					span:nth-child(5){ margin-left: 16px;}
					input:nth-last-child(1) { width: 100px; background: #e43a3d; border: none; color: #ffffff; font-size: 14px; margin-left: 32px;}
				
				}
				.tab_wrap { border-left: 1px solid #e3e3e3; border-top: 1px solid #e3e3e3;  
					.tab_wrap_top { overflow: hidden; background:#f2f0f1;
						>div { height: 49px ; line-height: 49px; text-align: center; font-size: 14px; font-weight: 600; color: #666666; border-right: 1px solid #E3E3E3; border-bottom: 1px solid #E3E3E3;}
						.NO { width: 65px;}
						.time { width: 172px;}
						.period { width: 97px;}
						.time_limit { width: 289px;}
						.name { width: 151px;}
						.old_price { width: 95px;}
						.order_price { width: 102px;}
						.status { width: 103px;}
					}
					
					.tab_content { overflow: hidden;
						>div { height: 49px ; line-height: 49px; text-align: center; font-size: 14px; color: #666666; border-right: 1px solid #E3E3E3; border-bottom: 1px solid #E3E3E3;}
						.NO { width: 65px;}
						.time { width: 172px;}
						.period { width: 97px;}
						.time_limit { width: 289px;}
						.name { width: 151px;}
						.old_price { width: 95px;}
						.order_price { width: 102px;}
						.status { width: 103px;}
						.ordering { color: #C61420;}
						.endserver { }
					}
				}
				.page { position: absolute; bottom: 65px; width: 100%; text-align: center;
				 }
			
			}
		}
	
	}


</style>