<template>
<div class="inner_right">
  <!-- 普通用户评论 -->
  <div v-if="!isTeacher && !isInviteTeacher">
    <div class="title">
      <a @click="checktitle('chat')"  :class="{titlecolor: titlename === 'chat'}">评论</a>
      <a @click="checktitle('paper')" :class="{titlecolor: titlename === 'paper'}">问答</a>
      <a href="//pay.yifucj.com" target="_blank">充值</a>
      <div class="clearn"></div>
    </div>
    <div class="wrap">
      <review v-show="titlename === 'chat'"></review>
      <div v-show="titlename === 'paper' && !(paperFreeNum ==  0 && paperPrice == 0)" class="wrap_scrip">
      	<!--新的-->
      	<textarea name="" rows=""  v-model="paperContent"  cols="" placeholder="请输入提问问题"></textarea>
      	<p class="action_wrap">
      		<span class="left">老师当前设置的问答价格为<i>{{paperPrice}}</i>G币/次</span> <button  @click="handlePaper" class="right">提交</button>
      	</p>
      </div>
      <div class="end_free_num" v-show="titlename === 'paper' && paperFreeNum ==  0 && paperPrice == 0">
      	
      	<div class="icon_wrap left">
      		<img src="../../assets/jz.png"/>
      	</div>
      	<div class="warning_wrap left">
      		<p>您今日的免费提问次数已用完 </p>
      		<p>您可以在评论区跟老师互动</p>
      	</div>
      	
      </div>
    </div>
  </div>
  <!-- 老师评论 -->
  <div v-else>
    <div class="title-teacher">
     	<div @click="checkItem('hudong')" class="hudong left" :class="{activecolor: checkedItem == 'hudong'}"><span>右侧互动</span></div><div @click="checkItem('wenda')"  class="wenda right" :class="{activecolor: checkedItem == 'wenda' }"><span>问答设置</span></div> 
    </div>
    <div class="wrap">
      <review v-if="checkedItem == 'hudong'"></review>
      <div class="wenda_set">
      	<p class="num_wrap">当前的价格为<span>{{paperPrice}}</span>G币/次</p>
      	<p class="btn_wrap"><input type="text" v-model="newprice" placeholder="请输入要设置的新价格" /><button @click="changeprice">提交</button></p>
      </div>
    </div>
    <div class="teacher_all_use">
      <teacher-order></teacher-order>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions , mapGetters } from 'vuex'
import Review from '@/components/room/Review'
import TeacherOrder from '@/components/room/TeacherOrder'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'

export default {
  data() {
    return {
      titlename: 'chat',
      // 纸条
      paperPriceOptions: [2, 5, 8, 18],
      paperPrice: 2,     //免费问答价格
      paperFreeNum: 3,    //免费问答的剩余次数
      paperContent: '',
      paperContentMaxLength: 100,
      
      checkedItem:'hudong',
      oldprice:'',
      newprice:''
    }
  },
  created () {
    this.api = new Api()
  },
  methods: {
  	checktitle(str){

  		if(str == 'paper'){
  			 //		判断是否登陆
  			
				if( !this.authUser ) {
					Auth.openLoginDialog()
					return false
				}
  			let params = {}
  			params.teacher_id = this.teacherId
  			params.token = Auth.getToken()
  			this.api.get('Ask/Price', params).then( resp => {
  				this.paperPrice = resp.Price
					this.paperFreeNum = resp.RemainingCount
  			})
  		}
  		this.titlename = str
  		
  	},
    // 发送纸条
    handlePaper: function () {
      Auth.isLogin().then(() => {
        // 提问内容不为空
        if (!this.paperContent) {
          return false
        }

        // 发纸条确认
        this.$confirm(`该纸条共计消费${this.paperPrice}个G币，请确认支付`).then(_ => {
          // 发纸条请求
          this.api.post('/Ask/SendQuestion', {
            token: Auth.getToken(),
						teacher_id: this.teacherId,
            content: this.paperContent,
          }).then(resp => {
            this.paperContent = ''
						this.paperFreeNum = resp.RemainingCount
            this.$notify.success({
              title: '成功',
              message: '纸条发送成功'
            })
          })
        })
      }).catch(() => {
        Auth.openLoginDialog()
      })
      
      
    },
    checkItem(str){
    	this.checkedItem = str
			if(str == 'wenda'){
				Auth.isLogin().then(() => {
					let params = {}
  				params.teacher_id = this.teacherId
  				this.api.get('Ask/Price', params).then( resp => {
  					this.paperPrice = resp.Price
  				})
				})
			}
    	
    },
    changeprice(){
    	let params = {}
    	params.token = Auth.getToken()
    	params.price = this.newprice
    	
    	this.api.post('/Ask/SetPrice', params).then(resp => {
    			this.newprice = ''
    			this.checkItem('wenda')
    			 this.$notify.success({
              title: '成功',
              message: '成功设置问答价格'
           })
    	})
    	
    	
		}
  },
  computed: {
    paperContentLength () {
      return this.paperContentMaxLength - this.paperContent.length
    },
    ...mapGetters(['roomId','authUser', 'topicId', 'isTeacher', 'teacherId', 'isInviteTeacher', 'isManger'])
  },
  components: {
    Review,
    TeacherOrder,
  }
}
</script>

<style lang="less" scoped>
.inner_right { width: 414px; background: #f7f7f7;
  .title { border-top: 1px solid #e2e2e2;

      > a {float: left; width:138px ; text-align: center; height: 40px;border-right: 1px solid #E2E2E2; border-bottom: 2px solid #e3e3e3; padding-top: 10px; cursor: pointer;
          &:hover { color: #e43a3a;}
      }
      > a:nth-child(3) { border-right: none;}

      .titlecolor { border-bottom: 2px solid #e43a3a; color: #e43a3a;}

  }
  .title-teacher { height: 40px; line-height: 40px; border-top:1px solid #dadada; font-size: 14px; background: #f7f7f7 !important;
  	.hudong, .wenda { height: 40px; width:50%; text-align: center; border-bottom:3px solid #F7F7F7;
  		span { display: inline-block; width: 100%; height: 20px; line-height: 20px;}
  		
  	}
  	.hudong {
  			span { border-right:2px solid #e7e7e7;}
  		}	
  	
  	.activecolor { border-color: #e43a3d;}
  	
  	
  }
  .wrap { height: 120px; position: relative;
    .wrap_scrip { width: 414px; height: 100%; position: absolute;top: 0; background: #ffffff; padding-left: 14px; padding-top: 4px;
    		textarea { width: 400px; height:80px ; resize: none; border: none; outline: none; }
    		.action_wrap { height: 30px; 
    			span { font-size: 14px; padding-top: 5px; color: #676767; i { color: #e33a3d; font-size: 14px;}}
    			button { background: #e43a3d; color: #ffffff; width: ; width: 78px; height: 30px; border: none; border-radius: 5px; font-size: 14px;}
    		}
    }
     
    .end_free_num {  width: 414px; height: 100%; background: #ffffff; padding-top: 38px; padding-left: 86px;
    	.icon_wrap { width:40px ; height: 40px; margin-right: 9px;
    		img { width: 40px; height: 40px;}
    	}
    	.warning_wrap { width: 190px; height: 40px; 
    		p { line-height: 18px; font-size: 14px; color: #999999;  }
    	}
    
    
    
    }
    
    
    
    
    
   .wenda_set { background: #FFFFFF; width: 100%; height: 100%; padding-left: 14px;
   		.num_wrap { padding-top: 26px; padding-bottom: 21px; font-size: 14px; color: #666666; span { font-size: 14px; color: #e43941;}}
   		.btn_wrap { height: 30px;
   			input { width: 288px; height: 30px; border: 1px solid #DDDDDD; outline: none;  padding-left: 10px;}
   			button { width: 78px; height: 30px;  border: none; border-radius: 5px; background: #e43a3d; font-size: 14px; color: #FFFFFF; margin-left: 11px; outline: none; cursor: pointer;}
   		}
   
   } 
    
  }
}


</style>
