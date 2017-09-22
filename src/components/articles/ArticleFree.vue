<template>
	<div class="articleall">
		<!--<div>暂无数据</div>-->
		<article-item v-if="data.length > 0 " :status="data"></article-item>
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
import Api from '@/utils/Api'
export default {
	name:'articlefree',
	data(){
		return {
//			设置初始化页码和条数
			page:1,
			num:10,
			totalCount:null,
//			默认全部文章数据
			data:[]
		}
	},
	created(){
		this.api = new Api()
		this.loadFreeArticle()
	},
	methods:{
		handleSizeChange(val) {
			this.num = val
	    	this.loadFreeArticle()
//			回到顶部
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
	    	
	  	},
	  	handleCurrentChange(val) {
	  		this.page = val
	    	this.loadFreeArticle()
//			回到顶部
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
	  	},
	  	loadFreeArticle(){
	  		let params = {}
			params.page = this.page
			params.num = this.num
			params.type = 0
			this.api.get('/Article/IndexList', params).then(resp => {
				this.totalCount = resp.TotalCount
				this.data = resp.List
			})
	  	}
	},
	components:{
		ArticleItem
	}
}
</script>

<style lang="less" scoped>
	.articleall { padding-bottom: 104px;
	
		.changepage { text-align: center; margin-top: 46px;}
}

</style>