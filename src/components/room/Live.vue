<template>
<div class="live_item">
  <!--直播 type:1(老师发言),2(问答),5(系统推送),7(藏金阁),9(博文),10(付费观点)   -->
  <div :data-id="data.Index" v-if="data.Type == 1 || (data.Type == 2 && data.Body)  || data.Type == 5 || data.Type == 7 || data.Type == 9 " :class="bgColor">
    <div class="item-author-wrap">
      <!--系统推送头部-->
      <div class="item-system" v-if="data.Type == 5">
        <div class="system-left left">
          <p><i class="icon iconfont icon-lingdang"></i> <em>系统公告</em></p>
          <!-- <span class="iconspan"></span> -->
        </div>
        <div class="system-right left">{{ data.CreateDate }}</div>
      </div>

      <!--老师推送头部-->
      <div v-else class="live-item-author">
        <div class="img-wrap">
          <img :src="data.HeadImg" alt="" />
          <span class="iconspan"></span>
        </div>
        <div class="person-name">
          <p>
            <img :src="require(`../../assets/head_${data.Identity}.png`)"/>
            <span>{{ data.UserName }}</span>
            <!-- <img v-show="data.StockGame == 1" src="../../assets/game_icon.jpg"> -->
            <span class="teacher_time">{{ switchDateTime(data.CreateDate) }}</span>
          </p>
        </div>
        <div v-show="data.Type == 1 || data.Type == 10" class="item-active">
           <a @click="shareshow = !shareshow">分享</a>
           <div class="share_wrap" v-show="shareshow">
           	<span>分享到：</span>
           	<ul>
           		<li v-for="(item, index) in shareList" :key="index">
           			<img  @click="ShareModelShow(this, `${item.action}`, `${data.Index}`, false)" :src="require(`../../assets/${item.pic}`)" alt="" />
           		</li>
           		<li><a @click="ShareModelShow(this, 'gengduo', `${data.Index}`, true)"> >> </a></li>
           	</ul>
           </div>
          <span @click="handleZan(data.Index)">点赞<i>{{ zan }}</i></span>
        </div>
      </div>
    </div>
    <!--内容部分-->
    <div :id="`viewpoint_${data.Index}`" ref="inner" class="item-inner">
      <div>
        <!-- 普通发言 -->
        <div v-if="data.Type == 1 && !(data.QuoteIndex >= 0)">
          <p>
            <div class="item-inner-text rich_text" v-html="switchBody(data.Body)"></div>
          </p>
        </div>

        <!-- 引用发言 -->
        <div v-if="data.Type == 1 && data.QuoteIndex >= 0" class="inner-wrap">
          <div class="wrap-top">
            <div class="title">
              <p class="left">
                <img v-if="data.QuoteIdentity > 0" :src="require(`../../assets/head_${data.QuoteIdentity}.png`)"/>
                {{ data.QuoteUserName }}
              </p>
              <p class="right">{{ data.QuoteCreateDate }}</p>
            </div>
            <p class="detail rich_text" v-html="switchBody(data.QuoteBody)"></p>
          </div>
          <p class="rich_text" v-html="switchBody(data.Body)"></p>
        </div>

        <!-- 问答内容 -->
        <div v-if="data.Type == 2">
          <p class="link ">{{ paper.AnswerUserName }}  回答了<span>{{ paper.UserName }}</span>的提问 <router-link :to="{name:'questiondetail', params:{id: paper.Id}}" target="_blank">点击查看详情 >></router-link></p>
        </div>

        <!-- 文章 -->
        <div v-if="data.Type == 7">
          <p v-if="data.ArticleType == 2" class="link "><i class="bowen icon iconfont icon-jilu"></i> {{ data.UserName }} {{ data.Status == 2 ? '追加' : '新增' }}付费文章  《 {{ data.Body }} 》  <router-link :to="{name:'detail', params:{id: data.GoldenId}}" target="_blank">点击查看详情 >></router-link></p>
          <p v-else-if="data.ArticleType == 3" class="link "><i class="bowen icon iconfont icon-jilu"></i> {{ data.UserName }} {{ data.Status == 2 ? '追加' : '新增' }}免费文章  《 {{ data.Body }} 》  <router-link :to="{name:'detail', params:{id: data.GoldenId}}" target="_blank">点击查看详情 >></router-link></p>
          <p v-else class="link "><i class="cjg icon iconfont icon-cjg"></i> {{ data.UserName }} {{ data.Status == 2 ? '追加' : '新增' }}藏金阁  《 {{ data.Body }} 》  <router-link :to="{name:'detail', params:{id: data.GoldenId}}" target="_blank">点击查看详情 >></router-link></p>
        </div>

        <!-- 博文 -->
        <div v-if="data.Type == 9">
          <p class="link "><i class="bowen icon iconfont icon-jilu"></i> {{ data.UserName }} 新增博文《{{ data.Body }}》  <router-link :to="{name:'detail', params:{id: data.QingBaoId}}" target="_blank">点击查看详情 >></router-link></p>
        </div>


        <!-- 系统公告 -->
        <div v-if="data.Type == 5" class="system-inner">
          <div v-html="data.Body"></div>
        </div>
      </div>
    </div>
  </div>

  <!--加密观点内容部分-->
  <encrypted-view v-if="data.Type == 10" :data="JSON.parse(data.Body)"></encrypted-view>

  <!--
      纸条部分 直播纸条显示规则：
      1. 老师和嘉宾不显示
      2. 老师未回答不显示
  -->
  <!--<paper v-if="data.Type == 2 && data.AnswerUserId > 0 && !isTeacher && !isInviteTeacher" :data="paper"></paper>-->
  <!--<div v-if="data.Type ==2 && data.Body" class="wenda">

		<div class="item-author-wrap">
      <div class="live-item-author">
        <div class="img-wrap">
          <img :src="data.HeadImg" alt="" />
          <span class="iconspan" :class=" 'iconspan'+data.Type"></span>
        </div>
        <div class="person-name">
          <p>
            <img :src="require(`../../assets/head_${data.Identity}.png`)"/>
            <span>{{ data.UserName }}</span>
            <img v-show="data.StockGame == 1" src="../../assets/game_icon.jpg">
            <span class="teacher_time">{{ switchDateTime(data.CreateDate) }}</span>
          </p>
        </div>
      </div>
    </div>
		<!-- 问答内容 -->
    <!--<div v-if="data.Type == 2" class="system-inner" :class=" 'item-inner'+data.Type">
          <p class="link ">{{ data.UserName }}  回答了<span>{{JSON.parse(data.Body).UserName}}</span>的提问 <router-link :to="{name:'questiondetail', params:{id: JSON.parse(data.Body).Id}}" target="_blank">点击查看详情 >></router-link></p>
    </div>
	</div>-->
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import EncryptedView from '@/components/room/EncryptedView'
import { switchBody } from '@/utils/Filters'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default {
  data: function () {
    return {
    	shareshow:false,
    	shareList: [
    		{"pic": "weixin.gif", "action": "weixin"},
    		{"pic": "sinaminiblog.gif", "action": "sinaminiblog"},
    		{"pic": "qqim.gif", "action": "qqim"},
    		{"pic": "qqmb.gif", "action": "qqmb"},
    		{"pic": "qzone.gif", "action": "qzone"},
    		{"pic": "sohuminiblog.gif", "action": "sohuminiblog"},
    		{"pic": "douban.gif", "action": "douban"},
    		{"pic": "hexunmb.gif", "action": "hexunmb"},
    		{"pic": "cfol.gif", "action": "cfol"},
    		{"pic": "caimi.gif", "action": "caimi	"}
    	],
      paper: null,
      zan: this.data.ThumbUpCount,
    }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    topic: {
      type: Number,
      default: 0
    }
  },
  created () {
    // 处理数据
    this.handleData()
  },
  mounted () {
    if (this.$refs.inner) {
      let imgs = this.$refs.inner.querySelectorAll('img')
      for (let img of imgs) {
        img.onload = () => {
          this.$emit('imgLoad')
        }
      }
    }
  },
  methods: {
    handleZan(i) {
      Auth.isLogin().then(() => {
        // console.log(this.topic)
        if (i < 0) return false

        const api = new Api()
        api.post('Room/ThumbUp', {
          token: this.authToken,
          topic_id: this.topic,
          index: i
        })
        .then(resp => {
          this.zan++
        })
        .catch(error => {
          console.log(error)
        })

      }).catch(() => {
        Auth.openLoginDialog()
      })
    },
    handleData () {
      if (this.data.Type == 2 && this.data.Body) {
        let body = JSON.parse(this.data.Body)
        // 处理问答数据
        this.paper = {
          Id: body.Id,
          UserName: body.UserName,
          Gold: body.Gold,
          Status: body.Status,
          AnswerUserName:body.AnswerUserName,
        }
      }
    },
    switchBody,
    switchDateTime (datetime) {
      if (this.data.Type == 7) {
        return this.roomData.CreateDate.substring(0, 10) + ' ' + datetime.substring(datetime.length - 8)
      }
      return datetime
    },
    ShareModelShow(_this, name, id, ismore) {
			    var html = $("#viewpoint_" + id).text();
//				var html = $('#viewpoint_0').html();
//			    html = html.replace(/<\/?[^>]*>/g, '').replace(" ","").replace(/\n[\s| | ]*\r/g, '\n').replace(/&nbsp;/ig, '');
			    var model = {
//			      title: $("#topic_name_room_chat").html(),
							title: this.roomData.TopicName,
			        url: window.location,
			        summary: html
			    };
			    if (ismore) {
			        bShare.more(_this, model);
			    } else {
			        bShare.share(_this, name, model);
			    }
//			    $("#viewShareModel_" + id).remove();
			}
  },
  // 计算属性判断是否显示
  computed: {
    bgColor () {
      switch (this.data.Type * 1) {
        case 2:
          return 'wenda'
        case 7:
          return this.data.ArticleType && this.data.ArticleType == 3 ? 'bw' : 'cjg'
        case 9:
          return 'bw'
        default:
          return null
      }
    },
    ...mapGetters(['authToken','authUser', 'isTeacher', 'isInviteTeacher', 'roomData'])
  },
  components:{
    EncryptedView,
  }
}
</script>

<style lang="less" scoped>
.cjg {
  .item-inner { background: #fdedb4 !important;line-height: 30px !important;}
  .iconspan  { border-bottom-color: #FBEFC3 !important;}
}

.item-inner1 { background: #F9F9F9 !important; 
		 .link { height: 30px; line-height: 30px;} 
	}
	.iconspan1 { border-bottom:8px solid #F9F9F9!important;}
	



	.item-inner9 { background: #E6F0FC !important; 
		 .link { height: 30px; line-height: 30px;} 
	}
	
	.iconspan9 { border-bottom:8px solid #E6F0FC!important;}
	
	.item-active { position: relative;
		.share_wrap {  position: absolute; top: 40px; width: 432px; height: 54px; padding-left: 10px; line-height: 54px; border: 1px solid #C5C5C5; box-shadow: 0px 1px 2px #333; right: -20px; background: #FFFFFF;
				span {float: left; font-size: 14px; color: #666666;}
				ul { float: left; padding-top: 5px; margin-left: 5px;
					li { float: left;  cursor: pointer; margin-left:9px ; width: 22px; height: 40px;
						img { width: 22px; height: 22px;}
					}
					li:nth-last-child(1) { line-height: 40px;}
			}
}   }
	.wenda {
	  .item-inner { background: #f0e6e5 !important;line-height: 30px !important; }
	  .iconspan { border-bottom-color: #f0e6e5 !important;}
	}


.item-inner {
		div { word-break: break-word;}
		p { word-break: break-word;}
}
</style>
