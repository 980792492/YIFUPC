<template>
	<div class="editor_content">
      <div class="editor">
        <!-- 非ie浏览器使用最新编辑器 -->
        <div v-if="!isOld" class="editor_top">
          <y-quill-editor v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
            <y-toolbar id="toolbar" slot="toolbar" />
          </y-quill-editor>
        </div>
        <!-- over -->
        <!-- ie浏览器使用旧版编辑器 -->
        <div v-else class="editor_top">
          <textarea id="txtbody" placeholder=""></textarea>
          <!-- 常用观点 -->
          <el-popover
            placement="bottom-start"
            trigger="click"
            width="400">
            <el-button size="mini" slot="reference">常用观点</el-button>
            <ul class="normal-view-popver">
              <li v-for="item in normalViewList" @click="handleNormalView(item.Id)">{{ item.Content }}</li>
            </ul>
          </el-popover>
        </div>
        <!-- over -->
        <div v-if="isTeacher" v-show="quoteId == -1" class="editor_bottom">
          <el-checkbox v-model="isEncryptedView">设置此条观点加密</el-checkbox>
          <div class="encrypt_price">
            加密观点价格 ：
            <div  class="price_wrap" v-for="item in priceitems"  @click="price = item">{{item}}G币 <div v-show="item == price"><span></span></div></div>
            其他：
            <input type="text" v-model="price" /> 至少5G币，包月价格:<span>{{ encryptedViewMonthGolds > 0 ? encryptedViewMonthGolds : '不提供包月服务' }}</span> <a class="price_opa" @click="handleSet">设置</a>
          </div>
        </div>
        <div v-show="quoteId > -1" class="editor_bottom">
          <el-tag
            type="primary"
            :closable="true"
            @close="handleCancelQuote"
          >引用: {{ quoteUserName }}</el-tag>
        </div>

        <div class="btn">
          <button ref="submitBtn" @click="handleSubmit">提交</button>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Api from '@/utils/Api'
import EditorMixin from '@/mixins/EditorMixin'
import * as types from '@/store/types'

export default {
	name:'teacher-edit-view',

  mixins: [EditorMixin],

	data(){
		return {
			// 编辑器
      content: '',
      editorOption: {
        placeholder: '请发表您的观点'
      },
      // 加密观点价格
      priceitems:[20, 50],
      // 单条价格
      price:20,

      // 付费观点
      isEncryptedView: false,
		}
	},
  created () {
    // 只有老师才能发付费观点
    this.isTeacher && this.getEncryptedViewsMonthGolds(this.authToken)

  },
  methods: {
    handleSubmit (e) {
      if (!this.authToken) return false

      const content = this.getContent()
      if (!content) return false

      const api = new Api()
      if (this.isEncryptedView) {
        // 付费观点
        const params = {
          token: this.authToken,
          room_id: this.roomId,
          topic_id: this.topicId,
          body: encodeURIComponent(content),
          golds: this.price
        }
        // 禁用提交按钮
        e.target.disabled = true
        api.post('EncryptedView/SendEncryptedViewPoint', params).then(resp => {
          this.isEncryptedView = false
          this.setContent('');
          e.target.disabled = false
        }).catch(error => {
          e.target.disabled = false
        })
      } else {
        // 普通观点
        const params = {
          token: this.authToken,
          room_id: this.roomId,
          topic_id: this.topicId,
          content: encodeURIComponent(content),
          quote_index: this.quoteId,
        }
        // 禁用提交按钮
        e.target.disabled = true
        api.post('Room/SendMessage', params).then(resp => {
          // console.log(resp)
          this.setContent('');
          this.quoteId > -1 && this.$store.commit(types.CANCEL_LIVE_QUOTE)
          // 更新message
          this.$store.commit(types.ADD_ROOM_MESSAGE, resp)
          e.target.disabled = false
        }).catch(error => {
          e.target.disabled = false
        })
      }
    },
    // 取消引用
    handleCancelQuote () {
      this.$store.commit(types.CANCEL_LIVE_QUOTE)
    },
    // 设置包月价格
    handleSet () {
      this.$prompt('请输入需要设置的包月价格', '提示', {
        inputPattern: /[\d]+/,
        inputErrorMessage: '必须为数字',
      }).then(({ value }) => {
        const api = new Api()
        api.post('EncryptedView/SetMonthGold', {
          token: this.authToken,
          golds: value,
          topic_id: this.topicId
        }).then(resp => {
          this.$store.commit(types.UPDATE_ENCRYTED_VIEW_MONTH_GOLDS, resp.MonthGolds)
        })
      })
    },
    // 常用观点——xheditor
    handleNormalView (id) {
      const api = new Api()
      api.get('Teacher/AnaDetail', { id: id }).then(resp => {
        this.setContent(resp.Content)
      })
    },
    ...mapActions(['getEncryptedViewsMonthGolds'])
  },
  computed: {
    ...mapState({
      quoteStatus: state => state.view.live.status,
      quoteId: state => state.view.live.quoteId,
      quoteUserName: state => state.view.live.quoteUserName,
      normalViewList: state => state.view.normal.list,
    }),
    ...mapGetters(['authToken', 'roomId', 'topicId', 'encryptedViewMonthGolds', 'isTeacher'])
  },
  watch: {
    quoteStatus (flag) {
      this.setContent('')
      this.editor.focus()
    }
  }
}

</script>

<style lang="less" scoped>
	.editor_content { height: 369px; padding: 16px 20px;
    .btn { margin-top: 10px ; text-align: center;
      > button {  padding: 9px 39px; border: none; background: #fb7a50; color: #FFFFFF; cursor: pointer;}
    }
    .editor_top { width: 100%; height: 212px; background: #FFFFFF; }
    .editor_bottom { margin-top: 30px;
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
  }
  .quill-editor {height: 172px;}
  .normal-view-popver { max-height: 100px; overflow-y: auto;
    > li { height: 25px; line-height: 25px; border-bottom: 1px dashed #ccc; overflow: hidden; }
  }

</style>
