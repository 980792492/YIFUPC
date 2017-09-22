<template>
	<div>
		<!--老师-->
		<div v-if="authUser && authUser.UserIdentity == 2" class="teacher_change_price">
			<p v-if="newPrice == -1">您当前暂未开通问答功能，请点击右侧设置按钮开通<button @click="changeprice">设置</button></p>
			<p v-else>您当前设置的问答价格为：<span>{{newPrice}}</span>G币/次<button @click="changeprice">修改</button></p>
		</div>
		<div v-else class="user_my">
			<span @click="changeitem(1)" :class="{changespan:choiceitem == 1}">我的提问</span><span @click="changeitem(2)":class="{changespan:choiceitem == 2}">我解锁的</span>
		</div>
		<question-item :status="data" belong="my" @child="listen" ></question-item>

		<!--分页-->
		<div v-if="allTotal > num" class="page_wrap">
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


		<!--老师的修改价格弹窗-->
		<el-dialog
			class="open_change_price"
		  :visible.sync="dialogVisible">
			<div class="input_wrap">
				<div class="title">设置问答价格</div>
				<div class="my_input">
					<input type="text" placeholder="请输入价格" v-model="price" /><button @click="ensure">提交</button>
				</div>
			</div>
		</el-dialog>


	</div>
</template>

<script>
import QuestionItem from '@/components/question/QuestionItem'
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'



export default {
	name: 'questionmy',
	data(){
		return {
			choiceitem:1,
			data:[],
			dialogVisible: false,
			price: '',
			newPrice: '',
			page: 1,
			num: 10,
			allTotal: 0
		}
	},
	created(){
		if (!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
		this.api = new Api()
		this.loadMylist()
	},
	methods:{
//		加载列表
		loadMylist(){
			let params = {}
			params.token = this.authToken
			params.page = this.page
			params.num = this.num
			if(this.authUser && this.authUser.UserIdentity != 2){
				params.type = this.choiceitem - 1
			}
			this.api.get('/Ask/MyList', params).then(resp => {
				this.data = resp.List
				this.allTotal = resp.TotalCount
				this.newPrice = resp.Price
			})
		},

//		用户的切换
		changeitem(str){
			this.choiceitem = str
			this.loadMylist()


		},
//		老师的修改价格
		changeprice(){
			this.dialogVisible = true
		},
//		老师的价格修改弹窗的提交按钮
		ensure(){
			let params = {}
			params.token  = this.authToken
			params.price = this.price
			this.api.post('/Ask/SetPrice', params).then(resp => {
				 this.$notify({
		          title: '成功',
		          message: '价格修改成功',
		          type: 'success'
		        });
		        this.dialogVisible = false
		        this.loadMylist()
			})
		},
		handleSizeChange(val) {
            this.num = val
            this.loadMylist()
//          回到顶部
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        handleCurrentChange(val) {
             this.page = val
            this.loadMylist()
//          回到顶部
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
       },
       listen(data){
			this.loadMylist()
			this.InitQuestionNum()
       },
       ...mapActions(['InitQuestionNum'])


	},
	components:{
		QuestionItem
	},
	computed:{
    	...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style scoped lang="less">
	.teacher_change_price {  padding-top: 24px;
		p { text-align: right;  font-size: 14px; color: #666666;
			span { color: #e43a3d; font-size: 14px;}
			button { background: #e43a3d; outline: none; color: #FFFFFF; cursor: pointer; width: 78px; height: 30px; border-radius: 5px; border: none; font-size: 14px; margin-left: 14px;}
		}
	}

	.user_my { padding-top: 28px;
		span { display: inline-block; cursor: pointer; width: 120px; height: 30px; text-align: center; line-height: 30px; border: 1px solid #CCCCCC;}
		span:nth-child(1) { border-right: 1px solid #ee8687;}
		span:nth-child(2) { border-left: none;}
		.changespan { border-color:#EE8687;}

	}

	.open_change_price {
		.el-dialog { width: 650px; height: 250px;
			.input_wrap { padding-top: 20px; padding-left: 30px;
				.title { font-size: 30px; color: #CCCCCC;}
				.my_input { padding-top: 28px;
					input { width:400px ; height: 40px; padding-left: 12px; font-size: 16px;}
					button { width: 150px; height: 40px; border: none; background: #e43a3d; font-size: 16px; color: #FFFFFD; margin-left: 16px; cursor: pointer;}

				}
			}

		}
	}
	.page_wrap { text-align: center; padding-top: 35px; padding-bottom: 48px;}

</style>
