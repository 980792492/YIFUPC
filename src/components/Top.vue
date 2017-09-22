<template>
	<div>
		<div class="top_wrap">
	  		<div class="top">
	  			<div class="welcome">
	  				<span v-if="this.authUser">
	  					欢迎您，<a class="link" target="_blank" :href="`//home.yifucj.com/${authUser.Id}`">{{ authUser.UserName }}</a><a class="exit" href="javascript:;" @click="logout">[退出]</a>
	  				</span>
	  			</div>
	  			<div class="login_wrap">
	  				<div v-if="!this.authUser">
	  					<div class="login" @click="login"><a>登录</a></div>
	  					<div class="register">
	  						<a onclick="_hmt.push(['_trackEvent', '顶部免费注册', 'click', '/login/top']);" href="//www.yifucj.com/user/UserRegMobile" target="_blank">注册</a>
	  					</div>
	  				</div>
	  				<div  v-else >
	  					<div  class="Gbi">G币:{{authUser.CurrentGcoinsCount}}</div>
		  				<div  class="jifen">积分:{{authUser.CurrentGcentsCount}}</div>
		  				<div  class="daijinquan">代金券:{{authUser.VoucherCount}}</div>
		  				<div  class="zhanneixin"><a :href="`//home.yifucj.com/${authUser.Id}/Message`" target="_blank">站内信</a><span>{{authUser.Message}}</span></div>
	  				</div>
	  				<div class="to_up">
	  					<a onclick="_hmt.push(['_trackEvent', '顶部G币充值', 'click', '/pay/top']);" class="red" href="//pay.yifucj.com" target="_blank">G币充值</a>
	  				</div>
	  			</div>
	  			<div class="top_right">
	  				<a onclick="_hmt.push(['_trackEvent', '顶部网站首页', 'click', '/index/top'])" href="//www.yifucj.com" target="_blank">网站首页</a>
	  				<a onclick="_hmt.push(['_trackEvent', '顶部使用帮助', 'click', '/help/top'])" href="//www.yifucj.com/Help1" target="_blank">使用帮助</a>
	  				<a class="phone_special"  target="_blank">手机看直播
	  					<div class="img_wrap">
	  						<span class="icon"></span>
	  						<img src="../assets/top_erweima.jpg" alt="" />
	  						<span>关注公众号即可看直播</span>
	  					</div>

	  				</a>
	  			</div>
	  		</div>
  		</div>
		<div class="search_wrap">
	  		<div class="search_inner">
	  			<div class="inner_left">
	  				<a class="logo" href=""><img src="../assets/toplogo.jpg" /></a>
	  			</div>
	  			<div class="inner_center">
	  				<a href="//www.yifucj.com">首页</a>
		  			<a :class="{'router-link-active': roomCurrent}" href="//room.yifucj.com">直播</a>
		  			<router-link :to="{path:'/question'}">问答</router-link>
		  			<router-link :to="{path: '/article'}">文章</router-link>
		  			<a href="//room.yifucj.com/vip">特训班</a>
		  			<a href="//room.yifucj.com/NewVideo/Index">学堂</a>
		  			<a :href="`//home.yifucj.com/${ authUser ? authUser.Id : '' }`">我的</a>
	  			</div>
	  			<div class="inner_right">
	  				<div class="search">
	  						<input v-model="keywords" /><span @click="search"></span>
	  				</div>
	  			</div>
	  		</div>
	 </div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Qs from 'qs'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import jsonp from 'jsonp'

export default {
	name:"roomtop",
    dialogVisible: false,
	data(){
		return {
			keywords: null,
			type: 3,
			allnum:0
		}
	},
	created(){
		const api = new Api()
//		api.get('Popularity/SitePopularity').then(resp => {
//			this.allnum = resp.UserCount
//		})
		// Api.getJsonp('http://room.yifucj.com/Api/WebsiteNotice').then(resp => {
		// 	this.allnum = resp.UserCount
		// })
	},
	methods:{
		login(){
			Auth.openLoginDialog()
		},
		logout () {
			Auth.logout()
		},
		search:function(){
			if (!this.keywords) return false
			const params = {
				type: this.type,
				keywords: this.keywords
			}
			location.href = 'http://www.yifucj.com/search?' + Qs.stringify(params)
		},
	},
	watch:{
//		dialogVisible
	},
	computed:{
			roomCurrent () {
				return this.$route.path.match(/^\/room\/(\d+)/i)
			},
    	...mapGetters(['authUser'])

	}

}
</script>

<style lang="less" scoped>
.top_wrap { background: #fafafa; border-bottom: 1px solid #e5e5e5; height: 39px; position: fixed; top: 0; z-index: 999; width: 100%;
	.top { width: 1200px;  margin: 0 auto;  color: #656571;
		.welcome { min-width: 130px; line-height: 38px; text-align: left; border-right: 1px solid #e5e5e5; float: left;
			span { font-weight: 500;
				.exit { color: #333; font-size: 12px; font-weight: normal; padding:0 5px;}
				.link{ color: #5f98ed;}
			}
		}
		.login_wrap {  float: left; /*height: 38px;*/
			> div { line-height: 38px; height: 38px;  float: left;
				> div { float: left;  padding:0  10px; border-right: 1px solid #e5e5e5; height: 100%; line-height: 38px;
					> a { padding:0  10px; display: block; height: 100%; line-height: 38px; cursor: pointer;
					 	&:hover  { color: #ff7c3b;}
					}
				}
				.login {
					a { color: #5C5C5C;
						&:hover { color: #ff8134;}
					}
				 }
				 .register {
				 	a {color: #5C5C5C; }
				 }

				 /*站内信*/
				.zhanneixin { padding-right: 24px;
					a { display:inline-block;  padding-right: 5px; color: #656565;}
					> span { padding: 0 5px; top: 4px; left: 53px; color: #FFFFFF; background: #e43a3d; min-width:14px ; max-width: 30px; text-align: center; height: 16px; line-height: 16px;
								border-radius: 10px;}
				}
			}
			.to_up { height: 38px; line-height: 38px;  float: left;
				a { color: #ff0107; font-weight: 700;  padding:0  10px;
				}
			}
		}
		.top_right { width: 246px; line-height: 38px; float: right; text-align: right;
			> a { display: inline-block; color: #656571; padding: 0 5px; height: 38px;
				&:hover { color: #ff8134;}
			}
			.phone_special { text-align: center; position: relative; cursor: default;
				&:hover .img_wrap { display: block;}
				.img_wrap { position: absolute; display: none;  right: 5px;  background: #fff; z-index: 100; padding-top: 15px; width: 150px; height: 170px;box-shadow: 0px 1px 3px #999;
					.icon { display: block; top: -8px; right:10px ; position: absolute;  width: 0;  height: 0; border-left: 10px solid transparent;  border-right: 10px solid transparent; border-bottom:8px solid #fff;}
					img { display: block; margin: 0 auto; width: 120px; height: 120px;}
				 }
			}
		}
	}

}
.search_wrap { height:130px; background: #FFFFFF; padding-top: 39px;  background: #e43a3d;
	.search_inner { width: 1200px; height: 100%;  margin: 0 auto;
		.inner_left { width: 200px; float: left;
			a {  width: 120px; height: 80px;  padding-top: 26px; font-size: 0; display: block;
				img { width: 120px; height: 43px; margin-left: 1px ; }
			}
		}
		.inner_center {  float: left; height: 90px; line-height: 90px;
			a { display: inline-block; text-align: center; height: 90px;  line-height: 90px; width: 80px; font-size: 16px; color: #FFFFFF;
				&:hover { background: #C61420; }
			}
			.router-link-active { background: #C61420; font-weight: 900;}
		}
		.inner_right { width: 260px; padding-top: 15px; color: #937d89; float: right;

				>a { display: block; width: 64px; height: 60px; /*height: 56px;*/ text-align: center; margin: 0 10px; float: left;
					>img { display: block; width: 36px; height: 36px; margin: 0 auto; margin-bottom: 8px;}
				}

				.search { width: 250px; height: 40px; background: #FFFFFF; border-radius: 5px; margin-top: 13px;
					input { outline: none; padding-left: 14px; height: 100%; width: 209px; border: none; border-radius: 5px; vertical-align: middle;}
					> span { display: inline-block; vertical-align: middle; width: 40px; height: 38px; background: url(../assets/top_icon.jpg) no-repeat; cursor: pointer;}

				}
		 }
	 }
}
.roomnav_wrap { height: 50px; background: #e43a3d; line-height: 50px;
	> .roomnav { width: 1200px; margin: 0 auto;
		> a { display: block; float: left; padding: 0 25px; color: #FFFFFF; font-weight: 600; font-size: 13px;}
	}
 }





</style>
