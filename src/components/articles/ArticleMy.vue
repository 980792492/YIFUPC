<template>
	<div class="articleall">
		<div v-if="authUser" class="my_article_wrap">
			<a @click="tab()" :class="{actioncolor:statictab == 1 }" class="my_article" >{{authUser.UserIdentity == 2 ? '我的文章' : '我订阅的'}}</a><a @click="tab('我关注的')" :class="{actioncolor:statictab == 2 }" class="my_guanzhu">我关注的</a>
			<a v-if="authUser.UserIdentity == 2" class="allpayarticle  right">点击标题可查看详细及追加，可在<a class="link" target="_blank" :href="`http://home.yifucj.com/${authUser.Id}/Cjg/NewIndex`">个人中心</a>查看订阅情况</a>
		</div>
		<!--<div>暂无数据</div>-->

		<article-item v-if="data.length > 0"  :mytype="statictab"  :status="data"  :isTeacher="authUser.UserIdentity" @child="listen" @fromchild="toup"  ></article-item>

		<!--分页-->
		<el-pagination class="changepage"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="page"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="num"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="totalCount">
		</el-pagination>
	</div>
</template>

<script>
import ArticleItem from '@/components/articles/ArticleItem'
import { mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
export default {
	name:'articlemy',
	data(){
		return{
			statictab:1,
//			设置初始化页码和条数
			page:1,
			num:10,
			totalCount:null,
//			默认全部文章数据
			data:[],
//			老师的我的文章table数据类型
			type:0
		}
	},
	created(){

		this.api = new Api()
//		判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
		this.initMyData()
		
	},
	methods:{
		initMyData(){
			if(this.authUser.UserIdentity == 2 && this.statictab == 1) {
				this.loadMyArticle()
			}else if (this.authUser.UserIdentity != 2 && this.statictab == 1) {
				this.loadPayArticle()
			}else if (this.authUser.UserIdentity != 2  && this.statictab == 2 ){
				this.loadMyFocusArticle()
			}
		},
		tab(str){
			this.num = 20
			this.page = 1
			if ( str == '我关注的'){
				this.statictab = 2;
				this.loadMyFocusArticle()
			}else {
				this.statictab = 1;
				if(this.authUser.UserIdentity != 2 ){
						this.loadPayArticle()
				}else{
					this.type = 0
					this.loadMyArticle()
				}
			}
		},
		handleSizeChange(val) {
			this.num = val
			this.initMyData()
//			回到顶部
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
	  	},
	  	handleCurrentChange(val) {
			this.page = val
			this.initMyData()
//			回到顶部
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
	  	},  
//	  	加载用户我的文章数据（老师）
	  	loadMyArticle(){
	  		let params = {}
	  		params.token = this.authToken
	  		params.type = this.type
	  		params.num = this.num
	  		params.page = this.page
	  		this.api.get('/Article/TMyList',params).then(resp => {
	  			this.totalCount = resp.TotalCount
	  			this.data = resp.List
	  		})
	  	},
//	  	加载我关注的文章,老师用户通用（用户个和老师）
	  	loadMyFocusArticle(){
	  		let params = {}
	  		params.token = this.authToken
	  		params.num =this.num
	  		params.page = this.page
	  		this.api.get('/Article/MyAttentionList', params).then(resp => {
	  			this.totalCount = resp.TotalCount
	  			this.data = resp.List
	  		})
	  	},
//	  	加载用户的我的订阅的数据（用户）
		loadPayArticle(){
			let params = {}
			params.token = this.authToken
			params.page = this.page
			params.num = this.num
			this.api.get('/Article/MySubscribeList', params).then(resp => {
	  			this.totalCount = resp.TotalCount
	  			this.data = resp.List
			})
		},
		listen(data){
			this.type = data 
		},
		toup(index){
			this.loadMyArticle()
		}
	},
	watch:{
		authUser(){
			this.initMyData()
		},
		type(){
			this.loadMyArticle()
		}
	},
	computed: {
		...mapGetters(['authUser', 'authToken'])
	},
	components:{
		ArticleItem
	}
	
}
</script>

<style  lang="less" scoped>
.articleall { padding-bottom: 52px;
	.my_article_wrap { padding-top: 16px; height: 60px;
		> a { display: inline-block;}
		.my_article { padding: 8px 29px;  font-size: 14px; border: 1px solid #cccccc; border-right: none; color: #333333; cursor: pointer;}
		.my_guanzhu { padding: 8px 29px; font-size: 14px; border: 1px solid #cccccc; border-left-color: #db7374; color: #333333; cursor: pointer;} 
		.allpayarticle { color: #676767; padding-top: 10px; 
			> .link { color: #e4393f;}
		}
		.actioncolor{border-color: #db7374; }
	}
	.changepage { text-align: center; margin-top: 46px;}
}
</style>