<!--老师的我的特选班未创建-->
<template>
	<div class="teacher_create_myvip">
		<div class="txinfo">
			<p>特训班说明</p>
			<div><span class="left">1</span><p class="left">老师同一时期只有1个特训班，创建后可长期存在，不需要再每月创建。</p></div>
			<div><span class="left">2</span><p class="left">目前特训班提供4种服务期限（2交易日，5交易日，15交易日以及30交易日，老师可任意选择）。</p></div>
			<div><span class="left">3</span><p class="left">创建好后，老师可自己控制是否开放订阅，在开放订阅期间，用户可随到随订任意一种服务期限，到期自动移除。</p></div>
			<div><span class="left">4</span><p class="left">若老师点击关闭订阅，则在关闭期间，用户无法订阅。</p></div>
		</div>
		<p class="tishi">您还没有特训班，立即创建：</p>
		<tset-view></tset-view>
	</div>
</template>

<script>
import TsetView from '@/components/vip/TsetView'

export default {
	name: 'teachercreatemyvip',
	data(){
		return {
			
	        
		}
	},
	created(){

	},
	methods:{
		
	},
	components: {
		TsetView
	}
	
}
</script>

<style lang="less" scoped>
	.teacher_create_myvip { padding-top: 10px;   
		.txinfo { padding-left: 36px; height: 200px; width: 1075px; border: 1px dashed #f5dfb8; background: url(../../assets/vipcreated_bj.png) no-repeat 826px 20px;
			> p { height: 69px; line-height: 69px; font-size: 20px; color: #cfa551;}
			> div { overflow: hidden; margin-bottom: 4px;
				span { width: 20px; height: 20px; border-radius: 50%; background: #d0a654; text-align: center; line-height: 20px; color: #FFFFFF; margin-right: 8px;}
				p { height: 20px; line-height: 20px; font-size: 14px; color: #666666;}
			}
		}
		.tishi { padding-left: 38px; height: 62px; line-height: 62px; font-size: 20px; color: #d1a451;}
	}
</style>