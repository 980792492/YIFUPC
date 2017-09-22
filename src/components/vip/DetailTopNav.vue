<!--vip详情页上部分导航-->
<template>
	<div class="vip_nav">
		<div class="nav left"><router-link target="_blank" :to="{name: 'live-main'}">直播</router-link></div>
		<div class="nav left"><router-link target="_blank" :to="{name: 'live-main'}">藏金阁/文章<img src="../../assets/order-icon.png" alt="" /></router-link></div>
		<div class="nav left"><router-link target="_blank" :to="{}">特训班</router-link></div>
		<div class="nav left"><router-link target="_blank" :to="{name: 'live-main'}">视频</router-link></div>
		<div class="nav left"><router-link target="_blank" :to="{name: 'live-main'}">个人介绍</router-link></div>
	</div>
</template>

<script>
export default {
	name: 'vipnav',
	data() {
		return {

		}
	},
	
}
</script>

<style lang="less" scoped>
.vip_nav { height: 60px; background: #FFFFFF;
	.nav{ height: 60px; background: #FFFFFF; width: 190px; line-height: 60px;  text-align: center;
		a { display: block; height: 60px; font-size: 16px; color: #666666; border-bottom: 4px solid #FFFFFF; img { margin-left: 4px;}}
		.router-link-active { border-color:#e33a3d ;}
	}
}

</style>