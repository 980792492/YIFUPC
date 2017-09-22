<template>
	<div class="vip_main">
		<div class="img_wrap">
			<img src="../../assets/viproom_bj.jpg" alt="" />
		</div>
		<div class="content_wrap">
			<div class="content">
				<div class="content_top">
					<div class="top_title left">
						<p @click="checktitle('all')" class="left" :class="{active_p: toptitle == 'all' }">全部特训班</p>
						<p @click="checktitle('my')" class="left" :class="{active_p: toptitle == 'my' }">我的特训班</p>
					</div>
					<a class="right" target="_blank" href="http://www.yifucj.com/Help1/Index/47">什么是特训班?</a>
				</div>
				<div class="content_contain">
					<!--点击我的特选班，不存在我的特选班-->
					<div v-if="isTeacher && toptitle =='my' && allTotal == 0">
						<teacher-create-myvip></teacher-create-myvip>
					</div>
					<!--全部特训班和我的特训班存在-->
					<vip-index-item v-else  :status="data"></vip-index-item>
					
					<div class="page">
						  <el-pagination
						      @size-change="handleSizeChange"
						      @current-change="handleCurrentChange"
						      :current-page="page"
						      :page-sizes="[5, 10, 15, 20]"
						      :page-size="num"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="allTotal">
						    </el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'	
import VipIndexItem from '@/components/vip/VipIndexItem'
import TeacherCreateMyvip from '@/components/vip/Tcreate'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'	

export default {
	name: 'vipmain',
	data(){
		return {
			toptitle: 'all',   /*toptitle用于标识全部特训班或者我的特训班*/
			data:[],
			page: 1,
			num:10,
			allTotal: 0,
			isTeacher: false,   //设置是否是老师
			
			
		}
	},
	created(){
		this.api = new Api()
		
		if(this.$route.params.id == 'all'){
			this.toptitle = 'all'
			this.initAllList()
		}
		if(this.$route.params.id == 'my'){
			this.toptitle = 'my'
			this.initMyList()
		}


	},
	methods:{
//		全部特训班加载
		initAllList(){
			let params = {}
			params.token = this.authToken
			params.page = this.page
			params.num = this.num
			this.api.get('/TrainingRoom/List', params).then(resp => {
				this.data = resp.List
				this.allTotal = resp.TotalCount
			})
		},
//		我的特选班加载
		initMyList(){
			let params = {}
			params.token = this.authToken
			params.page = this.page
			params.num = this.num
			this.api.get('/TrainingRoom/MYList', params).then(resp => {
				this.isTeacher = resp.IsTeacher
				this.data = resp.List
				this.allTotal = resp.TotalCount
			})
		},
		checktitle(str){
			this.toptitle = str
			this.$router.push({name:'vipmain', params:{id:str}})
			this.num = 10
			this.page = 1
		},
		handleSizeChange(val) {
        	this.num =val
        	if(this.toptitle == 0){
				this.initAllList()
        	}else{
				this.initMyList()
        	}
      	},
      	handleCurrentChange(val) {
        	this.page = val
        	if(this.toptitle == 0){
				this.initAllList()
        	}else{
				this.initMyList()
        	}
      	}
	},
	watch:{
		toptitle(val,old){
			if(val == 'all' ) {
				this.initAllList()
			}else {
				this.initMyList()
			}
		}
	},
	components:{
		VipIndexItem,
		TeacherCreateMyvip
	},
	computed:{
		...mapGetters(['authToken'])
	}
}
</script>

<style lang="less" scoped="scoped">
.vip_main {
	.img_wrap { height: 299px; width: 100%; text-align: center; font-size: 0; background: #381a58;
		img { width: 1175px; height: 299px; }
	}
	.content_wrap { padding-top: 14px; padding-bottom: 40px; background: url(../../assets/viproom_content_bj.jpg) ;
		.content { width: 1175px; margin: 0 auto; 
			.content_top { height: 60px; background: #dcb260; 
				.top_title { width: 544px; height: 60px;
					p { width: 180px; height: 60px; text-align: center; line-height:60px; color: #85593e; cursor: pointer;  border-bottom: 2px solid #dcb260; font-size: 14px;}
					.active_p {border-color: #de1b1f; color: #c71724; font-weight: 600;}
				}
				a { line-height: 60px; font-size: 14px; color: #855841; padding-right: 50px;}
			}
			.content_contain {  background: #FFFFFF; padding: 0 50px; padding-top: 12px;
				
			
				.page { text-align: center; padding-top: 25px; padding-bottom: 44px;}
			}
			
			
		}
	}
	
}


</style>