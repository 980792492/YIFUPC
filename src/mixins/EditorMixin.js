import Web from '@/utils/Web'
import YQuillEditor from '@/components/editor/QuillEditor'
import YToolbar from '@/components/editor/Toolbar'

/** 编辑器混合器，兼容新老版本编辑器
 * 使用注意要点
 * 	1. xheditor的id必须为 txtbody
 *  2. quill的ref必须为 myQuillEditor
 *
 * 混合器功能
 * 1. mounted / destroyed 加载/销毁 xheditor
 * 2. computed 获取 兼容编辑器实例
 * 3. 开放 getContent 、setContent 兼容方法
 * 4. 增加新老切换识别功能 cookie oldEditor = 1 使用老的，否则使用新的
 */

const EditorMixin = {
  data () {
    return {
    	isOld: Web.isOldEditor() || Web.isIE(),
    }
  },
  created () {
    if (this.$route.query.old == 1) {
      this.isOld = true
      Web.setOldEditor(this.isOld)
    } else if (this.$route.query.old == 0) {
      this.isOld = false
      Web.setOldEditor(this.isOld)
    }
  },
  mounted () {
    // 初始化编辑器
    // xheditor
    if (this.isOld) {
      this.$nextTick(() => {
        this.txtbody = Web.initXheditor($('#txtbody'));
        // xheditor 在vue中的 bug ， 第一次加载高度计算会出错，强行重新设置
        $('.xheIframeArea').css('height', 181);
      })
    }
    // xheditor over
  },
  destroyed () {
    if (this.isOld) {
      // xheditor
      $('#txtbody').xheditor(false)
      // xheditor over
    }
  },
  methods: {
    // 获取编辑器里面内容（兼容2种编辑器）
    getContent () {
      return this.isOld ? this.txtbody.getSource() : this.content
    },

    // 设置编辑器里面的内容（兼容2种编辑器）
    setContent (content) {
      if (this.isOld) {
        this.txtbody.pasteHTML(content)
      } else {
      	if (content === '') {
        	this.content = content
      	} else {
          this.editor.deleteText(0, this.editor.getLength(), 'user')
          this.editor.clipboard.dangerouslyPasteHTML(0, content)
      	}
      }
    },
  },
  computed: {
    editor () {
    	if (this.isOld) {
    		return this.txtbody
    	} else {
    		// quill编辑器的ref需要强制设置成myQuillEditor，否则会出错
    		return this.$refs.myQuillEditor ? this.$refs.myQuillEditor.quill : null
    	}
    }
  },
	components: {
    YQuillEditor,
    YToolbar,
  }
}

export default EditorMixin
