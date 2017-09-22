<template>
	<div v-if="teacherId > 0" class="order_wrap">
		<a :href="`http://home.yifucj.com/${teacherId}/Cjg/NewIndex`" target="_blank">
			<div><i class="cjg icon iconfont icon-cjg"></i></div>
			<p>藏金阁</p>
		</a>
		<a href="http://room.yifucj.com/VIP/MyVip" target="_blank">
			<div><i class="vip icon iconfont icon-txb"></i></div>
			<p>特训班</p>
		</a>
		<a :href="`http://home.yifucj.com/${teacherId}/EncryptedView`" target="_blank">
			<div><i class="jiamiguandain icon iconfont icon-jiamiguandian"></i></div>
			<p>加密观点</p>
		</a>
		<a :href="`http://home.yifucj.com/${teacherId}/MyAccount/GoldRecdList`" target="_blank">
			<div><i class="shouzhimingxi icon iconfont icon-shouzhimingxi"></i></div>
			<p>收支明细</p>
		</a>
		<router-link class="border_right_none" :to="{name:'history-list'}">
			<div><i class="lishizhibo icon iconfont icon-shu"></i></div>
			<p>直播历史</p>
		</router-link>
		<!-- <a class="border_right_none" href="javascript:;">
			<div><i class="zhiboqiantai icon iconfont icon-yanjing"></i></div>
			<p>直播前台</p>
		</a> -->
		<el-popover
			ref="kf"
			placement="top-start"
			width="304"
			trigger="hover">
			<a slot="reference">
				<div><i class="kefufuwu icon iconfont icon-QQ"></i></div>
				<p>客服服务</p>
			</a>
			<ul class="kf">
				<li>一一QQ号：1536972572</li>
				<li>财富QQ号：2950972868</li>
				<li>富富QQ号：2725731686</li>
			</ul>
		</el-popover>
		<a href="http://www.yifucj.com/help1" target="_blank">
			<div><i class="bangzhuzhongxing icon iconfont icon-wenhaoweiwanchengyanzheng"></i></div>
			<p>帮助中心</p>
		</a>
		<a href="http://staticres.yifucj.com/room/20141112.doc">
			<div><i class="zhoboshouzhe icon iconfont icon-guize"></i></div>
			<p>直播守则</p>
		</a>
		<!-- <a class="border_right_none" href="javascript:;">
			<div><i class="wodedengji icon iconfont icon-dengji"></i></div>
			<p>我的等级</p>
		</a> -->
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default{
	mounted () {
		// 营销QQ
		BizQQWPA.addCustom({ aty: '0', a: '0', nameAccount: 800071321, selector: 'BizQQWPA' })
	},
	computed: {
		...mapGetters(['teacherId'])
	}

}
</script>

<style lang="less" scoped>
.order_wrap { height: 250px; border-top: 1px solid #dadada;
	.border_right_none { border-right: none;}
	a {display: block; box-sizing: content-box; float: left; width: 82px; height: 83px; border-bottom: 1px solid #dadada; border-right: 1px solid #dadada; text-align: center; color: #3B3B3B;
		> div {  height: 50px; line-height: 50px;
			> i { transition: all 0.3s;}
			.cjg { font-size: 34px; font-weight: 700; }
			.vip { font-size: 30px; font-weight: 700; }
			.jiamiguandain { font-size: 29px; font-weight: 700;}
			.shouzhimingxi {  font-size: 25px; font-weight: 700; }
			.zhiboqiantai { font-size: 22px; font-weight: 700; }
			.kefufuwu {  font-size: 25px; font-weight: 700; }
			.bangzhuzhongxing {  font-size: 30px; font-weight: 700; }
			.zhoboshouzhe {  font-size: 22px; font-weight: 700; }
			.lishizhibo { font-size: 28px; font-weight: 700; }
			.wodedengji {  font-size: 28px; font-weight: 700; }
		}

		&:hover { color: #ff9a00;
			.cjg { font-size: 37px; font-weight: 700; }
			.vip { font-size: 32px; font-weight: 700; }
			.jiamiguandain { font-size: 31px; font-weight: 700;}
			.shouzhimingxi {  font-size: 27px; font-weight: 700; }
			.zhiboqiantai { font-size: 24px; font-weight: 700; }
			.kefufuwu {  font-size: 28px; font-weight: 700; }
			.bangzhuzhongxing {  font-size: 33px; font-weight: 700; }
			.zhoboshouzhe {  font-size: 24px; font-weight: 700; }
			.lishizhibo { font-size: 30px; font-weight: 700; }
			.wodedengji {  font-size: 30px; font-weight: 700; }
		}
	}
}
</style>
