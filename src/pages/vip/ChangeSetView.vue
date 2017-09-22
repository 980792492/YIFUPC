<!--修改特训班设置，，老师-->
<template>
	<div class="change_teacher_set">
		<div class="content_wrap">
			<p class="title">修改特训班设置</p>
			<div class="wrap">
				<tset-view></tset-view>
			</div>
		</div>
	</div>
</template>

<script>
import TsetView from '@/components/vip/TsetView'
export default {
	name: 'changesetview',
	data() {
		return {
		}
	},
	methods:{
		
	},
	components:{
	   TsetView
	}
}
</script>

<style lang="less" scoped>
	.change_teacher_set { background: url(../../assets/viproom_content_bj.jpg); padding-top: 30px; padding-bottom: 40px;
		.content_wrap { width: 1175px; margin: 0 auto;
			.title { height: 60px; background: #dfb465; line-height: 60px; padding-left: 55px; font-weight: 600; font-size: 16px; color: #835941;}
			.wrap { padding: 0 50px; padding-top: 54px; background: #FFFFFF; }
		}
	}

</style>