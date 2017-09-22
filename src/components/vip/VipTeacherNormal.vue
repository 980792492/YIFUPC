<template>
  <div class="normal_view_wrap">
    <div class="chioce_wrap">
      <ul>
        <li v-for="(item, index) in normalViewList" :id="item.Id"><input :checked="item.Id == staticId" @click="checked(item.Id)" type="checkbox" name="" id="" value="" /><span>{{item.Content}}</span><i @click="del(item.Id)" class="icon iconfont icon-shanchu"></i></li>
      </ul>
    </div>
    <div class="editor_wrap">
      <!-- <div class="editor_top">
        <quill-editor v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
            <y-toolbar id="toolbar" slot="toolbar" />
          </quill-editor>
      </div> -->
      <textarea id="txtbody" placeholder=""></textarea>
    </div>
    <div class="btn_wrap">
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>
// import { quillEditor } from 'vue-quill-editor'
import { mapState, mapActions, mapGetters } from 'vuex'
// import YToolbar from '@/components/EditorToolbar'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import * as types from '@/store/types'

export default{
  name:'normal-view-set',
  data(){
    return {
      staticId: null,

      // 编辑器
      // content: '',
      // editorOption: {
      //   modules: {
      //     toolbar: '#toolbar'
      //   },
      //   placeholder: '请发表您的观点'
      // },
    }
  },
  created(){
    this.api = new Api ()
//  this.updateNormalView()
//  this.loadList()
		this.getNormalViewList()
  },
  mounted () {
    // 初始化编辑器
    this.$nextTick(() => {
      this.txtbody = $('#txtbody').xheditor({
        "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
        "width":740,
        "height":120,
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
    })
  },
  methods:{
//    加载常用观点列表
//  loadList(){
//    let params = {}
//    params.token = this.authToken
//    this.api.get('/Teacher/AnaList',params).then(resp => {
//      this.viewList = resp
//    })
//  },
//    修改常用观点修改
    checked(id){
      if( id != this.staticId){
        const api = new Api()
        api.get('Teacher/AnaDetail', { id: id }).then(resp => {
          this.txtbody.setSource(resp.Content)
          // this.editor.deleteText(0, this.editor.getLength(), 'user')
          // this.editor.clipboard.dangerouslyPasteHTML(0, resp.Content);
          this.staticId = id
        })
      } else {
        this.staticId = null
      }
    },
//    常用观点设置保存按钮
    save(){
//      更改
      const content = this.txtbody.getSource()
      if(!content){
        // alert('你是不是傻')
        return false
      }
      if (this.staticId) {
        this.updateNormalView({
          id: this.staticId,
          content: content
        }).then(() => {
          this.txtbody.setSource('')
          this.staticId = null
          this.$notify({
            title: '成功',
            message: '修改常用观点成功',
            type: 'success'
          });
        })
      } else {
//      添加
        this.addNormalView({ content: content }).then(() => {
          this.txtbody.setSource('')
          this.$notify({
            title: '成功',
            message: '添加常用观点成功',
            type: 'success'
          });
        })
      }
      
    },
//    删除某条常用观点
    del(id){
      this.removeNormalView({ id: id }).then(() => {
        if (this.staticId == id) {
          this.staticId = null
        }
        this.$notify({
          title: '成功',
          message: '删除常用观点成功',
          type: 'success'
        });
      })
    },
    ...mapActions(['getNormalViewList','updateNormalView', 'addNormalView', 'removeNormalView'])
  },
  computed: {
    // editor () {
    //   return this.$refs.myQuillEditor.quill
    // },
    ...mapState({
      normalViewList: state => state.view.normal.list,
    }),
    ...mapGetters(['authToken'])
  },
  components:{
    // quillEditor,
    // YToolbar,
  }
}
</script>

<style lang="less" scoped>
  .normal_view_wrap { padding: 10px 10px;
    .chioce_wrap { height: 80px; background: #FFFFFF; margin-bottom: 10px; border: 1px solid #c5c5c5;
      > ul { height: 100%; overflow: auto; padding: 5px 10px;
        > li { height: 26px; border-bottom: 1px dashed #5C5C5C; line-height: 26px;
          > input {display: inline-block; vertical-align: middle; margin-right: 10px; outline: none;}
          > span { display: inline-block; width: 630px; vertical-align: middle; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;}
          > i { float: right; margin-right: 10px; cursor: pointer;} 
        }
      }
    }
    .editor_wrap { height: 113px; background: #FFFFFF; }
    
    .btn_wrap { text-align: center; margin-top: 20px;
      button { width: 100px; height: 25px; border: none; background: #F87348; color: #FFFFFF; outline: none; cursor: pointer;}
    }
    
  
  }
  .quill-editor {height: 172px;}
</style>