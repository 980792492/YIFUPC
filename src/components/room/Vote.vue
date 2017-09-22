<template>
<div class="inner_left">
  <div class="inner_contain_left left">
    <div class="order">
      <ul class="order_ul" ref="myul"  @mouseenter="stop"  @mouseleave="go" >
        <li v-for="(list,index) in slideList" :key="index">
          <a>
             <p><span class="icon_wrap"><i class="icon iconfont icon-duihao"></i></span>{{list.UserName}}<span class="text">{{list.text}}</span>订阅了{{list.TeacherName}}的<span class="productype">{{ list.Type | typeName }}</span class="productname">
              <!--cjg-->
              <router-link  v-if="list.Type == 601"  target="_blank"  class="href" :to="{name: 'detail', params: { id: list.ProductId}}">{{list.ProductName}}</router-link>
              <!--vip-->
              <!-- <a  v-if="list.Type == 305"  target="_blank"  class="href" href="javascript:;" >{{list.ProductName}}</a> -->
             </p>
          </a>
        </li>
      </ul>
    </div>
    <div class="change">
      <!--老师的可购买产品轮播    ele-ui框架-->
      <template>
         <div class="block goods_menu">
            <el-carousel trigger="click" height="120px" :autoplay="false"  indicator-position="none" arrow="always">
              <el-carousel-item v-if="goodsData.length > 0" v-for="(v,index) in goodsData" :key="index">
                <div class="wrap">
                  <div  class="item">
                     <div class="title">
                      <p><span class="title_type">{{v.Type== 2 ? 'VIP' : v.ArticleType == 1 ? 'CJG' : '付费文章' }}</span>{{roomData.TeacherName}}：<span>{{v.Name}}</span></p>
                     </div>
                     <div  class="inner_content">
                        <div class="text">
                          <p>订阅期限：<span>{{ v.StartDate }}</span>至<span>{{ v.EndDate }}</span></p>
                          <p>剩余名额：<span>{{ v.Count > -1 ? v.Count :'无限制'  }}</span></p>
                          <p>课程价格：<span>{{v.Price}}G币</span></p>
                        </div>
                        <div class="button_wrap">
                          <!--CJG-->
                          <router-link v-if="v.Type == 1" target="_blank"  class="href" :to="{name: 'detail', params: { id: v.Id}}" >立即订阅</router-link>
                          <!--vip-->
                          <router-link  v-else-if="v.Type == 2"  target="_blank"  class="href"  :to="{name:'vip', params:{id:roomId}}" >立即订阅</router-link>
                          <!--付费观点-->
                          <!-- <a  v-if="v.Type == 3"   target="_blank"  class="href" :href=" `//room.yifucj.com/Golden/Detail/${v.Id}`" >立即订阅</a> -->
                        </div>
                     </div>
                  </div>
                </div>
              </el-carousel-item>
              <div class="noordercjg" v-if="goodsData.length == 0">暂无可订阅产品</div>
            </el-carousel>
          </div>
      </template>
    </div>
  </div>
  <div class="inner_contain_right right">
    <p class="rank">老师本月得票<span>{{ totalVoteNum }}</span>，排名{{ voteRank > 0 ? voteRank : '未上榜' }}<span><i class="icon-arrow-up"></i></span></p>
    <div class="vote">
      <div class="input_wrap">
        <input type="text" v-model="voteNum" placeholder="请输入支持老师的票数" /><span @click="handleVote">投票</span>
      </div>
    </div>
    <div class="help_nav">
      <el-popover
        ref="kf"
        placement="top-start"
        width="304"
        trigger="hover">
        <a slot="reference">
          <div><i class="icon iconfont icon-QQ"></i></div>
          <p>客服服务</p>
        </a>
        <ul class="kf">
          <li>一一QQ号：1536972572</li>
          <li>财富QQ号：2950972868</li>
          <li>富富QQ号：2725731686</li>
        </ul>
      </el-popover>
      <!-- 登陆和未登陆显示的按钮是不同的 -->
      <a v-if="authUser" target="_blank" :href="`//home.yifucj.com/${authUser.Id}/Cjg/NewIndex`">
        <div><i class="icon iconfont icon-guanli"></i></div>
        <p>我的藏金阁</p>
      </a>
      <router-link v-else target="_blank" :to="{name:'cjg'}">
        <div><i class="icon iconfont icon-guanli"></i></div>
        <p>藏金阁</p>
      </router-link>
      <!-- over -->
      <a target="_blank" href="http://www.yifucj.com/Help1">
        <div><i class="icon iconfont icon-wenhaoweiwanchengyanzheng"></i></div>
        <p>帮助中心</p>
      </a>
      <router-link target="_blank" style="border-right: 0" :to="{name:'history-list'}">
        <div><i class="icon iconfont icon-shu"></i></div>
        <p >直播历史</p>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions , mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'
import { typeName } from '@/utils/Filters'

export default {
  name: 'vote',
  data () {
    return {
      //    每月策略处轮播
      slideList:[],
      currentIndex: 0,
      timer:'',

      // 投票
      voteNum: '',
      totalVoteNum: 0,
      votePrice: 2,
      voteRank: 0,
    }
  },
  created () {
    this.api = new Api()
    //加载最新5条购买记录
    this.loadrecord()
    // 加载投票信息
    this.loadVote()
  },
  mounted (){
    this.$nextTick(() => {
      var self = this
      var num = 0
      this.timer = setInterval(function(){
        num = parseInt(num)-1
        if ( num == -171){
          num = 19
        }
        num = ''+num+'px'
        self.$refs.myul.style.top = ""+num+""
      },90)
    })
  },
  destroyed(){
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    //  订阅记录相关方法
    go() {
      var self = this
      var num = self.$refs.myul.style.top
      this.timer = setInterval(function(){
        num = parseInt(num)-1
        if ( num == -171){
          num = 19
        }
        num = ''+num+'px'
        self.$refs.myul.style.top = ""+num+""
      },90)
    },
    stop() {
      clearInterval(this.timer)
      this.timer = null
    },
    //    加载订阅记录
    loadrecord(){
      this.api.get('/Room/PayRecord',{teacher_id:this.teacherId}).then( resp => {
        this.slideList = resp
      })
    },
    // 投票数据
    loadVote () {
      this.api.get('/Room/VoteInfo',{teacher_id: this.teacherId}).then(resp => {
        this.totalVoteNum = resp.VoteCount,
        this.voteRank = resp.Rank
      })
    },
    // 投票
    handleVote: function () {
      if (!this.authToken) {
        Auth.openLoginDialog()
      } else {
        // 投票数量
        if (!(this.voteNum > 0)) {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的投票数量'
          })
          return false
        }

        // 投票确认
        this.$confirm(`本次投票共计消费${this.voteNum * this.votePrice}个G币，请确认支付`).then(_ => {
          // 投票请求
          this.api.post('Room/AddVote', {
            token: this.authToken,
            room_id: this.roomId,
            topic_id: this.topicId,
            data: JSON.stringify([{tid: this.teacherId, num: this.voteNum}])
          }).then(resp => {
            this.voteNum = ''
            this.totalVoteNum = this.totalVoteNum + this.voteNum*1
          })
        })
      }
    },
  },
  filters:{
    typeName
  },
  computed: {
    ...mapGetters(['roomData','roomId', 'topicId', 'teacherId', 'goodsData', 'authUser', 'authToken'])
  },
  watch:{
    voteNum (n) {
      this.voteNum = n > 0 ? parseInt(n) : ''
    },
  },
}

</script>
<style lang="less" scoped>
.inner_left {
  width: 760px; height: 160px;
  .inner_contain_left { width: 455px; height: 160px; background: #FFFFFF;
      .order { position: relative; height: 40px; background: #f7f7f7; border-bottom: 1px solid #E3E3E3; border-top: 1px solid #E3E3E3; line-height: 40px; overflow: hidden;
             p { position: absolute; background: #f7f7f7;}
      }
      .change { height: 120px;  position: relative;
          a { position: absolute; width: 13px; height: 27px; line-height: 27px; top: 46px; background: #c4c4c4; cursor: pointer;
              &:hover i { color: #e7735a;}
              i { color: #FFFFFF; font-size: 12px;}
          }
          .message { height: 100%; position: absolute; top: 0; background: #FFFFFF;}
          .message:nth-of-type(1){z-index: 1;}
          .spanleft {left: 15px; padding-left: 3px;}
          .spanright {right: 15px; padding-right: 3px;}
      }
  }
  .inner_contain_right {border-left: 1px solid #e3e3e3; width: 305px; height: 160px; background: #FFFFFF;
      .rank { height: 40px; line-height: 40px; text-align: center; font-size: 14px; border-top: 1px solid #E3E3E3;
          span { color: #d42148;};
      }
      .vote { height: 47px; padding-top: 2px;
          .input_wrap { margin: 0 auto; width: 273px; height: 30px;
              input { vertical-align: middle; width: 213px; padding-left: 10px; height: 30px; border: 1px solid #fac0ce; outline: none; border-right: none;}
              span {display: inline-block; text-align: center; line-height: 30px; vertical-align:middle;width: 60px; height: 30px; background: #e43a3d; color: #fff7ee; cursor: pointer;};
          }
      }
      .help_nav { height: 74px;
          a { width: 76px; height: 74px; float: left; border-top: 1px solid #e2e2e2; color: #676767;  border-right: 1px solid #E2E2E2; border-bottom: 1px solid #E2E2E2; cursor: pointer;
              &：hover { border-color: red;}
              &:hover>div> i { font-size: 35px; color: #e7735a;}
              &:hover >p { color:#e7735a ;}
              > div { text-align: center;height:50px; line-height: 50px;
                  i { font-size: 30px; width: 30px; height: 33px; transition: all 0.3s;}
              }
              p { text-align: center;}
          }
      }
  }

}

/*购买特训班轮播*/
.change { padding: 0;

  .el-carousel__item {}
  .block {
     .wrap { height: 100%; background: #FFFFFF; padding: 0 40px; padding-left: 41px;
        .item { height: 100%;
            > .title { height: 40px;
              > p { height: 40px; line-height: 40px; color: #676767; font-weight: 600;
                .title_type { padding: 3px 12px; background: #ffac2c; color: #FFFFFA; border-radius: 10px; margin-right: 5px;}
              }
            }
            > .inner_content { height: 80px; position: relative;
                > .text { color: #999999;
                  > p { line-height: 21px;}
                  > p:nth-last-child(1) > span { color: #d8474e;}
                }
                > .button_wrap { position: absolute; width: 99px; height: 36px; top: 24px; right: 15px; cursor: pointer;
                  > .href { display: inline-block; top: 0!important; width: 100%; text-align: center; height: 100%; line-height: 36px; background: #e43a3d; color: #fffcf9; border: none; border-radius: 20px; cursor: pointer; outline: none;}
                }
            }
         }
     }
  }
}

.goods_menu {
  .el-carousel__arrow { width: 14px !important; height: 36px !important; border-radius: 0 !important;}

  .noordercjg { height: 120px; line-height: 120px;
    text-align: center; font-size: 16px; color: #999999;

  }

}

/*每月策略轮播*/
.order {
  .list-leave-active {  transform: translateY(100%)}
  /*.list-leave-to { transform: translateX(-100%)}*/
  .list-enter-active {
       /*transition: all 1s ease;*/
       transform: translateY(0)
  }

  .order_ul { width: 100%; position: absolute; top: 0px;
      li { width: 100%; height: 38px;
        p { color: #6c6c6c; padding-left: 4px;
          > .icon_wrap { margin-right: 4px;
            > i { font-size: 18px; color: #E2383B;}
          }
          > .text { margin-left: 5px;
          }
          > .productype {margin-right: 10px;}
          > a { color: #679ed7;}
        }

      }
   }

  .slide-ul {  height: 100%; overflow: hidden;
    li { height: 100%; background: #F7F7F7;
      > a { height: 100%; display: block;
        > p {}
      }
    }
  }
}
</style>
