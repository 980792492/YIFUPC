<template>
	<div class="vip_chart_item" v-if="itemData">
		<div class="auther_wrap">
			<div class="img_wrap left">
				<img :src="itemData.HeadImg" alt="" />
				<span class="sanjiao" :calss="itemData.Type == 3 ? 'sanjiaovote' : '' "></span>
			</div>
			<div class="auther_name_wrap left">
				<p class="name_wrap">
            		<img class="idFlag" :src="require(`../../assets/head_${itemData.Identity}.png`)"/>
            		<span class="name">{{itemData.UserName}}</span>
            		<img v-if="itemData.StockGame" class="gameFlag" src="../../assets/game_icon.jpg">
            		<span class="time br">{{itemData.CreateDate}}</span>
          		</p>
			</div>
			<div class="action_wrap right" v-if="itemData.Type != 3">
          			<p v-if="isTeacher" class="left teacher_action_wrap"><span @click="isMore = !isMore" class="action_span">更多</span>
          											 <span v-if="isMore" class="action_span"  @click="handleQuote">引用</span>
          											 <span v-if="isMore" class="action_span"  @click="handleRemove">删除</span>
          											 <span v-if="isMore" class="action_span"  @click="handleForbid">禁言</span>
          			</p>
          			<p class="left"><span @click="handleReply">回复</span></p>
          	</div>
          	<div class="clearn"></div>
		</div>
		<!--直接发言消息-->
		<div  ref="inner" class="text_wrap" v-if="itemData.QuoteId == '' && itemData.Type !=3" v-html="switchBody(itemData.Body, '!/fwfh/330x80')">
			<!--{{itemData.Body}}-->
		</div>
		
		<!--是回复消息-->
		<div class="text_wrap" v-if="itemData.QuoteId != '' ">
			<!--消息体-->
			<div class="text_inner">
				<div class="top">
					<div class="auther_name_wrap">
						<p class="name_wrap">
            				<img class="idFlag" :src="require(`../../assets/head_${itemData.QuoteIdentity}.png`)"/>
            				<span class="name">{{itemData.QuoteUserName}}</span>
            				<span class="time right">{{itemData.QuoteCreateDate}}</span>
          				</p>
					</div>
				</div>
				<div ref="inner" class="bottom" v-html="switchBody(itemData.QuoteBody, '!/fwfh/330x80')">
					<!--{{itemData.QuoteBody}}-->
				</div>
			</div>
		  <p class="answer_text" v-html="switchBody(itemData.Body, '!/fwfh/330x80')"></p>	
		</div>
		
		
		<div class="text_wrap vote_wrap" v-if="itemData.Type == 3">
			 <span><i>+{{itemData.VoteCount}}</i>给{{voteName}}</span>投了{{itemData.VoteCount}}票
		</div>
		
		<!-- 图片弹出框 -->
		  <el-dialog title="查看大图" size="large" :visible.sync="dialogVisible">
		    <div class="dialog-img"><img :src="dialogImgSrc" /></div>
		  </el-dialog>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'	
import { switchBody } from '@/utils/Filters'
import * as types from '@/store/types'
import Api from '@/utils/Api'
export default {
	name: 'vipchartitem',	
	data() {
		return {
			isMore: false,   //判断消息体是否显示更多的操作(老师登录用)
			voteName: '',
			dialogVisible: false,
      		dialogImgSrc: null,
			
			
		}
	},
	created(){
		

	},
	mounted(){
		if(this.itemData.Type == 3){
			this.itemData.Body.replace(/^<dd>.+给<span>(.+)<\/span>/g, (m, s1) => {
				this.voteName = s1
			})
		}
		if (this.$refs.inner) {
		      let imgs = this.$refs.inner.querySelectorAll('img')
		      for (let img of imgs) {
		        // 绑定加载完成事件
		        img.onload = () => {
		          this.$emit('imgLoad')
		        }
		        // 绑定图片放大事件
		        img.onclick = () => {
		          let origin = img.getAttribute('origin');
		          if (origin) {
		            this.dialogImgSrc = origin;
		            this.dialogVisible = true;
		          }
		        }
		      }
		   }
	},
	props:{
		itemData:{
			type:Object,
			default: function(){
				return {
					
				}
			}
		}
	},
	methods:{
		action(str){
			alert(str)
		},
	    handleReply () {  // 回复
	      this.$store.commit(types.SET_VIPCHAT_REPLY, {
	        id: this.itemData.Id,
	        username: this.itemData.UserName
	      })
	      this.isMore = false
	    },
	    // 删除(vip操作接口未出)
	    handleRemove () {
	      this.$confirm('您确定要删除该评论吗？').then(() => {
	        const api = new Api()
	        api.post('Teacher/RemoveComment', {
	          token: this.authToken,
//	          topic_id: this.topicId,
	          index: this.data.Index
	        }).then(resp => {
	          this.$store.commit(types.REMOVE_ROOM_COMMENT, this.data.Index)
	          this.isMore = false
	        })
	      })
	    },
	    // 引用
	    handleQuote () {
	      this.$store.commit(types.SET_VIPLIVE_QUOTE, {
	        id: this.itemData.Id,
	        username: this.itemData.UserName
	      })
	      this.isMore = false
	    },
	    // 禁言
	    handleForbid () {
	      this.$confirm(`您确定要禁言【${this.itemData.UserName}】这个用户吗？`).then(() => {
	        const api = new Api()
	        let params = {}
	        params.token = this.authToken,
//	        params.topic_id = this.topicId,
	        params.room_id = this.vipLiveData.RoomId,
	        params.user_name = this.itemData.UserName,
	        params.user_id = this.itemData.UserId
	
	        this.addnospeechlist(params).then(() =>　{
		        	this.$notify({
		            title: '成功',
		            message: '禁言成功',
		            type: 'success'
		          })
	        	this.getnospeechlist(this.vipLiveData.RoomId)
	        })
	
	        this.isMore = false
	      })
	    },
	    switchBody,
    	...mapActions(['addnospeechlist', 'getnospeechlist'])
	    
	},
	computed:{
		isTeacher(){
			if(this.authUser && this.vipLiveData){
				return this.authUser.Id == this.vipLiveData.TeacherId
			}
		},
		
		...mapGetters(['authUser', 'vipLiveData', 'authToken'])
	}
	
}
</script>

<style lang="less"  scoped >
   				.sanjiaovote {border-bottom-color: #e8e8ff !important; }		  
.vip_chart_item {
	 overflow: hidden; width: 100%;
		.auther_wrap { height: 67px;
			.img_wrap {width: 54px; padding-top: 16px; padding-left: 5px;  height: 67px;
				img { width: 40px; height: 40px; border-radius: 50%;}
				.sanjiao {display: block; width: 0; height: 0; border-left: 6px solid transparent;border-right: 6px solid transparent; border-bottom: 6px solid #f2edf4;
   						  margin-left:15px; margin-top: 3px; }
   				.sanjiaovote {border-bottom-color: #e8e8ff !important; }		  
   						  
			}
			.auther_name_wrap { padding-top: 18px;
				.name_wrap {
					.idFlag { display: inline-block; vertical-align: middle; width: 13px; height: 13px;}
					.name { display: inline-block; vertical-align: middle; font-size: 16px; margin-left: 4px;}
					.gameFlag { display: inline-block; vertical-align: middle; margin-left: 4px;}
					.time {display: block; vertical-align: middle; font-size: 12px; color: #999999; margin-top: 4px;}
					
				}
			}
			.action_wrap { color: #5f97ea; padding-top: 20px; height: 67px;
		 		p { float: left; z-index: 99; overflow: hidden;
		 			span { display: block; padding: 2px 6px; cursor: pointer; margin-bottom: 4px; border: 1px solid #5f97ea; border-radius: 4px; }
		 		}
		 		p:nth-last-child(1) { margin-left: 10px; }
		 		
		 		.action_span { background: #FFFFFF ; cursor: pointer; position: relative; z-index: 99; }
			}
			
		}
		.text_wrap { background: #f1eef5; padding: 14px 15px; line-height: 24px; font-size: 14px; color: #666666; border-radius: 5px;
			.text_inner { padding: 10px 15px; background: #ffffff;
				.top {
					.auther_name_wrap { 
						.name_wrap {
							.idFlag { display: inline-block; vertical-align: middle; width: 13px; height: 13px;}
							.name { display: inline-block; vertical-align: middle; font-size: 16px; margin-left: 4px;}
							.gameFlag { display: inline-block; vertical-align: middle; margin-left: 4px;}
							.time {display: inline-block; vertical-align: middle; font-size: 12px; color: #999999; margin-left: 13px;}
						}
					 }
				}
				.bottom { line-height: 20px; font-size: 14px; word-break: break-all;}
			}
			.answer_text { line-height: 20px; font-size: 14px; margin-top: 4px; word-break: break-all;}
	}
	.vote_wrap {  background: #e8e8ff; font-size: 14px; 
		span { font-size: 14px;
			i { font-size: 24px; color: #CC0000; margin-right: 8px;}
		}
	
	}
	
	/*// 图片放大*/
    .dialog-img { text-align: center; }
}	

</style>