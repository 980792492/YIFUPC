<template>
	<div id="detai_wrap" class="detai_wrap">
		<!--cjg详情-->
		<div v-if="articletype == 1" class="detail cjg">
			<!--cjg-->
			<div v-if="detail" class="detail_text_wrap left">
				<p  class="title"><span class="cjgflag">CJG</span>{{detail.Title}}</p>
				<div class="name_wrap">
					<div class="img_wrap left"><img :src="detail.HeadImg" /></div>
					<p><span class="name">{{detail.TeacherName}}</span><span class="time">发表时间：{{detail.CreateDate}}</span><span class="number  cjgnum  right">服务时间：{{detail.CreateDate}}至{{detail.StopDate}}</span></p>
				</div>
				<div class="content_wrap">
					<div class="cjg_content" v-if="detail.Share && detail.Share.length > 0" >
						<p>我的自选股</p>
						<div class="cjg_title_wrap">
							<div class="left">发布时间</div>
							<div class="left">我的股票</div>
							<div class="left">我的购买价位</div>
							<div class="left" >我的止盈价位</div>
							<div class="left" >我的止损价位</div>
						</div>
						<div class="cjg_detail_wrap" v-for="(item, index) in detail.Share" >
							<div class="left" >{{item.StartDate}}</div>
							<div class="left" >{{item.StockName}}</div>
							<div class="left" >{{item.Price}}</div>
							<div class="left" >{{item.StopProfitPrice}}</div>
							<div class="left" >{{item.StopLossPrice}}</div>
						</div>
					</div>

					<div v-show="isTeacher" class="teacher_add_wrap" v-if="articletype == 1 && detail.Status != 3">
						<p class="teacher_add_title">追加策略</p>
						<div class="edit_wrap">
							<textarea id="txtbody"  name="" rows="" cols=""></textarea>

						</div>
						<p class="tishi">注意：提交前请仔细检查，<a>提交后无法修改</a></p>
						<p class="check_wrap">
							<input @click="weixinsend" type="checkbox" checked="checked" value="" /><span>推送此消息</span><i title="购买并绑定微信的用户可以收到此信息提醒·" class="icon iconfont icon-wenhaoweiwanchengyanzheng"></i>
							<input class="teacher_submit"  @click="submit"  type="button" value="提交" />
						</p>
					</div>

					<div class="my_celue_wrap" v-if="detail">
						<p>我的策略</p>
						<div class="celue_item" v-for="(item,index) in detail.Content">
							<p class="add_time">追加时间：{{item.CreateDate}}</p>
							<div class="add_detail">
								<!--<span class="tishi">我现在的策略是：</span><br />-->
								<div class="add_detail_text" v-html="item.Content"></div>
							</div>
						</div>
					</div>

				</div>
			</div>
			<div class="detail_right right">
				<div class="auther_wrap">
					<div class="auther">
						<img :src="teacherInfo.HeadImg"></img>
					</div>
					<!--老师看自己cjg-->
					<p v-if="isTeacher && teacherInfo" class="name"><i>{{teacherInfo.UserName}}</i><router-link  target="_blank" :to="{name:'live-main', params:{id:teacherInfo.RoomId}}" v-if="teacherInfo.RoomId">直播中</router-link></p>
					<!--用户看cjg-->
					<p v-else  class="name"><i>{{teacherInfo.UserName}}</i><span :class=" careflag == 0 ? 'guanzhu' : 'yiguanzhu' " @click="care(careflag)" >{{careflag == 0 ? '关注' :'已关注'}}</span><router-link  target="_blank" :to="{name:'live-main', params:{id:teacherInfo.RoomId}}" v-if="teacherInfo.RoomId">看直播</router-link></p>
					<p class="text">{{teacherInfo.Info}}</p>
				</div>
				<div class="detail_list">
					<p class="title" v-if="teacherInfo" >TA的其他文章<router-link  target="_blank" class="right" :to="{name:'cjg', params:{id:teacherInfo.RoomId}}" >更多...</router-link></p>
					<div class="detail_text" v-for="(item, index) in otherArticle">
						<router-link target="_blank" class="text" :to="{name:'detail', params:{id:item.Id}}" ><span></span>{{item.Title}}</router-link>
						<p class="time">{{item.CreateDate}}</p>
					</div>
				</div>
			</div>
		</div>


		<!--文章详情-->
		<div v-if="articletype != 1" class="detail article" >
			<div class="detail_text_wrap left">
				<p class="title">{{detail.Title}}</p>
				<div class="name_wrap">
					<div class="img_wrap left"><img :src="detail.HeadImg" /></div>
					<p><span class="name">{{detail.TeacherName}}</span><span class="time">发表时间：{{detail.CreateDate}}</span><span class="number right">阅读<i>{{detail.ReadCount}}</i></span></p>
				</div>
				<div class="content_wrap">
					<div class="content" v-html="article.Content"></div>
					<div class="action">
						<span style="display: none;" class="dashang_wrap" @click="alert($event)"><i class="dashang icon iconfont icon-dashang"></i>打赏</span>
						<span style="display: none;" class="dianzan_wrap"><i class="dianzan icon iconfont icon-dianzan"></i>120</span>
						<span style="display: none;" class="jubao_wrap"><i class="jubao icon iconfont icon-jubao"></i>举报</span>
					</div>
					<div class="download_wrap" v-if="detail.Attachment">
						<p class="download">
							请点击下载附件: <a download="" :href="`http://wxapi.yifucj.com/api/File/Download?file_name=${detail.Attachment}`">{{detail.Attachment}}</a>
						</p>
					</div>
				</div>
			</div>
			<div class="detail_right right">
				<div class="auther_wrap">
					<div class="auther">
						<img :src="teacherInfo.HeadImg"></img>
					</div>
					<!--老师看自己cjg-->
					<p v-if="isTeacher" class="name"><i>{{teacherInfo.UserName}}</i><router-link  target="_blank" :to="{name:'live-main', params:{id:teacherInfo.RoomId}}" v-if="teacherInfo.RoomId">直播中</router-link></p>
					<!--用户看cjg-->
					<p v-else  class="name"><i>{{teacherInfo.UserName}}</i><span :class=" careflag == 0 ? 'guanzhu' : 'yiguanzhu' " @click="care(careflag)" >{{careflag == 0 ? '关注' :'已关注'}}</span><router-link  target="_blank" :to="{name:'live-main', params:{id:teacherInfo.RoomId}}" v-if="teacherInfo.RoomId">看直播</router-link></p>
					<p class="text">{{teacherInfo.Info}}</p>
				</div>
				<div class="detail_list">
					<p class="title" v-if="teacherInfo" >TA的其他文章<router-link target="_blank" class="right" :to="{name:'cjg', params:{id:teacherInfo.RoomId}}" >更多...</router-link></p>
					<div class="detail_text" v-for="(item, index) in otherArticle">
						<router-link target="_blank" class="text" :to="{name:'detail', params:{id:item.Id}}" ><span></span>{{item.Title}}</router-link>
						<p class="time">{{item.CreateDate}}</p>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
	name:'detail',
	data(){
		return {
//			判断数据类型是cjg还是文章
			articletype:1,
//			判断文章是否属于登录者
			isTeacher:null,
//			页面左侧信息详情
			detail:{},
			download: '',      //下载详情数据
//			老师信息
			teacherInfo:{},
//			TA的其他文章
			otherArticle:[],

//			设置关注与不关注的标识
			careflag:0,

//			设置文章显示默认值
			article:{},

			SendWxMsgFlag:1

		}
	},
	created(){
		this.api = new Api()
		this.initdata()
	},
	mounted(){
		 // 初始化编辑器
	    this.$nextTick(() => {
	      this.txtbody = $('#txtbody').xheditor({
	        "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
	        "width":732,
	        "height":150,
	        "upImgUrl":"http://wxapi.yifucj.com/api/Image/UploadEditorImg?category=0",
	        "upImgExt":"jpg,jpeg,gif,png",
	        "localUrlTest":/^http?:\/\/[^\/]*?(yifucj\.com)\//i,
	        "remoteImgSaveUrl":"http://wxapi.yifucj.com/api/Image/UploadRemoteImg?category=0",
	        "emots":{
	          "yifu":{
	            "name":"一富",
	            "width":20,
	            "height":25,
	            "line":10,
	            "list":{
	              "hanx":"憨笑","kl":"骷髅","cd":"菜刀","xig":"西瓜","pj":"啤酒","lq":"篮球","pp":"乒乓","zt":"猪头","kf":"咖啡","fan":"饭","mg":"玫瑰","dx":"凋谢","sa":"示爱","ax":"爱心","dg":"蛋糕","sd":"闪电","zhd":"炸弹","dao":"刀","zq":"足球","pch":"瓢虫","bb":"便便","yl":"月亮","ty":"太阳","lw":"礼物","yb":"拥抱","qiang":"强","ruo":"弱","ws":"握手","shl":"胜利","bq":"抱拳","gy":"勾引","qt":"拳头","cj":"差劲","aini":"爱你","bu":"No","hd":"Ok","qsh":"潜水","jl":"敬礼","shh":"石化","anw":"安慰","bgl":"扮鬼脸","wy":"无语","kh":"狂汗","tq":"叹气","jy":"加油","shb":"生病","bt":"摆脱","gj":"孤寂","qy":"惬意","fzh":"烦躁"
	            }
	          }
	        }
	      })
	      // xheditor 在vue中的 bug ， 第一次加载高度计算会出错，强行重新设置
	      $('.xheIframeArea').css('height', 118);
	    })
	},
	destroyed () {
    	$('#txtbody').xheditor(false)
  	},
	methods:{
		initdata(){
			let params = {}
			params.id = this.$route.params.id
			params.token = this.authToken
			this.api.get('/Article/Detail', params).then(resp => {
				if (!resp.HasBuy ){
					this.$router.replace({name:'payarticle', params:{id: this.$route.params.id}})
				}
				if (resp.HasBuy){
					this.detail = resp.Detail
					this.teacherInfo = resp.TeacherInfo
					this.otherArticle = resp.OtherArticle
		//			文章默认娶第一条数据
					this.article = resp.Detail.Content[0]
		//			初始化类型
					this.articletype=resp.Detail.Type
		//			初始化是否为老师的标记
					this.isTeacher = resp.IsTeacher
		//			初始化话关注标记
					this.careflag = resp.TeacherInfo.Attaction
				}
			})
		},
		alert(event){
			console.log(event)
		},
		weixinsend(){
			this.SendWxMsgFlag = !this.SendWxMsgFlag
		},
		submit(){
      		const content = this.txtbody.getSource()
			let params = {}
			params.token = this.authToken
			params.id = this.$route.params.id
			params.content = encodeURI(content)
			params.SendWxMsg = Number(this.SendWxMsgFlag)
			this.api.post('/Article/AppendContent', params).then(resp => {
				this.$notify({
		          title: '成功',
		          message: '追加策略成功',
		          type: 'success'
		    	})
		    	this.initdata()
          		this.txtbody.setSource('')
			})
		},
		care(str){
			str = Number(str)
			let params = {}
			params.token = this.authToken
			params.room_id = this.teacherInfo.RoomId
			params.type = str
			console.log(params)
			this.api.post('/Room/Like', params).then(resp => {
					this.$notify({
			          title: '成功',
			          message: str ? '已取消关注':'关注成功',
			          type: 'success'
		    	  	});
//				}
				this.careflag = !this.careflag
			})
		},
	},
	computed:{
		...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style lang="less" >

	#detai_wrap { padding-top: 15px; background: #e3e3e3; padding-bottom: 102px;
		/** { font-size: 16px !important;}*/
		.cjg {
			.content_wrap {
				.cjg_content { width: 775px;  margin-bottom: 18px;
					> p { font-size: 14px; color: #666666; margin-bottom: 12px; font-weight: 600;}
					.cjg_title_wrap { overflow: hidden;   border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; background: #f3f1f2;
						> div { width: 154px; height: 41px; color: #686667; font-size: 14px; font-weight: 600; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: center; line-height: 41px;}
						> div:nth-child(1) { width: 158px;}
					}
					.cjg_detail_wrap {  overflow: hidden; border-left: 1px solid #DDDDDD;
						> div { width: 154px; height: 41px; border-right: 1px solid #DDDDDD; font-size: 14px; color: #666666;  border-bottom: 1px solid #DDDDDD; text-align: center; line-height: 41px;}
						> div:nth-child(1) { width: 158px;}
					}
				}

				.teacher_add_wrap { width: 774px; height: 284px; border: 1px solid #d0d0d0; background: #ededed; padding: 0 20px; padding-top: 18px;
					.teacher_add_title { font-size: 14px; color: #666666; font-weight: 600; margin-bottom: 15px;}
					.edit_wrap { width:734px ; height: 152px; border: 1px solid #c5c5c5;

					}
					.tishi { height: 40px; line-height: 40px; color: #666666;
						a { color: #e23c3c;}
					}
					.check_wrap {  position: relative;
						input { vertical-align: middle; outline: none; }
						span { vertical-align: middle;}
						i { vertical-align: middle; color: #878988; font-size: 20px;}
						.teacher_submit { position: absolute; width: 107px; height: 31px; background: #e43a3d; color: #feffff; border: none; right:18px ; top:-5px ;}
					}
				 }

				.my_celue_wrap { margin-top: 10px;
					> p { font-size: 14px; color: #666666; font-weight: 600; margin-bottom: 20px;}
					.celue_item { margin-bottom: 30px;
						.add_time { height: 30px; line-height: 30px; color: #ff0101; background: #f3f1f2; text-indent: 14px; margin-bottom: 14px;}
						.add_detail { line-height: 30px; font-size: 14px; color: #666666; word-break: break-all;
							.add_detail_text { font-size: 14px;
								* { font-size: 14px; word-break: break-all;}
							}
							> .tishi { font-weight: 600;}
							> p { word-break: break-all;}
						}
					}
					img { max-width: 100%;}
				}




			}


		}




		.detail { width: 1175px; margin: 0 auto; overflow: hidden; background: #FFFFFF;
			.detail_text_wrap { width: 874px; min-height: 643px; padding-top: 45px; background: #ffffff; border-right: 1px solid #CCCCCC; padding-left:48px ; padding-right: 50px;
				.title { height: 64px; text-align: center; font-size: 25px; color: #333333;
					.cjgflag { display: inline-block; height: 30px; vertical-align: middle; line-height: 30px; margin-right: 10px; padding:0 15px ; font-size: 20px; background: #F79900; border-radius: 15px; color: #FFFFFF; }
				}
				.name_wrap { height: 59px; border-bottom: 1px solid #eeeeee; padding-top: 14px;
					.img_wrap { width: 30px;
						> img { width: 30px; height: 30px; border-radius: 100%;}
					 }
					p {line-height: 30px; text-indent: 7px;
						.name { font-size: 15px; color: #333333;}
						.time { margin-left: 18px; color: #989898; font-size:14px ;}
						.number { font-size: 13px;  i { font-size: 13px; color: #e6393d;}}
						.cjgnum {color: #666666; }
					 }
				 }
				.content_wrap { padding-top: 33px;
					.content  {  font-size: 14px; width: 776px;  overflow: auto; word-break: break-all;
						* { font-size: inherit; }
						img  { max-width: 775px;}

					}
					.action { padding-top: 77px; padding-left: 174px; padding-bottom: 106px;
						.dashang_wrap {
							&:hover { color:#ec5d35 ;}
						}
						.dianzan_wrap {
							&:hover { color:#ec5d35 ;}
						}
						.jubao_wrap{
							&:hover { color:#ec5d35 ; .jubao { color: #ec5d35;}}
						 }
						span { height: 55px; display: inline-block; font-size: 24px; margin-right:66px ;  cursor: pointer;
							i { font-size: 50px; vertical-align: middle; margin-right: 10px;}
							.dashang {}
							.dianzan {}
							.jubao { display: inline-block; text-align: center; line-height: 50px; width: 50px; height: 50px; border: 1px solid; border-radius: 50%; font-size: 30px; color: #666666;}
						};

					}
					.download_wrap { font-size: 14px;
						.download { font-size: 14px;
							a { margin-left: 4px; color: #CC0000;}
						}
					}
				 }
			}

			.detail_right {width: 300px; min-height: 643px; background: #ffffff;
				.auther_wrap {
					.auther { height: 119px; padding-top: 29px; text-align: center;
						img { width: 90px; height: 90px; border-radius: 100%;}
					}
					.name { height: 45px;  padding-top: 10px; text-align: center;
						>i { display: inline-block;font-size: 16px; text-align: right;}
						> a,span { cursor: pointer; display: inline-block; margin-left: 6px; width: 62px; height: 24px; font-size: 13px; color: #e43a3d; line-height: 24px; text-align: center; border: 1px solid #e43a3d; border-radius: 4px;}
					 	> .guanzhu { cursor: pointer; }
					 	> .yiguanzhu { cursor:pointer; border-color: #cccccc;  color: #cbcbcb; }
					 }
					 .text { padding: 0 20px; word-break: break-all; font-size: 13px; color: #676767; line-height: 20px; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;

					 }
				}
				.detail_list { padding-left:20px; padding-right: 23px; padding-top: 37px;
					.title { font-size: 17px; color: #323232; height: 41px;
						a { color: #323232;
							&:hover { color: #ec5d35;}
						}
					}
					.detail_text { height: 62px;
						.text { display: block; overflow: hidden; font-size:14px; color: #343434;  text-overflow: ellipsis; white-space: nowrap; height: 20px; line-height: 20px; width: 256px;
					 		&:hover { color: #ec5d35; }
							> span {display: inline-block; width: 0; height: 0; border: 3px solid #cdcdcd; border-radius: 50%; margin-right: 12px;}
							}
						.time { line-height: 40px; height: 40px; color: #9a9a9a; padding-left: 16px; font-size: 12px;}
					}
				}

			 }


		}
	}
</style>
