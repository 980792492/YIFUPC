<template>
  <div class="addtoCjg_wrap">
    <p class="title_wrap">
      <select name="" placeholder="选择你要修改的cjg" v-model="checkOp"  >
        <option v-for="(item, index) in cjgList"  :value="item.Id">【{{item.CreateDate.substr(0, 10)}}】{{item.Title}}</option>
      </select>
      <span>此处仅用于未结束的藏金阁，查看所有的藏金阁请点击<a target="_blank" :href="`//home.yifucj.com/${teacherId}/Cjg/NewIndex`">管理藏金阁>></a></span>
    </p>
    <div v-if="!isOld" class="editor_wrap">
      <div class="editor_top">
        <y-quill-editor v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
            <y-toolbar id="toolbar" slot="toolbar" />
          </y-quill-editor>
      </div>
    </div>
    <div v-else class="editor_wrap">
      <textarea id="txtbody" placeholder=""></textarea>
    </div>
    <div class="btn_wrap">
      <span>注意：提交前请仔细检查，提交后无法修改</span><button  @click="save">提交</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import EditorMixin from '@/mixins/EditorMixin'

export default {
  name:'addto-cjg',
  mixins: [EditorMixin],
  data(){
    return{
      checkOp:'',
      cjgList:[],

      // 编辑器
      content: '',
      editorOption: {
        placeholder: '请发表您的观点'
      },
    }
  },
  created(){
    this.api = new Api()
    this.loadList()
  },
  methods:{
//    加载可以修改的藏金阁的列表
    loadList(){
      let params = {}
      params.token = Auth.getToken()
      this.api.get('/Teacher/Cjg', params).then(resp => {
        this.cjgList = resp
      })
    },
//    修改后保存操作
    save(){
      if (!this.authToken) return false

      const content = this.getContent()
      if (!content) return false

      if (!this.checkOp) return false

      let params = {}
      params.token = this.authToken
      params.id = this.checkOp
      params.content = encodeURIComponent(content)
      this.api.post('/Teacher/UpdateCjg', params).then(resp => {
        this.setContent('')
        this.$notify({
          title: '成功',
          message: '追加藏金阁成功',
          type: 'success'
        });
      })
    }
  },
  computed: {
    ...mapGetters(['authToken', 'teacherId'])
  }
}
</script>

<style lang="less" scoped>
.addtoCjg_wrap {  padding: 10px 20px;
  .title_wrap { line-height: 40px;
    > select { margin-right: 20px; padding-right: 5px; width: 200px; outline: none;}
    > span {
      > a { color: #ff6633;}
    }
  }
  .editor_wrap {
       .editor_top { width: 100%; height: 214px; background: #FFFFFF; }
  }
  .btn_wrap {  padding-top: 30px;
    > span { color: #ff0000;}
    > button { width: 100px; height: 25px; border: none; background: #F87348; color: #FFFFFF; cursor: pointer; margin-left: 80px; outline: none;}
  }

}
.quill-editor {height: 172px;}
</style>
