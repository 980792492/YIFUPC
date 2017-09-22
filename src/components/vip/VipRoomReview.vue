<template>
  <div id="review" class="wrap_review">
      <textarea ref="chatTextarea" class="review-content" :class="{user_review_content: !isteacher}"  :placeholder="placeholder" maxlength="150" v-model="content"></textarea>
      <div class="review-bottom">
        <div class="icon">
          <span @click="isshow"></span>
        </div>
        <div v-if="isPic" class="pic_wrap">
          <div>
            <el-upload
              class="chat-uploader"
              :action="uploadApi"
              :headers="uploadHeaders"
              :data="{ token: authToken, category: 0 }"
              :show-file-list="false"
              :on-success="handleUpload"
              :before-upload="beforeUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="reply">
          <el-tag 
            v-show="replyId "
            type="primary" 
            :closable="true"
            @close="handleCancelReply"
        >回复: {{ replyUserName }}</el-tag>
        </div>
        <div class="button">
        <span>剩余<i>{{150 - content.length }}</i>字</span>
        <input type="button" value="发送" @click="handleSubmit" />
      </div>
    </div>
      <div v-show="faceshow"  class="face_wrap">
      <div class="title">
        <span v-for="(v, index ) in faceList" @click="change(index)" :class="{active:index== classSign}">{{v.title}}</span>
      </div>
        <div class="face-content-wrap">
          <div class="qq-face">
            <a href="javascript:void(0)" v-for="item in items" :fn="item.fn"  @click="check(item.fn)"> <img :class="{normalface: normalbig }" :src="item.url" alt="" /></a> 
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import * as types from '@/store/types'

export default {
  name:'review',
  data (){
    return{
    	
//      textarea初始化值
      content: '',
      placeholder: '尽情的聊起来吧',
      classSign: -1,
      faceshow:false,
      normalbig:false,
      faceList: [
        {title:'QQ表情'},
        {title:'常用表情'},
        {title:'新表情'}
      ],
      items:[]
    }
  },
  created(){
    this.loadface(0)
  },
  methods:{
//    控制表情框是否显示
    isshow:function (){
      this.faceshow = !this.faceshow
    },
//    加载表情
    loadface(index){
      this.items = []
      if(index == 0) {
        this.normalbig = false
        for(var i = 75 ; i < 193 ; i++ ){
          let imgmsg = {}
          imgmsg.url = "http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif"
          imgmsg.fn = "[@F_"+i+"G@]"
          this.items.push(imgmsg)
        }
      }
      if(index == 1 ){
        this.normalbig = true
        
        for(var i = 1 ; i < 75 ; i++ ){
          let imgmsg = {}
          imgmsg.url = "http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif"
          imgmsg.fn = "[@F_"+i+"G@]"
          this.items.push(imgmsg)
        }
      }
      if( index == 2 ){
        this.normalbig = true
        for(var i = 1001 ; i < 1072 ; i++ ){
          let imgmsg = {}
          imgmsg.url = "http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif"
          imgmsg.fn = "[@F_"+i+"G@]"
          this.items.push(imgmsg)
        }
      }
      
      

    },
//    更改表情标题,并加载对应表情
    change:function(index){
      // console.log(index)
      this.loadface(index)
      this.classSign = index
    },
//    选择加载出来的表情
    check(str){
      var text = this.content
      this.content = text+str
      this.faceshow = false
    },
//    上传本地图片按钮
    handleUpload (res, file) {
      Api.handleResponse(res).then(resp => {
        this.content = this.content + '[#' + resp.Url + '#]'
      }).catch(error => {
        console.log(error)
      })
    },
    beforeUpload (file) {
      const isLogin = !!this.authToken
      const isPic = file.type.match(/image.*/);
      const isLt600K = file.size / 1024 < 600;

      if (!isLogin) {
        this.$message.error('您还未登陆!');
      }
      if (!isPic) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
      }
      if (!isLt600K) {
        this.$message.error('上传图片大小不能超过 600KB!');
      }
      return isLogin && isPic && isLt600K;
    },
    // 发表评论
    handleSubmit (e) {
      if (this.content) {
        Auth.isLogin().then(() => {
          const api = new Api()
          const params = {
            token: this.authToken,
            type: 2,
            id: this.$route.params.id,
            content: this.content,
            quote_id: this.replyId || undefined ,
          }
          e.target.disabled = true
          console.log(params)
          api.post('/TrainingRoom/SendMessage', params).then(resp => {
            // 清空输入框
            this.content = ''
            this.replyId  && this.handleCancelReply()
            
            // 更新comment
//          this.$store.commit(types.ADD_ROOM_COMMENT, resp)
      			this.$store.commit(types.CANCEL_VIPCHAT_REPLY)
            e.target.disabled = false
          }).catch(() => { 
            e.target.disabled = false
          })
        }).catch(() => {
          Auth.openLoginDialog()
        })
      }
    },
    // 取消评论
    handleCancelReply () {
      this.$store.commit(types.CANCEL_VIPCHAT_REPLY)
      this.placeholder = '尽情的聊起来吧'
    }
  },
  props:{
  	status:{
  		type:Object,
  		default: function(){
  			return {}
  		}
  	}
  },
  computed:{
  	isteacher(){
  		return this.status.TeacherId == this.authUser.Id
  	},
    // 图片上传相关数据
    uploadApi () {
      return Api.getUrl('Image/Upload')
    },
    uploadHeaders () {
      return { 'Authorization': Api.getAuthorization() }
    },
    uploaddata () {
      return { 
        token: this.authToken,
        category: 0
      }
    },
    // 是否可以发图片 <老师、管理员、嘉宾>
    isPic () {
    	return  true
//    return this.authUser && 
//      (
//        // 老师
//        this.isTeacher ||
//        // 嘉宾
//        this.isInviteTeacher || 
//        // 管理员 
//        this.authUser.UserIdentity == 1
//      )
    },
//  ...mapState({
//    replyStatus: state => state.vip.status,
//    replyId: state => state.vip.replyId,
//    replyUserName: state => state.vip.replyName,
//  }),
    ...mapGetters(['authToken', 'authUser', 'roomId', 'topicId', 'isInviteTeacher', 'replyStatus', 'replyId', 'replyUserName'])
  },
  mounted(){
  	console.log(this.replyStatus)
  },
  watch: {
    replyStatus (flag) {
//  	console.log('ok')
//  	console.log(flag)
      this.content = ''
      this.$refs.chatTextarea.focus()
      this.placeholder = `回复${this.replyUserName}：`
    },
//  replyId(val){
//  	console.log(val)
//  }
  }
}
</script>

<style lang="less" scoped>
  .wrap_review { height: 100%; background: #FFFFFF; position: absolute; top: 0;
    .face_wrap { width: 245px; height: 145px; background: #F7F7F7; position: absolute; z-index: 999; top: -70px; left: 10px; border: 1px solid #A9A9A9;
        .title { padding: 2px 0; padding-left: 10px; height: 24px; border-bottom: 1px solid #A9A9A9;
            > span { padding: 2px 8px; font-size: 12px; cursor: pointer;}
            .clicktitle { background: #FF6600; color: #FFFFFF;}
        }
        .face-content-wrap { width: 100%; height: 118px; position: relative;overflow: auto; background: #FFFFFF;
            > div { position: absolute; width: 100%; height: 118px;  
                a { display: block; float: left; border:1px solid ##F1F1F1; padding: 4px; margin: 1px; font-size: 0;
                }
            }
            .qq-face {
                a {  font-size: 0; border: 1px solid #F1F1F1; padding: 0; padding: 4px;

                }
             }
            .nomal-face { 
                a {  font-size: 0; border: 1px solid #F1F1F1; padding: 0;

                }
            }
            .new-face { 
                a {  font-size: 0; border: 1px solid #F1F1F1; padding: 0;

                }
            }
            
        }
        
    }



    .review-bottom {   height: 38px;
        .icon { width: 48px; height: 100%; float: left; padding: 6px 10px;
           span { width: 24px; height: 24px; display: block; cursor: pointer; background: url(../../assets/review-icon.jpg) no-repeat; background-size: cover;} 
        }
        .button { width: 184px; float: right;  text-align: right; padding-right: 10px;
            i { color: #e43a3d;}
            input { width: 78px; height: 30px; color: #FFFFFF; background: #e43a3d; cursor: pointer; border: none; outline: none; border-radius: 5px; margin-left: 10px;}
            .isdisabled { background: #6B6B6B;}
        }
    }
  }

  .review-content { resize: none; width: 414px; height: 220px; overflow: hidden; border: none;outline: none; padding-top:10px; padding-left: 12px; padding-right: 12px;  display: block; font-size: 16px;
  				color: #666666; }
  
  .user_review_content { height: 96px !important;}
  
  
  .review-bottom {
    .pic_wrap { float: left; height: 38px; width: 48px; padding: 6px 10px; padding-left: 0; padding-top: 8px;
      > div { width: 24px; height: 24px; background: url(../../assets/upimg.png) no-repeat; background-size: contain;
        .chat-uploader { overflow: hidden; opacity: 0;}
      } 
    }
    
  }

  .normalface { width: 44px; height: 44px;}
  
  
  .active {background: #E43A3D !important; color: #FFFFFF;}

  .reply { float: left; margin-top: 5px; }
</style>