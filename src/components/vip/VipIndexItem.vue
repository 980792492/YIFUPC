<template>
	<div class="vip_index_item_wrap" >
		<div v-if="status" class="vip_index_item" v-for="(item, index) in status" :key="index">
			<div class="img_wrap left">
				<img :src="item.HeadImg" alt="老师头像" />
			</div>
			<div class="text_wrap left">
				<p class="title">{{item.Title}}</p>
				<p class="name">主讲人：{{item.TeacherName}}   创建时间：{{item.CreateDate}}</p>
				<p class="info">{{item.Introduce}}</p>
				<p class="label"><span v-for="(i,j) in item.KeyWords">{{i}}</span></p>
			</div>
			<div class="state_wrap left">
				<router-link target="_blank" :to="{name: 'vipdetail', params:{id: item.TeacherId}}" class="a_button right" v-if="item.EnableSubscribe">开放订阅中</router-link>
				<div class="clearn"></div>
				<!--<router-link target="_blank" :to="{name: 'vipdetail', params:{id: item.TeacherId}}" class="a_button right">开放订阅中</router-link>-->
				<a class="a_link" href="">当前开放订阅中，去续订>></a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'vipindexitem',
	data(){
		return {
			
		}
	},
	created(){
		
	},
	props:{
		status: {
			type: Array,
			default() {
				return {}
			}
		}
	},
	methods:{
		
	}
}
</script>

<style lang="less" scoped>
	.vip_index_item { height: 164px; border-bottom: 1px dashed #CCCCCC;
		.img_wrap { width: 93px;  padding-top: 29px;
			img { width: 80px; height: 80px; border-radius: 50%; }
		}	
		.text_wrap { width: 755px; padding-top: 22px;
			.title { font-size: 16px; color: #333333; font-weight: 600; height: 30px; line-height: 30px;}
		 	.name { font-size: 14px; color: #666666; height: 26px; line-height: 26px;}
			.info { font-size: 14px; height: 30px; line-height: 30px; color: #666666; width: 755px; overflow: hidden;}
			.label { padding-top: 4px;
				span { display: inline-block; border: 1px dashed #ff6e75; padding: 8px 32px; color: #fe6f73;}
				> span { margin-right: 8px;}
			}
		}
		.state_wrap { width: 227px; height: 164px; text-align: right; padding-top: 34px;
			.a_button { display: block; width: 200px; height: 40px; text-align: center; line-height: 40px; font-size: 16px; border-radius: 35px; color: #FFFFFF;  background: #e43a3d;}
			.a_link { display: block; padding-right: 10px; line-height: 54px; height: 54px;}
		}
		
		
		
	}


</style>