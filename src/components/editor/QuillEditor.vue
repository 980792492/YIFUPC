<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
  import Delta from 'quill-delta'
  import Web from '@/utils/Web'
  import { ImageImport } from '@/utils/editor/ImageImport'

  require('quill/dist/quill.snow.css')
  require('quill/dist/quill.bubble.css')
  require('quill/dist/quill.core.css')
  if (!window.Quill && !Web.isIE()) {
    window.Quill = require('quill/dist/quill.js')
    Quill.register('modules/imageImport', ImageImport)
  }

  export default {
    name: 'quill-editor',
    data: function() {
      return {
        _content: '',
        defaultModules: {
          toolbar: '#toolbar',
					imageImport: true
        }
      }
    },
    props: {
      content: String,
      value: String,
      disabled: Boolean,
      options: {
        type: Object,
        required: false,
        default: function() {
          return {}
        },
      }
    },
    mounted: function() {
      this.initialize()
    },
    beforeDestroy: function() {
      this.quill = null
    },
    methods: {
      initialize: function() {
        if (this.$el) {

          // options and instance
          var self = this
          self.options.theme = self.options.theme || 'snow'
          self.options.boundary = self.options.boundary || document.body
          self.options.modules = self.options.modules || self.defaultModules
          self.options.modules.toolbar = self.options.modules.toolbar !== undefined
                                          ? self.options.modules.toolbar
                                          : self.defaultModules.toolbar
          self.options.placeholder = self.options.placeholder || 'Insert text here ...'
          self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
          self.quill = new Quill(self.$refs.editor, self.options)

          // set editor content
          if (self.value || self.content) {
            self.quill.pasteHTML(self.value || self.content)
          }

          // mark model as touched if editor lost focus
          self.quill.on('selection-change', (range) => {
            if (!range) {
              self.$emit('blur', self.quill)
            } else {
              self.$emit('focus', self.quill)
            }
          })

          // update model if text changes
          self.quill.on('text-change', (delta, oldDelta, source) => {
            var html = self.$refs.editor.children[0].innerHTML
            var text = self.quill.getText()
            if (html === '<p><br></p>') html = ''
            self._content = html
            self.$emit('input', self._content)
            self.$emit('change', {
              editor: self.quill,
              html: html,
              text: text
            })
          })

          // disabled
          if (this.disabled) {
            this.quill.enable(false)
          }

          // init matcher
          this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
            return delta.compose(new Delta().retain(delta.length(), { style: null, class: null }));
          });

          this.quill.clipboard.addMatcher('A', function(node, delta) {
            if (node.href) {
              let reg = /http:\/\/(.*)yifucj\.com.*/i
              if (!reg.test(node.href)) {
                return delta.compose(new Delta().retain(delta.length(), { link: '' }));
              }
            }
            return delta
          });

          // emit ready
          self.$emit('ready', self.quill)
        }
      }
    },
    watch: {
      content: function(newVal, oldVal) {
        if (this.quill) {
          if (!!newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if(!newVal) {
            this.quill.setText('')
          }
        }
      },
      value: function(newVal, oldVal) {
        if (this.quill) {
          if (!!newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if(!newVal) {
            this.quill.setText('')
          }
        }
      },
      disabled: function(newVal, oldVal) {
        if (this.quill) {
          this.quill.enable(!newVal)
        }
      }
    }
  }
</script>

<style>
  .quill-editor img {
    max-width: 100%;
  }
  .ql-container { font-size: 16px!important; }
  .ql-container * {font-size: inherit;}
</style>
