<template>
<div class="item" :class="isMy" v-if="isView">
	<div class="question">
		<div class="left">
			<div class="question-icon">
				<span>问</span>
			</div>
			<div class="title">
				<p>{{ data.UserName }}： <span>{{ data.CreateDate }}</span></p>
				<p>{{ data.Body }} <span class="price" v-if="data.Gold > 0">[ {{data.Gold}}G币 ]</span></p>
			</div>
		</div>
    <!-- 学生 -->
		<div v-if="!isTeacher && !isInviteTeacher" :class="{my_paper:isMy}"></div>
    <!-- 老师 -->
		<div v-else v-show="!hasAnswer" class="icon">
			<p>未回答</p>
		</div>
	</div>
	<div class="answer">
		<div class="question-icon">
			<span>答</span>
		</div>
		<div class="text">
      <!-- 学生 -->
      <div v-if="!isTeacher && !isInviteTeacher">
        <!-- 未回答 -->
  		<p v-if="data.Status == 0">老师暂未回答</p>
        <!-- 已回答并是已消费的纸条 -->
        <!--<p v-if="isShow">{{ answerUserName }}：<span>{{ content }}</span></p>-->
        <p v-if="data.Status == 1 && data.CanLook == 1">{{ answerUserName }}：<span>{{ content }}</span></p>
        
        <!-- 已回答 -->
  			<p v-if="data.Status == 1 && data.CanLook == 0"><a href="javascript:;" @click="handleLook">老师已回答，点我查看答案</a></p>
      </div>
			<!--老师-->
      <div v-else-if="data.Status == 0">
  			<a @click="showAnswerBox = !showAnswerBox" v-if="!showAnswerBox" href="javascript:void(0)">立刻回答该纸条</a>
  			<div v-show="showAnswerBox" class="lijianswer_text">
  				<textarea maxlength="100" v-model="content"></textarea>
  				<div class="btn_wrap right">
  					<span>限{{ leftLength }}字</span>
  					<button @click="handleSubmit">发送</button>
  				</div>
  			</div>
      </div>
      <div v-else>
        <p class="anser">{{ answerUserName }}：<span>{{ content }}</span></p>
      </div>
		</div>
	</div>		
</div>
</template>

<script>
import { mapGetters , mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
  data: function () {
	  return {
      isView: false,            // 是否显示该纸条
      showAnswerBox: false,
      leftLength: 100,
      hasAnswer: this.data.AnswerUserId > 0,
      content: this.data.AnswerBody,
      answerUserName: this.data.AnswerUserName,
      isShow: false,
	  }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  // 未登陆——显示已回答的
  // 已登陆（老师）—— 全部
  // 已登陆（学生）—— 显示自己提问的和老师已回答的
  created: function() {
  	console.log(this.authUser)
    if (this.authUser) {
      // 已登陆
      if (this.isTeacher || this.isInviteTeacher) {
        // 老师
        this.isView = true
      } else {
        // 学生
        if (this.hasAnswer || this.isMy) {
          this.isView = true
        }
        // 如果是自己的纸条，就直接显示，不是自己的纸条，就需要点击才能显示
        this.isShow = this.isMy
      }
    } else {
      // 未登陆
      if (this.hasAnswer) {
        this.isView = true
      }
    }

// console.log(this.data)
  },
  methods: {
    handleSubmit () {
//	  var that = this
      if (this.content) {
        const api = new Api()
        const params = {
          token: this.authToken,
//        topic_id: this.topicId,
//        index: this.data.PaperIndex,
//        body: this.content
		  id: this.data.Id,
		  answer: this.content
        }
        api.post('/Ask/Answer', params).then(resp => {
          this.showAnswerBox = false
          this.hasAnswer = true
          this.answerBody = this.content
          this.answerUserName = this.authUser.UserName
		      this.initGoods()
		      this.getPapers({token: this.authToken})
        }).catch(error => {

        })
      }
    },
    handleLook () {
      Auth.isLogin().then(() => {
        const api = new Api()
        const params = {
          token: this.authToken,
//        topic_id: this.topicId,
//        paper_id: this.data.PaperIndex,
		  id: this.data.Id 
        }
        api.get('/Ask/UnlockInfo', params).then(resp => {
//        if (resp.Look == 1) {
            // 可查看
//          this.content = resp.Content
//          this.isShow = true
//        } else {
            // 未购买
            this.$confirm(`消费${Math.ceil(resp.Gold)}G币可以查看该纸条，请确认消费`).then(() => {
              // Room/BuyPaper
              const params = {
                token: this.authToken,
//              topic_id: this.topicId,
//              paper_index: this.data.PaperIndex,
				id: this.data.Id
              }
              api.post('/Ask/UnLock', params).then(resp => {
                this.content = resp.Answer
                this.answerUserName = resp.AnswerUserName
                this.isShow = true
                this.getPapers({token: Auth.getToken()})
              }).catch(error => {

              })
            }).catch(() => {
              
            })
//        }
        })
      }).catch(() => {
        Auth.openLoginDialog()
      })
      
    },
    handlePay () {
      
    },
    ...mapActions(['initGoods', 'getPapers'])
  },
  computed: {
    // 是否自己的纸条
    isMy () {
      return this.authUser && this.data.UserId == this.authUser.Id
    },
    ...mapGetters(['authUser', 'authToken', 'topicId', 'isTeacher', 'isInviteTeacher'])
  },
  watch: {
    content (text) {
      this.leftLength = 100 - text.length
    }
  }
}
</script>

<style lang="less" scoped>
.otherpaper { background: #F9F9F9 !important;}

.item { margin-bottom: 7px; margin-top: 8px;  width: 690px;  padding-left:22px; padding-bottom: 10px; background: #fdefef;
    .question { width: 100%;  overflow: hidden;
        > .left {  width: 568px; float: left;
            > .title { padding-top:12px ; float: left; font-size: 14px;
    /*.question { width: 100%; overflow: hidden;
        > .left { width: 599px;  overflow: hidden; float: left;
            > .title {  width: 562px; padding-top:12px ; float: left;*/
               > p { line-height: 28px; width: 529px; word-wrap:break-word; font-size: 14px; color: #666666;}
               .price { font-size: 14px; color: #F30001; margin-left: 5px;}
               
            }
            .question-icon { width: 37px; height: 42px;padding-top: 12px; float: left;
                >span { display: block; width: 28px; height: 28px; background: #e4393f; color: #FFFFFF; text-align: center; line-height: 28px; border-radius: 50%;
                }
            }
        }
       > .my_paper { width: 69px; height: 72px; background: url(../../assets/my_paper.jpg) no-repeat; background-size: cover; float: right; }
    	.icon { width: 100px;  height: 68px; overflow: hidden;
    		> p { background: #e43a3d; color: #FFFFFF; text-align: center;height: 20px; line-height: 20px; transform: rotate(45deg); margin-right: -52px; margin-top: 13px;}
    	}
    }
    .answer {  overflow: hidden;
        > .question-icon { width: 37px;  float: left; padding-top: 2px;
            > span { display: block; width: 28px; height: 28px; background: #e4393f; color: #FFFFFF; text-align: center; line-height: 28px; border-radius: 50%;
                }
        }
        .text { width: 631px;  padding-right: 28px; float: left;
        	 * { font-size: 14px; color: #666666;}
            p { line-height: 28px;}
            a { color: #648ef4; padding-top: 5px; display: block; font-size: 14px; }
           	.lijianswer_text { width: 574px; height: 98px; background: #FFFFFF; border:1px solid #facbd5; 
                > textarea { width: 572px; height: 58px; resize: none; border: none; outline: none; }
                .btn_wrap { width: 150px;
                    > span { display: inline-block; width: 60px; line-height: 30px; color: #d2d2d2;}
                    > button { width: 78px; height: 30px; background: #6098ed; border: none; border-radius: 4px; cursor: pointer; outline: none; color: #FFFFFF;}
                }
            }
        }
    }
}


</style>