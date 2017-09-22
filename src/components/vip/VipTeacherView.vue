<template>
	<div id="vip_teacher_view" class="editor_content">
      <div class="editor">
        <div class="editor_top">
          <!-- <quill-editor v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
            <y-toolbar id="toolbar" slot="toolbar" />
          </quill-editor> -->
          <!-- <y-xheditor></y-xheditor> -->
          <textarea id="txtbody" placeholder=""></textarea>
          <!-- 常用观点 -->
          <el-popover class="cygd"
            placement="bottom-start"
            trigger="click"
            width="400">
            <el-button class="normalview_button" size="mini" slot="reference">常用观点</el-button>
            <ul class="normal-view-popver">
              <li v-for="item in normalViewList" @click="handleNormalView(item.Id)">{{ item.Content }}</li>
            </ul>
          </el-popover>
        </div>
        <span v-show="quoteId" class="editor_bottom">
          <el-tag 
            type="primary" 
            :closable="true"
            @close="handleCancelQuote"
          >引用: {{ quoteUserName }}</el-tag>
        </span>

        <div class="btn">
         	 剩余<span>1000</span>字  <button ref="submitBtn" @click="handleSubmit">发表</button>
        </div>
      </div>
    </div>
</template>

<script>
// import { quillEditor } from 'vue-quill-editor'
import { mapGetters, mapActions, mapState } from 'vuex'
// import YToolbar from '@/components/EditorToolbar'
import Api from '@/utils/Api'
import * as types from '@/store/types'
// import YXheditor from '@/components/Xheditor'

export default {
	name:'teacher-edit-view',
	data(){
		return {
			// 编辑器
      content: '',
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: '请发表您的观点'
      },
      // 单条价格
      price:5,

      // 付费观点
      isEncryptedView: false,
		}
	},
  created () {
    // 只有老师才能发付费观点
//  this.isTeacher && this.getEncryptedViewsMonthGolds(this.authToken)
    this.getNormalViewList()    //加载常用观点列表（初始化该组件时）
  },
  mounted () {
    // 初始化编辑器
    this.$nextTick(() => {
      this.txtbody = $('#txtbody').xheditor({
        "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
        "width":720,
        "height":212,
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
      $('.xheIframeArea').css('height', 181);
    })
  },
  destroyed () {
    $('#txtbody').xheditor(false)
  },
  methods: {
    handleSubmit (e) {     // 点击VIP的左侧的发表按钮
      const content = this.txtbody.getSource()
      if (!this.authToken) return false

      if (!content) return false

      const api = new Api()
        // 普通观点
        const params = {
          token: this.authToken,
          type: 1,
          id: this.$route.params.id,
          content: encodeURI(content),
          quote_id: this.quoteId,
        }
        // 禁用提交按钮
        e.target.disabled = true
        api.post('/TrainingRoom/SendMessage', params).then(resp => {
             console.log(resp)
          this.txtbody.setSource('')
          this.quoteId  && this.$store.commit(types.CANCEL_VIPLIVE_QUOTE)
          // 更新message
//        this.$store.commit(types.ADD_ROOM_MESSAGE, resp)
          e.target.disabled = false
        }).catch(error => {
          e.target.disabled = false
        })
      
    },
    // 取消引用
    handleCancelQuote () {
      this.$store.commit(types.CANCEL_VIPLIVE_QUOTE)
    },
    // 常用观点
    handleNormalView (id) {
      const api = new Api()
      api.get('Teacher/AnaDetail', { id: id }).then(resp => {
        this.txtbody.pasteHTML(resp.Content)
        // let range = this.editor.getSelection(true)
        // this.editor.clipboard.dangerouslyPasteHTML(range.index, resp.Content);
      })
    },
    ...mapActions(['getEncryptedViewsMonthGolds', 'getNormalViewList'])
  },
  computed: {
    // quill () {
    //   return this.$refs.myQuillEditor ? this.$refs.myQuillEditor.quill : null
    // },
    ...mapState({
//    quoteStatus: state => state.vip.viplive.status,
//    quoteId: state => state.viplive.quoteId,
//    quoteUserName: state => state.viplive.quoteUserName,
//    normalViewList: state => state.view.normal.list,
    }),
    ...mapGetters(['authToken', 'roomId', 'topicId', 'encryptedViewMonthGolds', 'isTeacher', 'quoteStatus', 'quoteId', 'quoteUserName', 'normalViewList'])
  },
  watch: {
    quoteStatus (flag) {
      // this.content = ''
      // this.quill.focus()
      this.txtbody.setSource('')
      this.txtbody.focus()
      // this.editorOption.placeholder = `引用${this.replyUserName}：`
    }
  },
	components: {
    // quillEditor,
    // YToolbar,
    // YXheditor,
  }
}
	
</script>

<style lang="less" >
	#vip_teacher_view { height: 369px; padding: 8px 20px;   
    .btn { margin-top: 10px ; text-align: right; 
    	span { color: #289fe3;}
      > button {  padding: 7px 39px; border: none; border-radius: 8px; background: #e43a3d; font-size: 14px; color: #FFFFFF; cursor: pointer;
      			margin-left: 10px; }
      
    }
    .editor_top { width: 100%; height: 212px; background: #FFFFFF; }
    .editor_bottom { margin-top: 0px; float: left;  margin-left: 62px;
      .encrypt { height: 18px;
        > input { vertical-align: middle; outline: none; margin-right: 5px;}
      }
      .encrypt_price { height: 40px; line-height: 40px; font-size: 13px;
        > div { display: inline-block;  background: #FFFFFF; margin-right: 10px; width: 100px; font-weight: 700; text-align: center; font-size: 16px;
              position: relative;
          > div { width: 100%; height: 100%; position: absolute; left: 0; top: 0; border: 1px solid #7EBC59;
            > span {display: block; width: 20px; height: 20px; background: url(../../assets/dagou.jpg) no-repeat; position: absolute;right: 0;
                bottom: 0;
            }
          }
        }
        > input { height: 40px; width: 46px; outline: none; border: none; font-size: 16px; padding-left: 2px;}
        > .price_opa { color: #f60305; margin-left: 20px; cursor: pointer;}
      } 
    }
    
    
    /*.normalview_button { margin-top: 10px;}*/
    
  }
  /*.quill-editor {height: 172px;}*/
  .normal-view-popver { max-height: 100px; overflow-y: auto;
    > li { height: 25px; line-height: 25px; border-bottom: 1px dashed #ccc; overflow: hidden; }
  }
	
	
	
</style>