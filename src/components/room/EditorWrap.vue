<template>
  <div class="editor_wrap">
    <div class="title_wrap">
      <div v-for="(v,index) in items" @click="change(v.title)" :class="{redborder: changeindex == v.title}">{{v.title}}</div>
      <div><router-link :to="{ name: 'deliver' }" target="_blank">发表文章</router-link></div>
    </div>
		<div>
  		<component :is="currentView">
  		</component>
		</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TeacherEditView from '@/components/room/TeacherEditView'
import TeacherViewSet from '@/components/room/TeacherViewSet'
import TeacherNormalView from '@/components/room/TeacherNormalView'
import TeacherNoSpeech from '@/components/room/TeacherNoSpeech'
import TeacherAddtoCjg from '@/components/room/TeacherAddtoCjgSet'

export default {
  name:'editor-warp',
  data(){
    return{
    	changeindex:'发表观点',
    	currentView:TeacherEditView,
      items: []
    }
  },
  created() {
    // 加载常用观点
    this.getNormalViewList()
    // 邀请嘉宾的菜单和老师是不一样的
    if (this.isTeacher) {
      this.items = [
        {title:'发表观点'},
        {title:'修改直播设置'},
        {title:'常用观点设置'},
        {title:'禁言用户管理'},
        {title:'追加藏金阁'}
      ];
    } else {
      this.items = [
        {title:'发表观点'},
        {title:'常用观点设置'},
        {title:'禁言用户管理'},
      ]
    }
  },
  methods:{
    change(str){
    	this.changeindex = str
			switch (str){
				case '发表观点':
					this.currentView = TeacherEditView
					break;
				case '修改直播设置':
					this.currentView = TeacherViewSet
					break;
				case '常用观点设置':
					this.currentView = TeacherNormalView
					break;
				case '禁言用户管理':
					this.currentView = TeacherNoSpeech
					break;
				case '追加藏金阁':
					this.currentView = TeacherAddtoCjg
					break;
				default:
					this.currentView = TeacherEditView
					break;
			}
    },
    ...mapActions(['getNormalViewList'])
  },
  computed: {
    ...mapGetters(['teacherId', 'isTeacher', 'authUser'])
  }
}
</script>

<style lang="less"  scoped >
	.redborder { border-color:red !important;}

  .editor_wrap { height: 411px; background: #ededed;
    .title_wrap { height: 42px;  border-top: 1px solid #c6c6c6; border-bottom: 1px solid #c6c6c6;
      > div { float: left; height: 100%; line-height: 42px; padding: 0 24px; cursor: pointer; border-bottom: 2px solid #ededed; font-size: 14px;
      	> a { font-size: 14px; color: #666666;}
      	&:hover { color: #EA6E52;}
      }
    }


  }
</style>
