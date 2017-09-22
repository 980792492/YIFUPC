<template>
<div v-if="type > 0" class="right-item">
  <div class="inner-top">
    <div class="assets-wrap left">
      <img :src="data.HeadImg" width="40" alt="" />
      <span :class="type == 3 ? 'votecolor' : type == 4 ? 'giftcolor' : '' "></span>
    </div>
    <div class="title left">
      <p><img :src="require(`../../assets/head_${data.Identity}.png`)"/><span>{{ data.UserName }}</span></p>
      <p class="time">{{ data.CreateDate }}</p>
    </div>
    <div v-if="type === 1 || type === 2" class="action right">
      <span v-if="isTeacher || isInviteTeacher" @click="more">更多</span>
      <span @click="handleReply">回复</span>
      <div v-show="moreflag" class="more-item">
        <p @click="handleQuote">引用</p>
        <!-- <p>@TA</p> -->
        <p @click="handleRemove">删除</p>
        <p @click="handleForbid">禁言</p>
      </div>
    </div>
  </div>
  <div ref="inner" :class="{bottom_wrap:type != 3 && type != 4 }" >
    <!-- 普通聊天 -->
    <div v-if="type === 1" class="normal">
      <p class="rich_text" v-html="switchBody(data.Body, '!/fwfh/330x80')" ></p>
    </div>
    <!-- 回复聊天 -->
    <div v-else-if="type === 2" class="quote" >
      <div class="top_wrap">
        <div class="title">
          <p class="left left_p"><img :src="require(`../../assets/head_${data.ReplyIdentity}.png`)"/><span>{{ data.ReplyUserName }}</span></p>
          <p class="right right_p">{{ data.ReplyDateTime }}</p>
        </div>
        <p class="text rich_text" v-html="switchBody(data.ReplyComment, '!/fwfh/330x80')"></p>
      </div>
      <p class="rich_text" v-html="switchBody(data.Body, '!/fwfh/330x80')"></p>
    </div>
    <!-- 投票 -->
    <div v-else-if="type === 3" class="vote"><span>+{{ data.VoteCount }}</span>给{{ voteUserName }}投了{{ data.VoteCount }}票</div>
    <!-- 送礼物 -->
    <div v-else-if="type === 4" class="gift">
      <p v-for="name in data.ToUserName.split(',')" v-if="name"><img :src="data.ToHeadImg" />送给{{ name }}<span>{{ data.GiftName }}</span></p>
    </div>
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
import Api from '@/utils/Api'
import * as types from '@/store/types'

export default {
  name:'chat',
  data: function () {
    return {
      moreflag: false,
      voteUserName: null,
      dialogVisible: false,
      dialogImgSrc: null,
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
  created () {
    this.handleData()
  },
  mounted () {
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
  methods: {
    more(){
      this.moreflag = !this.moreflag
    },
    handleData () {
      switch (this.data.Type*1) {
        case 103 :
          // 处理投票
          this.data.Body.replace(/^<dd>.+给<span>(.+)<\/span>/g, (m, s1) => {
            this.voteUserName = s1
          })
          break
      }
    },
    // 引用
    handleQuote () {
      this.$store.commit(types.SET_LIVE_QUOTE, {
        id: this.data.Index,
        username: this.data.UserName
      })
      this.moreflag = false
    },
    // 回复
    handleReply () {
      this.$store.commit(types.SET_CHAT_REPLY, {
        id: this.data.Index,
        username: this.data.UserName
      })
      this.moreflag = false
    },
    // 删除
    handleRemove () {
      this.$confirm('您确定要删除该评论吗？').then(() => {
        const api = new Api()
        api.post('Teacher/RemoveComment', {
          token: this.authToken,
          topic_id: this.topicId,
          index: this.data.Index
        }).then(resp => {
          this.$store.commit(types.REMOVE_ROOM_COMMENT, this.data.Index)
          this.moreflag = false
        })
      })
    },
    // 禁言
    handleForbid () {
      this.$confirm(`您确定要禁言【${this.data.UserName}】这个用户吗？`).then(() => {
        const api = new Api()
        let params = {}
        params.token = this.authToken,
        params.topic_id = this.topicId,
        params.room_id = this.roomId,
        params.user_name = this.data.UserName,
        params.user_id = this.data.UserId

        this.addnospeechlist(params).then(() =>　{
	        	this.$notify({
	            title: '成功',
	            message: '禁言成功',
	            type: 'success'
	          })
        		this.getnospeechlist(this.roomId)
        })

        this.moreflag = false
      })
    },
    switchBody,
    ...mapActions(['addnospeechlist', 'getnospeechlist'])
  },
  computed: {
    // 消息类型
    type () {
      switch (this.data.Type*1) {
        case 103:
          return 3
        case 104:
          return 4
        case 6:
          return this.data.ReplyId < 0 ? 1 : 2
        default:
//        console.log('unknow type comment')
//        console.log(this.data)
          return 0
      }
    },
    ...mapGetters(['isTeacher', 'isInviteTeacher', 'authToken', 'topicId', 'roomId'])
  },


}
</script>
<style lang="less" scoped>
.right-item {  padding-right: 30px;
      .inner-top { height: 66px; padding-top: 15px;
          .assets-wrap { width:60px; height: 100%; text-align: center;
              img { width: 40px; height: 40px; border-radius: 50%;}
              span { display: block;  width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent;
                               border-bottom: 8px solid #F0F0F8; margin: 0 auto; }
          }
          .title {width: 150px; height: 100%;
          		> p { color: #666666;}
              > p:nth-child(1) {
                  img { vertical-align: middle; margin-right: 10px;}
                  .gameflag { vertical-align: middle; margin-right: 10px; margin-left: 10px;}
                  span { vertical-align: middle; font-size: 14px; color: #888;}
              }
              > p:nth-child(2) { line-height: 20px; color: #999999;}
           }
          .action { width: 100px;  height: 100%; padding-top: 15px; text-align: right; position: relative;
              > span { padding: 2px 5px ; border: 1px solid #5d99f1; font-size: 12px; color: #5d99f1; border-radius: 2px; cursor: pointer;}
              > .more-item { position: absolute; left: 24px;  top: 36px;
                  p { cursor: pointer; border: 1px solid #5d99f1; padding: 1px 2px; margin:2px 0; background: #FFFFFF; text-align: center; font-size: 12px; color: #5d99f1; border-radius: 2px;}
              }
           }
      }




  .bottom_wrap { width: 358px; background: #f0f0f8; padding: 14px 14px; border-radius: 4px;
  			> .normal { width: 100%;
        	> p { width: 100%; height: 100%; font-size: 15px; color: #262626; line-height: 24px; border-radius: 4px; word-break: break-word;

        		white-space: pre-wrap;       /* css-3 */
 						white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        	}
  			}

        > .quote {  background: #F0F0F8; border-radius: 4px;
            .top_wrap { min-height:60px; background: #Fcfcff;padding: 2px 14px 5px; border-radius:4px;/* margin-bottom: 8px;*/
                .title {  height: 34px;
                    .left_p {width:150px; height: 100%; line-height: 34px;
                    	> img { margin-right: 10px;}
                    	span { font-size: 14px; color: #999;}
                    }
                    .right_p { width: 136px; height: 100%; color: #9a9a9a; line-height: 34px; text-align: right;}
                }
                .text { color: #666; font-size: 14px;}

            }
            > p { line-height: 22px; color: #262626; font-size: 15px; background: #F0F0F8; padding-top: 6px;}
        }

    }

    .gift { background: #fdd9e7; width: 358px; min-height: 56px; border-radius: 3px;
            p { padding:10px; font-size: 14px; color: #666; font-weight: 900;
                img { width: 100px; height:90px; vertical-align: middle; margin-right: 10px;}
                span { color: #e43a3d; font-size: 14px; }
            }
        }
    .vote { min-height: 60px; background: #eae8fe; padding:10px; border-radius: 4px; font-size: 14px; color: #696367; font-weight: 900;
        span {color: #e6393d; font-size: 24px; margin-right: 15px; }
    }
    .giftcolor { border-bottom-color:#fed8e7!important;}
    .votecolor { border-bottom-color:#eae8fe!important;}

    /*// 图片放大*/
    .dialog-img { text-align: center; }

}
</style>
