<template>
	<div class="item_wrap">
		<question-item :status="data" belong="pay"  @child="listen"></question-item>
		<div class="page_wrap">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page.sync="page"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="num"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="allTotal">
		   </el-pagination>
		</div>
	</div>
</template>

<script>
import QuestionItem from '@/components/question/QuestionItem'
import { mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
	
export default {
	name: 'questionpay',
	data(){
		return {
			data:[],
			dialogVisible: false,
			page: 1,
			num: 10,
			allTotal: 0
			
			
		}
	},
	created(){
		this.api = new Api()
		
		this.loadPayList()
	},
	methods:{
		loadPayList(){
			let params = {}
			params.token = this.authToken
			params.type = 1
			params.num = this.num
			params.page = this.page
			this.api.get('/Ask/List', params).then(resp => {
				this.data = resp.List
				this.allTotal = resp.TotalCount
			})
		},
		
		handleSizeChange(val) {
            this.num = val
            this.loadPayList()
//          回到顶部
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        handleCurrentChange(val) {
             this.page = val
            this.loadPayList()
//          回到顶部
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
       },
        listen(data){
			this.loadPayList()
       }
       
       
		
	},
	components:{
		QuestionItem
	},
	computed:{
		...mapGetters(['authToken'])
	}
	
}
</script>

<style scoped lang="less">
	.page_wrap { text-align: center; padding-top: 35px; padding-bottom: 48px;}
</style>