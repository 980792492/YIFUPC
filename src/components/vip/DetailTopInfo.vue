<!--vip详情上部分老师信息-->
<template>
	<div class="vip_teacher_info">
		<div class="vip_info" v-if="topData">
			<div class="img_wrap left">
				<img :src="topData.HeadImg" alt="" />
			</div>
			<div class="info_wrap left">
				<p class="title"><span>{{topData.Title}}</span><img v-if="topData.EnableSubscribe == 1" src="../../assets/vip_topinfo_open.png"/><img v-if="topData.EnableSubscribe == 0" src="../../assets/vip_topinfo_close.png"/></p>
				<p class="name_wrap"><span>主讲人：{{topData.TeacherName}}</span><span>创建时间：{{topData.CreateDate}}</span></p>
				<p class="action_wrap">
					<span v-for="(item, index) in topData.KeyWords" :key="index">{{item}}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name : 'vipteacherinfo',
	data() {
		return {
			
		}
	},
	props:{
		topData: {
			type:Object,
			default: function () {
        		return { }
      		}
		},
		flag: {
			type: String
		}
	},
	created(){
	},
	methods: {
		
	},
}
</script>

<style lang="less" scoped>
	.vip_teacher_info {
		.vip_info { width: 1175px; height: 175px; background: url(../../assets/vip_detail_top.jpg) no-repeat;
			> div { height: 175px;}
			.img_wrap { width: 180px;  padding-top: 30px; padding-left: 40px;
				img { width: 120px; height: 120px; border: 9px solid #7d6573; border-radius: 50%;}
			}
			.info_wrap { width:612px; padding-top: 46px;
				.title { color: #fffffd;
					span { display: inline-block; font-size: 16px; vertical-align: middle; }
					img { vertical-align: middle; margin-left: 6px;} 
				}
				.name_wrap { padding-top: 14px; span { font-size: 14px; color: #FFFFFD; margin-right: 16px;}}
				.action_wrap { padding-top: 18px; span { border: 1px dashed #ffcc03; margin-right: 8px; padding: 8px 19px; color: #ffcc00;}}
			}
		}
	}

</style>