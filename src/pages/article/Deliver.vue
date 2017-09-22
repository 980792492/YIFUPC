<template>
	<div class="deliver_wrap">
		<div class="content_wrap">
			<p class="title">请选择要发表文章的类型：</p>
			<div class="action_wrap">
				<div @click="tab(index)" class="action" :class="{checked : staticType == index} " v-for="(item, index) in ['藏金阁','付费文章','免费文章']">
					{{item}}
					<div v-if="staticType == index" class="dagou"></div>
				</div>
			</div>
			<div class="componets_wrap">
				<component :is="view" :status = "staticType" ></component>
			</div>
			
		</div>
	</div>
</template>

<script>
import CjgAction from '@/components/articles/CjgAction'
import ArticleAction from '@/components/articles/ArticleAction'
import { mapGetters } from 'vuex'
import Auth from '@/utils/Auth'


export default {
	name:'deliver',
	data(){
		return {
//			设置发表文章类型
			staticType:0,
			view: CjgAction
		}
	},
	created(){
		//		判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
		}
	},
	methods:{
		tab(index){
			this.staticType = index
			if(index == 0){
				this.view = CjgAction
			}else{
				this.view = ArticleAction
			}
		}
	},
	computed:{
		...mapGetters(['authUser'])
	},
	components:{
//		Cjg
	}
}
</script>

<style lang="less" scoped>
	* { font-size: 14px;}
	.deliver_wrap { background: #e3e3e3; padding-top: 15px; 
		.content_wrap { width: 1175px; margin: 0 auto; padding: 0 80px;  padding-top: 51px; background: #FFFFFF;
			.title { height: 39px; font-size: 16px; font-weight: 600; color: #666666;}
			.action_wrap {  margin-bottom: 52px; overflow: hidden;
				.action { width: 180px; float: left; height: 60px; position: relative; border: 1px solid #cccccc; cursor: pointer; text-align: center; line-height: 60px; font-size: 20px; color: #656565; margin-right: 29px;
					.dagou { width: 22px; height: 22px; background: url(../../assets/dagou.png) no-repeat; position: absolute; right: 0; bottom: 0; }
				}
			 	.checked { border-color: #ff9801;}
			 }
		}
	
	}
</style>