<!--进入vip直播的页面导航-->
<template>
	<div class="nav_wrap">
		<div class="nav_left_wrap left">
			<div class="nav_left left"><router-link :to="{}">直播</router-link></div>
			<div class="nav_left left"><router-link :to="{}">藏金阁/文章</router-link></div>
			<div class="nav_left left"><router-link :to="{}">特训班</router-link></div>
			<div class="nav_left left "><router-link :to="{}">视频</router-link></div>
		</div>
		<div class="nav_right_wrap right">
			<div class="teacher_right" v-if="isTeacher">
				<router-link target="_blank" :to="{name:'changesetview'}">修改特训班设置</router-link><router-link target="_blank" :to="{name:'orderrecord', params:{id: this.$route.params.id}}">查看订阅记录</router-link>
			</div>
			<div class="user_right" v-if="!isTeacher && topData">
				光头涨，您的订阅已经到期 <span @click="showMore" class="icon_wrap"><i class="icon iconfont" :class="showDate ? 'icon-lnicon32' : 'icon-arrow-up' "></i></span>
				<router-link target="_blank" :to="{}" v-if="topData.EnableSubscribe" class="right order_icon ">续订</router-link>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'roomlivenav',
	data() {
		return {
//			isTeacher: false,    //判断是否为老师
			showDate:false
		}
	},
	created(){
		console.log(this.topData)
	},
	props:{
		topData: {
			type:Object,
			default: function () {
        		return { }
      		}
		}
	},
	methods: {
		showMore(){
			this.showDate  = !this.showDate
			this.$emit('child', this.showDate)
		}
	},
	computed:{
		isTeacher(){
			return this.topData.TeacherId  == this.authUser.Id
		},
		...mapGetters(['authUser'])
	}
}
</script>
<style lang="less" scoped>
	.nav_wrap { height: 60px; 
		.nav_left_wrap { height: 60px; line-height: 60px; width: 760px;
			.nav_left { text-align: center; height: 60px; line-height: 60px; background: #715967; 
				a { display: block;font-size: 16px; color: #feffff;}
			}
			.nav_left:nth-child(1) {width: 164px; }
			.nav_left:nth-child(2) {width: 200px; }
			.nav_left:nth-child(3) {width: 167px; color: #d7aa66; border-bottom:4px solid #d7aa66; }
			.nav_left:nth-child(4) {width: 229px; }
		}
		.nav_right_wrap { height: 60px; width: 414px; background: #ab7d42;
			.teacher_right {
				a { display: inline-block; width: 207px; height: 60px; line-height: 60px; text-align: center; font-size: 14px; color: #FFFFFF;}
				a:nth-child(1) { background: #a27139;}
				a:nth-child(2) { background: #c39a5c;}
			}
			.user_right { height: 60px; line-height: 60px;
				padding-left: 21px; color: #fffeff; font-size: 16px;
				.icon_wrap { margin-left: 6px; cursor: pointer;
					i { font-size: 20px;}
				}
				.order_icon { width: 80px; height: 30px; font-size: 14px; line-height: 30px; text-align: center; border: 1px solid #dd9c3e; color: #f8b658;margin-right: 21px; margin-top: 15px; border-radius: 15px;}
			
			}
		}
	}
	
</style>
