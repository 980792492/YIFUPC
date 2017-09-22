<template>
  <div class="normal_view_wrap">
    <div class="chioce_wrap">
      <ul>
        <li v-for="(item, index) in normalViewList" :id="item.Id"><input :checked="item.Id == staticId" @click="checked(item.Id)" type="checkbox" name="" id="" value="" /><span>{{item.Content}}</span><i @click="del(item.Id)" class="icon iconfont icon-shanchu"></i></li>
      </ul>
    </div>
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
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import EditorMixin from '@/mixins/EditorMixin'
import * as types from '@/store/types'

export default{
  name:'normal-view-set',
  mixins: [EditorMixin],
  data(){
    return {
      staticId: null,

      // 编辑器
      content: '',
      editorOption: {
        placeholder: '请发表您的观点'
      },
    }
  },
  created(){
    this.api = new Api ()
  },
  methods:{
//    修改常用观点修改
    checked(id){
      if( id != this.staticId){
        this.api.get('Teacher/AnaDetail', { id: id }).then(resp => {
          this.setContent(resp.Content)
          this.staticId = id
        })
      } else {
        this.staticId = null
      }
    },
//    常用观点设置保存按钮
    save(){
//      更改
      const content = this.getContent()
      if(!content){
        return false
      }
      if (this.staticId) {
        this.updateNormalView({
          id: this.staticId,
          content: content
        }).then(() => {
          this.setContent('')
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
          this.setContent('')
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
    ...mapActions(['updateNormalView', 'addNormalView', 'removeNormalView'])
  },
  computed: {
    ...mapState({
      normalViewList: state => state.view.normal.list,
    })
  },
}
</script>

<style lang="less" scoped>
  .normal_view_wrap { padding: 10px 10px;
    .chioce_wrap { height: 90px; background: #FFFFFF; margin-bottom: 10px; border: 1px solid #c5c5c5;
      > ul { height: 100%; overflow: auto; padding: 5px 10px;
        > li { height: 26px; border-bottom: 1px dashed #5C5C5C; line-height: 26px;
          > input {display: inline-block; vertical-align: middle; margin-right: 10px; outline: none;}
          > span { display: inline-block; width: 630px; vertical-align: middle; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;}
          > i { float: right; margin-right: 10px; cursor: pointer;}
        }
      }
    }
    .editor_wrap { height: 213px; background: #FFFFFF; }

    .btn_wrap { text-align: center; margin-top: 10px;
      button { width: 100px; height: 25px; border: none; background: #F87348; color: #FFFFFF; outline: none; cursor: pointer;}
    }


  }
  .quill-editor {height: 172px;}
</style>
