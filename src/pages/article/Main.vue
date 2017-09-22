<template>
	<div class="main">
		<div class="main_left left">
			<div class="boutique">
				<div v-if="HeadlineData" class="headline_wrap ">
					<div class="img-wrap">
						<a target="_blank" :href="HeadlineData.LinkUrl">
							<img  :src="HeadlineData.Img" alt="" />
						</a>
					</div>
					<div class="headline right">
						<a :href="HeadlineData.LinkUrl" target="_blank">
							<p class="title"><span>头条</span>{{HeadlineData.Title}}</p>
							<p class="detail">{{HeadlineData.Introduce}}</p>
						</a>
					</div>
				</div>
				<div class="list_wrap">
					<div class="item left" v-for="(item, index) in LeftRecommendList">
						<p class="text_wrap"><span class="name"><i></i><router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}">{{item.TeacherName}}</router-link>|</span><router-link target="_blank" :to="{name:'detail', params:{id:item.ArticleId}}"  class="detail">{{item.Title}}</router-link></p>
					</div>
				</div>
			</div>
			<div class="article_menu">
				<div @click="tab(index)" :class="{actived: staticstyle == index}"  class="menu" v-for="(item,index) in dataNav" :key="index">{{item.tab}}</div>
				<router-link v-if="authUser && authUser.UserIdentity == 2" class="menu" target="_blank" :to="{name:'deliver'}">发表文章</router-link>
				<a class="menu" v-else @click="uertodeliver" >发表文章</a>
			</div>

			<!--用户点击发表文章弹窗-->
			<el-dialog class="open_wrap"
			  :visible.sync="dialogVisible"
			  :before-close="handleClose">
			  <div class="self_wrap">
			  	<p class="title"><i class="icon iconfont icon-warning"></i> 暂无权限！</p>
			  	<p class="info">此栏目目前仅支持老师发表文章，您可以前往个人中心发表</p>
			  	<p class="action" v-if="authUser"><a target="_blank" :href="`http://home.yifucj.com/${authUser.Id}`">个人中心</a></p>
			  </div>
			</el-dialog>


			<div class="article_wrap">
				<!--<keep-alive>-->
				 <component :is="view"></component>
				<!--</keep-alive>-->
			</div>

		</div>
		<div class="main_right right">
			<div class="recommend author">
				<p class="title">推荐作者</p>
				<router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}"  :key="index" class="item" v-for="(item, index) in ReAuthorList">
					<div class="item_left left">
						<img :src="item.Img" alt=""/>
					</div>
					<div class="item_right right">
						<p class="name_wrap"><span class="name">{{item.TeacherName}}</span><span class="number right"><i>{{item.ArticleCount}}</i>文章</span></p>
						<p class="detail">{{item.Introduce}}</p>
					</div>
				</router-link>
			</div>
			<div class="recommend essay">
				<p class="title">热门文章</p>
				<div class="item" v-for="(item, index) in HotArticleList" :key="index">
					<p class="text_wrap"><span class="name"><i></i><router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}">{{item.TeacherName}}</router-link>|</span><router-link target="_blank" :to="{name:'detail', params:{id:item.Id}}" class="detail">{{item.Title}}</router-link></p>
					<p class="time_wrap"><span class="time">{{item.CreateDate}}</span><span class="number right">阅读<i>{{item.ReadCount}}</i></span></p>
				</div>
			</div>
			<div class="recommend order">
				<p class="title">热门订阅</p>
				<router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}" class="item" :key="index" v-for="(item,index) in HotSubscribeList">
					<div class="item_left left">
						<img :src="item.HeadImg" alt="" />
					</div>
					<div class="item_right right">
						<p class="name_wrap"><span class="name">{{item.TeacherName}}</span><span class="number right"><i>{{item.ArticleCount}}</i>文章</span></p>
						<p class="detail">{{item.Info}}</p>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleAll from '@/components/articles/ArticleAll'
import ArticlePay from '@/components/articles/ArticlePay'
import ArticleFree from '@/components/articles/ArticleFree'
import ArticleMy from '@/components/articles/ArticleMy'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
	name:'main',
	data(){
		return {
//			articleTab: '',    //当前页面的文章显示
			dataNav: [
				{tab: '全部文章', flag: 'all'},
				{tab: '付费文章', flag: 'pay'},
				{tab: '免费文章', flag: 'free'},
				{tab: '我的文章', flag: 'my'}
			],
			
			dialogVisible:false,
			staticstyle: '',
//			设置默认加载的文章导航选项
			view:'',
//			设置默认头条显示数据
			HeadlineData:null,
//			设置左侧推荐位数据
			LeftRecommendList:[],
//			右侧推荐作者数据
			ReAuthorList:[],
//			热门文章数据
			HotArticleList:[],
//			热门订阅数据
			HotSubscribeList:[],
//			页面左侧文章数据
			num:20,
			size:1,
		}
	},
	created(){
		this.initTab(this.$route.params.id)

		this.api = new Api()
//		加载左侧推荐数据
		this.loadRecommand()
//		加载右侧推荐作者数据
		this.loadRecommand(1)
//		加载右侧热门文章
		this.loadHotArticle()
//		加载右侧热门订阅数据
		this.loadHotSubscribe()
	},
	methods:{
//		加载文章首页左右两侧推荐位（参数0表示左侧推荐）
		loadRecommand(str){
			let params = {}
			if (str) {
				params.position = str
//				右侧推荐作者数据
				this.api.get('/Article/Recommand',params).then(resp => {
					this.ReAuthorList = resp
				})
			} else {
				params.position = 0
				this.api.get('/Article/Recommand',params).then(resp => {
					for(var value of resp) {
						if (value.IsIndex == 1) {
							this.HeadlineData = value
						}
						if( value.IsIndex == 0){
							this.LeftRecommendList.push(value)
						}
					}
				})
			}

		},
//		加载右侧热门文章
		loadHotArticle(){
			this.api.get('/Article/HotArticle').then(resp => {
				this.HotArticleList = resp
			})
		},
//		加载右侧热订阅数据
		loadHotSubscribe(){
			this.api.get('/Article/HotSubscribe').then(resp => {
				this.HotSubscribeList = resp
			})
		},
//		文章首页切换tab选项卡操作
		tab(str){
			switch (str){
				case 0:
					this.$router.push({name:'index', params:{id:'all'}})
					break;
				case 1:
					this.$router.push({name:'index', params:{id:'pay'}})
					break;
				case 2:
					this.$router.push({name:'index',params:{id:'free'}})
					break;
				case 3:
					if (!this.authUser) {
						Auth.openLoginDialog()
						return false
					}
					this.$router.push({name:'index', params:{id:'my'}})
					break;
				default:
					break;
			}
			this.initTab(this.$route.params.id)
		},
		initTab(str){
			if(str == 'all'){ this.view = ArticleAll; this.staticstyle = 0 }
			if(str == 'pay'){ this.view = ArticlePay;  this.staticstyle = 1 }
			if(str == 'free'){ this.view = ArticleFree;  this.staticstyle = 2 }
			if(str == 'my'){ this.view = ArticleMy;  this.staticstyle = 3}
		},
		initTab(str) {
			if(str == 'all')  {this.view = ArticleAll ; this.staticstyle = 0 }
			if(str == 'pay')  {this.view = ArticlePay; this.staticstyle = 1 }
			if(str == 'free')  {this.view = ArticleFree; this.staticstyle = 2 }
			if(str == 'my')  {this.view = ArticleMy; this.staticstyle = 3 }
		},
		uertodeliver(){
//    		判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
//			alert('暂无权限')
		this.dialogVisible = true
		},
		handleClose(done){
			done()
		}
	},
	computed:{
		...mapGetters(['authUser'])
	},
	watch: {
		$route () {
			this.initTab(this.$route.params.id)
    }
	},
	components:{
		ArticleAll,
		ArticlePay,
		ArticleFree,
		ArticleMy
	},
	watch: {
		articleTab(val, old){
			console.log(val)
			console.log(old)
		}
	}
}
</script>

<style scoped lang="less">
	* { font-size: 14px;}

	.main { width: 1175px; margin: 0 auto; padding-top:30px; background: #FFFFFF; overflow: hidden; font-family: "microsoft yahei";
		.main_left { width: 730px;
			/*左侧上部分精品*/
			.boutique { width: 100%; padding-bottom: 10px;
				.headline_wrap { height: 136px;
					.img-wrap { width:180px ; height: 120px; float: left;
						> a {
							> img { width: 180px; height: 120px;}
						}

					}
					.headline { width: 540px; padding-left: 20px; padding-top: 14px;
						.title { font-size: 18px; margin-bottom: 16px; color: #666666;
							>span {display: inline-block; width: 42px; height: 23px; line-height: 23px; background: #e43a3d; text-align: center; color: #fdfffc; border-radius: 5px; margin-right: 5px;}
						}
						.detail { line-height: 22px;color: #666666; font-size: 14px;}
					}
				}

				.list_wrap {height: 110px;
					.item { width: 338px; height: 31px; line-height: 30px; overflow: hidden;  text-overflow: ellipsis; white-space: nowrap;
						.text_wrap { width: 374px; line-height: 30px; font-size: 13px; width: 100%;
							.name { float: left; color: #cccccc; display: inline-block;
								i {display: inline-block; border: 3px solid #cccccc; border-radius: 50%; margin-right: 8px;}
								a { margin-right: 9px; font-size: 14px; color: #666;
									&:hover { color: #e33a3d;}
								}
							}
							.detail { display: inline-block; float: left; font-size: 14px; padding-left: 10px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; color: #333333;
									&:hover { color: #e33a3d;}
							}
						}
					}
					.item:nth-child(odd) { margin-right: 33px;}
				}
			}

			/*设置弹出用户无权限的对话框样式*/
			.open_wrap {
				.self_wrap {
					.title { text-align: center; font-size: 30px; color: #9a9a9a;
						> i{ font-size: 40px; color: #ff9900;}
					}
					.info { height: 94px; line-height: 94px; text-align: center; font-size: 14px; color: #333333; }
					.action { text-align: center;
						> a { display: inline-block; width: 250px; height: 50px; border: 1px solid #e33b3b; text-align: center; line-height: 50px; font-size: 16px; color: #e33a3f; }
					}
				}
			}



			/*左侧文章导航*/
			.article_menu { width: 100%; height: 60px; line-height: 60px; background: #f7f7f7;
			 	.menu  { float: left; width: 20%; text-align: center; font-size: 15px; color: #676767; cursor: pointer; border-bottom: 2px solid #f7f7f7;
					&:hover { color:#e43c3c;}
				}
			 	.menu:nth-last-child(1) { background: #74b7fd; color: #FFFFFF; border-bottom: 2px solid #74b7fd;
			 		> a { font-size: 15px; color: #FFFFFF;}
			 	}
			}
			/*左侧选项卡*/
			.article_wrap {}

			.changepage { text-align: center;}

		}




		/*文章首页右侧模块*/
		.main_right { width: 374px;
			.recommend {
				.title { font-size: 16px; padding-top: 20px; padding-bottom: 10px; color: #333333;}
			}
			.author{
				.title { padding-top: 0;}
				.item { height: 90px; display: block; border-bottom: 1px solid #eeeeee;
					.item_left { width: 65px; height: 90px; padding-top:20px ;
						img { width: 50px; height: 50px; border-radius: 50%;}
					}
					.item_right { padding-top: 13px;
						.name_wrap { height: 36px; line-height: 36px;
							.name { font-size: 15px; font-weight: 600; color: #555;}
							.number { font-size: 14px; color: #999999;
								i { font-size: 14px; color: #e43c3c; margin-right: 4px;}
							}
						}
						.detail { height:22px; line-height: 22px; width:309px; font-size: 14px; color: #666666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
					}
				}
			}
			.essay {
				.item { margin-bottom: 10px;
					.text_wrap { width: 374px; line-height: 30px; font-size: 13px;
						.name { color: #999; display: inline-block; vertical-align: middle; margin-right: 10px;
							i {display: inline-block; border: 3px solid #cccccc; border-radius: 50%; margin-right: 8px;}
							a { margin-right: 9px; font-size: 14px; color: #666;
								&:hover { color: #e4393f;}
							}
						}
						.detail { display: inline-block; font-size: 14px; vertical-align: middle; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; color: #333333;
							&:hover { color: #e4393f;}
						}
					}
					.time_wrap { padding-left: 15px; -size: 12px; color: #9A9A9A;
						.time { font-size: 12px;}
						> .number {
							> i { color: #e33b3b; margin-left: 3px;}
						}
					}
				}
			}
			.order {
				.item { height: 90px; display: block; border-bottom: 1px solid #eeeeee;
					.item_left { width: 65px; height: 90px; padding-top:20px ;
						img { width: 50px; height: 50px; border-radius: 50%;}
					}
					.item_right { padding-top: 13px;
						.name_wrap { height: 36px; line-height: 36px;
							.name { font-size: 15px; font-weight: 600; color: #555;}
							.number { font-size: 14px; color: #999999;
								i { font-size: 14px; color: #e43c3c; margin-right: 4px;}
							}
						}
						.detail { height:22px; line-height: 22px; color: #666666; width:309px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
					}
				}

			}
		}
	}


	/*设置页面选项卡的激活样式*/
	.actived { color: #e43c3c !important; border-color: #e43c3c !important; font-weight: 900 !important;}


</style>
