<template>
<div>
  <!-- 字体选择器 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    v-model="fontSizeData.isShow">
    <button class="custom-btn w-100 bg-fontsize" slot="reference">字体大小</button>
    <div class="fontsize-popver">
      <button v-for="v in fontSizeData.list" :class="{ selected: fontSizeData.fontSize === v}" :value="v" @click.stop="fontSize"><span :style="{fontSize: v}">{{ v }}</span></button>
    </div>
  </el-popover>
  <button class="custom-btn w-80" value="#ff0000" @click.stop="color"><span class="bg-red">红</span>字红</button>
  <button class="custom-btn w-80" value="#0000ff" @click.stop="color"><span class="bg-blue">蓝</span>字蓝</button>
  <!-- 颜色选择器 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    v-model="colorData.isShow"
    width="220">
    <button class="custom-btn w-80 bg-color" slot="reference">更多</button>
    <div class="color-popver">
      <button v-for="v in colorData.list" :class="{ selected: colorData.color === v}" :style="{ backgroundColor: v }" :value="v" @click="color" ></button>
    </div>
  </el-popover>
  <!-- 加粗 -->
  <button class="custom-btn w-80" :value="isBold" @click.stop="bold"><span class="bg-gray">B</span>加粗</button>
  <!-- 链接 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    v-model="linkData.isShow"
    width="400">
    <button class="custom-btn w-40 bg-link" slot="reference"></button>
    <div class="link-popver">
      <el-row>
        <el-col :span="20">
          <el-input placeholder="请输入内容" v-model="linkData.url">
            <template slot="prepend">链接地址</template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="link">确定</el-button>
        </el-col>
      </el-row>
    </div>
  </el-popover>
  <!-- swf音乐 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    v-model="flashData.isShow"
    width="400">
    <button class="custom-btn w-40 bg-music" slot="reference"></button>
    <div class="flash-popver">
      <el-row>
        <el-col :span="24">
          <el-input placeholder="请输入地址" v-model="flashData.url">
            <template slot="prepend">SWF地址</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入宽度" v-model="flashData.width">
            <template slot="prepend">宽</template>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-input placeholder="请输入高度" v-model="flashData.height">
            <template slot="prepend">高</template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="flash">确定</el-button>
        </el-col>
      </el-row>
    </div>
  </el-popover>
  <!-- 表情 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    width="400">
    <button class="custom-btn w-40 bg-expression" slot="reference"></button>
    <div class="expression-popver">
      <y-expression @select="expression" />
    </div>
  </el-popover>
  <!-- 全选 -->
  <button class="custom-btn w-40 bg-selectall" @click="selectAll"></button>
  <!-- 图片上传 -->
  <button class="custom-btn w-40 bg-image" @click="image"></button>
  <!-- 常用观点 -->
  <el-popover
    placement="bottom-start"
    trigger="click"
    width="400">
    <button class="custom-btn last" slot="reference">常用观点</button>
    <ul class="normal-view-popver">
      <li v-for="item in normalViewList" @click="handleNormalView(item.Id)">{{ item.Content }}</li>
    </ul>
  </el-popover>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Delta from 'quill-delta'
import Api from '@/utils/Api'
import Web from '@/utils/Web'
import YExpression from './Expression'

if (!window.Quill && !Web.isIE()) {
  window.Quill = require('quill/dist/quill.js')
}


export default {
  name: 'toolbar',
  data: function () {
    return {
      isBold: false,
      fontSizeData: {
        isShow: false,
        fontSize: '16px',
        list: ['14px', '16px', '18px', '20px', '26px']
      },
      colorData: {
        isShow: false,
        color: null,
        list: ['#000000', '#ff6699', '#cd0000', '#7c1515', '#ff6600', '#009900', '#cc33cc', '#6600cd', '#333333']
      },
      flashData: {
        url: 'http://www.yifucj.com',
        width: null,
        height: null,
        isShow: false
      },
      linkData: {
        url: 'http://',
        isShow: false
      },

    }
  },
  created () {
    // 初始化字体
    this.initFontSize()
  },
  methods: {
    initFontSize () {
      const Size = Quill.import('attributors/style/size');
      // console.log(Size);
      Size.whitelist = ['14px', '16px', '18px', '20px', '26px'];
      Quill.register('formats/size', Size, true);
    },
    fontSize (e) {
      this.fontSizeData.fontSize = e.currentTarget.value
      this.editor.format('size', this.fontSizeData.fontSize)
      this.fontSizeData.isShow = false
    },
    color (e) {
      this.colorData.color = e.currentTarget.value
      this.editor.format('color', this.colorData.color)
      this.colorData.isShow = false
    },
    // 加粗
    bold (e) {
      this.isBold = !e.currentTarget.value
      this.editor.format('bold', this.isBold);
    },
    // 全选
    selectAll () {
      this.editor.setSelection(0, this.editor.getLength())
    },
    // 插入链接
    link () {
      let range = this.editor.getSelection(true)
      if (range.length > 0) {
        this.editor.format('link', this.linkData.url, Quill.sources.USER)
      } else {
        this.editor.insertText(range.index, this.linkData.url, { 'link': this.linkData.url }, Quill.sources.USER)
      }
      this.linkData.isShow = false
    },
    // 插入flash
    flash () {
      let range = this.editor.getSelection(true)
      this.editor.updateContents(new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert({ ['swf']: {
          value: this.flashData.url,
          width: this.flashData.width,
          height: this.flashData.height,
        }})
      , 'user');
      this.flashData.isShow = false
    },
    // 插入图片
    image () {
      let fileInput = this.$el.querySelector('input.ql-image[type=file]');
      if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', () => {
          if (fileInput.files != null && fileInput.files[0] != null) {
            let reader = new FileReader();
            reader.onload = (e) => {
              const api = new Api()
              api.postFile('Image/Upload', { token: this.authToken, category: 0}, fileInput.files[0]).then(resp => {
                let range = this.editor.getSelection(true);
                this.editor.updateContents(new Delta()
                  .retain(range.index)
                  .delete(range.length)
                  .insert({ image: resp.Url })
                , 'user');
                fileInput.value = "";
              })
            }
            reader.readAsDataURL(fileInput.files[0]);
          }
        });
        this.$el.appendChild(fileInput);
      }
      fileInput.click();
    },
    // 插入表情
    expression (v) {
      if (v) {
        let range = this.editor.getSelection(true)
        this.editor.updateContents(new Delta()
          .retain(range.index)
          .delete(range.length)
          .insert({ ['image']: v })
        , 'user');
      }
    },
    // 常用观点
    handleNormalView (id) {
      const api = new Api()
      api.get('Teacher/AnaDetail', { id: id }).then(resp => {
        let range = this.editor.getSelection(true)
        this.editor.clipboard.dangerouslyPasteHTML(range.index, resp.Content);
      })
    },

  },
  computed: {
    editor () {
      return this.$parent.quill
    },
    ...mapGetters(['authToken']),
    ...mapState({
      normalViewList: state => state.view.normal.list,
    })
  },
  components: {
    YExpression
  }
}
</script>

<style lang="less" scoped>
.ql-snow.ql-toolbar { padding: 0; background-color: #f0f0ee;
  .custom-btn { height: 40px; border-right: 1px solid #c5c5c5; padding: 8px 0;
    span { display: inline-block; width: 26px; height: 26px; border-radius: 50%; font-size: 14px; line-height: 26px; color: #fff; margin-right: 7px; }
    &.last { border-right: 0; width: 98px;}
  }

}
// 字体选择器
.fontsize-popver button { display: block; padding: 5px 10px; background: #fff; border: none; width: 100%; text-align: left;
  &:hover { background: #ccc}
  &.selected  { background: #ccc}
}
// 颜色选择器样式
.color-popver button { width: 16px; height: 16px;  border: 1px solid transparent; display: inline-block; margin: 2px;
  &:hover { border-color: #000; }
  &.selected { border-color: #000; }
}
// 常用观点样式
.normal-view-popver { max-height: 100px; overflow-y: auto;
  > li { height: 25px; line-height: 25px; border-bottom: 1px dashed #ccc; overflow: hidden; }
}
.el-row { margin-bottom: 10px; }
.bg-red { background: #f20500!important; }
.bg-blue { background: #1b6dd9!important; }
.bg-gray { background: #666!important; }
.w-100 { width: 100px!important; }
.w-80 { width: 80px!important; }
.w-40 { width: 40px!important; }
.bg-fontsize {  text-indent: 33px; background: url(../../assets/editor/button_fontsize.png) no-repeat 11px center!important; }
.bg-color { text-indent: 33px; background: url(../../assets/editor/button_color.png) no-repeat 11px center!important; }
.bg-image { background: url(../../assets/editor/button_image.png) no-repeat center center!important; }
.bg-expression { background: url(../../assets/editor/button_expression.png) no-repeat center center!important; }
.bg-link { background: url(../../assets/editor/button_link.png) no-repeat center center!important; }
.bg-music { background: url(../../assets/editor/button_music.png) no-repeat center center!important; }
.bg-selectall { background: url(../../assets/editor/button_selectall.png) no-repeat center center!important; }
</style>
