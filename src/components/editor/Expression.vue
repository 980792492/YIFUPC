<template>
  <div class="expression">
    <el-tabs type="card" v-model="currentFace">
      <el-tab-pane class="content" :key="i" v-for="(title, i) in faceList" :label="title" :name="i.toString()" @click="currentFace = i">
        <a v-for="value in data[i]" @click="choose(value)"><img :src="value" :class="{ normalface: i !== 0  }" /></a>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'expression',
  data () {
    return {
      faceList: ['QQ表情', '常用表情', '新表情'],
      currentFace: 0,
      data: [[], [], []],
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化表情
    init () {
      for(var i = 75 ; i < 193 ; i++ ){
        this.data[0].push("http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif")
      }

      for(var i = 1 ; i < 75 ; i++ ){
        this.data[1].push("http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif")
      }

      for(var i = 1001 ; i < 1072 ; i++ ){
        this.data[2].push("http://staticres.yifucj.com/common/emotion/gif/F_"+i+".gif")
      }
    },
    choose (value) {
      this.$emit('select', value)
    },
  }
}

</script>

<style lang="less" scoped>
  .expression .content { height: 150px; overflow-y: auto; 
    > a { border: 1px solid #F1F1F1; padding: 4px; float: left; 
      img.normalface {width: 44px; height: 44px; }
    }
  }
</style>

