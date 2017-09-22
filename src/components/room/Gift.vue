<template>
<div class="bottomnume_right">
  <el-carousel trigger="click" height="64px" :autoplay="false"  indicator-position="none" arrow="always" >
    <el-carousel-item v-for="(v, index) in giftlist" :key="index" style="padding: 0 24px;">
      <div class="gift" v-for="(item, index) in v "  :id="item.GiftId"  @click="sendgift(item)">
            <img :src="item.BigImgUrl" :alt="item.Description" :title="item.Description" />
            <p>{{item.Golds}}{{item.Type == 1 ? 'G币' : '积分'}}</p>
      </div>

    </el-carousel-item>
  </el-carousel>
  <!--打开礼物送礼弹窗-->
  <el-dialog :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
    <div v-if="authUserchagedata" class="send_pop">
      <div class="send_gift_top" ><img :src="giftData.SmallImgUrl" alt="" /></div>
      <div class="send_gift_title">
        <p>礼品：<span class="gift_description">{{giftData.Description}}</span>价格：<span class="gift_price">{{giftData.Golds}}</span>{{ giftData.Type == 1 ? 'G币' : '积分'}}</p>
      </div>
      <div class="send_gift_people">
        <p>赠送给：</p>
        <p class="people_detail">
          <span @click="check(teacherId)" :class="{colorcheck: checklist.indexOf(teacherId) != -1 }"  :id="teacherId">{{roomData.TeacherName}}<i class="icon iconfont icon-duihao"></i></span>
          <span @click="check(item.TeacherId)" :class="{colorcheck: checklist.indexOf(item.TeacherId) != -1 }"   v-for="(item, index) in inviteTeacher"  :id="item.TeacherId">{{item.TeacherName}}<i class="icon iconfont icon-duihao"></i></span>
        </p>
      </div>
      <div class="send_gift_text">
        <p  class="all_price">共需花费<span>{{giftData.Golds * checklist.length}}</span>{{giftData.Type == 1 ? 'G币' : '积分'}}</p>
        <p v-if="giftData.Type == 1 " class="owner_Gb">您的剩余G币数：{{(authUserchagedata.CurrentGcoinsCount)  - giftData.Golds * checklist.length }} <a href="//pay.yifucj.com" target="_blank" class="link_chongzhi">充值 >></a></p>
        <p v-else class="owner_Gb">您的剩余积分数：{{(authUserchagedata.CurrentGcentsCount) - giftData.Golds * checklist.length }}</p>
      </div>
      <div class="send_gift_btn">
        <button class="btn" :disabled="isSendGift" @click="ensuresend()">立即赠送</button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { mapActions , mapGetters } from 'vuex'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'

export default {
  name: 'Gift',
  data () {
    return {
      //    送礼弹窗默认false
      dialogVisible: false,
      //    设置送礼物弹窗信息
      giftData:{},
      //    设置用于存放送礼给老师的空数组
      checklist:[],
      //    礼物列表
      giftlist:[],
      isSendGift: true,
    }
  },
  created () {
    this.api = new Api()
    //  加载礼物
    this.loadgift()
  },
  methods: {
    check(id){
     if(this.checklist.indexOf(id) == -1) {
      this.checklist.push(id)
     }else {
      for(var i=0; i<this.checklist.length; i++) {
        if(this.checklist[i] == id) {
          this.checklist.splice(i,1)
        }
      }
     }
     // console.log(this.checklist)
    },
    //    加载礼物
    loadgift(){
      this.api.get('/Room/Gift').then( resp => {
        let list = resp.filter(item => {
          return ((!this.authUser || this.authUser.UserIdentity != 1) && item.Type == 1) || (this.authUser && this.authUser.UserIdentity == 1 && item.Type == 2)
        })

        var newList = []
        for (var i = 0 ; i< list.length; i++) {
          if(i%6 == 0){
            var arr = new Array()
          }
          arr.push(list[i])
          if (arr.length == 6) {
            newList.push(arr)
          }
          if(list.length - i < 6 && list.length - i > 0   ){
            newList.push(arr)
          }
        }
        this.giftlist = Array.from(new Set(newList))
      })

    },

    handleClose(done) {
      done()
      this.checklist = []
    },

    sendgift(str){
//      若未登录则需先登录再进行登录操作
      if(!this.authToken) {
        Auth.openLoginDialog()
        return false
      }
      this.isSendGift = false
      this.dialogVisible = true
      let params = {}
      params.token = this.authToken
      this.getUserChangeData(params)
      this.giftData = str
    },
//    礼物确认送出按钮
    ensuresend (){
      let teacherIdS = ''
      this.checklist.forEach(function(v){
        teacherIdS = teacherIdS + v + ','
      })
      //    截取掉字符串最后的逗号,
      teacherIdS = teacherIdS.substring(0,teacherIdS.length-1)
      // console.log(teacherIdS)
      let params = {}
      params.token = this.authToken
      params.topic_id = this.topicId
      params.gift_id = this.giftData.GiftId
      params.teacher_ids = teacherIdS

      // 禁用送礼按钮，防止连续点击，再次打开dialog解除
      this.isSendGift = true
      this.api.post('/Room/AddGift',params).then(resp => {
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '送礼成功',
          type: 'success'
        });
      })

    },
    ...mapActions(['getUserChangeData'])
  },
  computed: {
    ...mapGetters(['roomData', 'topicId', 'teacherId', 'inviteTeacher', 'authUser', 'authToken', 'authUserchagedata'])
  }
}

</script>
<style lang="less" scoped>
.colorcheck {  border: 1px solid red!important;
   i { color:red!important;}
}

.bottomnume_right { position: relative; height: 64px; padding:0px; background: #f7f7f7;
  a { position: absolute; width: 13px; height: 27px; top:17px ; cursor: pointer; line-height: 27px; background: #c4c4c4; text-align: center; overflow: hidden;
      &:hover i { color: #e7735a;}
      i { color: #FFFFFF; font-size: 14px;}
  }
  .spanleft { left: 10px; padding-left: 3px;}
  .spanright {right: 10px; padding-right: 3px;}
  .message { height: 100%; position: absolute; top: 0; background: #F7F7F7;}
  .message:nth-of-type(1) { z-index: 1;}
  .el-carousel__arrow--left { left: 8px !important;}
  .gift { float: left; width: 16%; height: 100%; margin: 0 1px; text-align: center; cursor: pointer;
      > img { width: 50px; height:44px; }
      > p { text-align: center;}



  }
}

.send_pop {
  .send_gift_top { text-align: center;
     img { width:100px; height: 90px; margin: 0 auto; };
  }
  .send_gift_title {
    > p { text-align: center; line-height: 20px;
      > .gift_description { font-weight: 600; font-size: 14px; padding-right: 10px;}
      > .gift_price { color:red; font-weight: 600; margin-right: 5px;font-size: 14px;}
    }
  }
  .send_gift_people {
    > .people_detail {  min-height: 40px; margin-top: 5px;
        > span { display: inline-block; margin-right: 6px; margin-bottom: 5px; position: relative; width: 120px; height: 30px; line-height: 30px; border: 1px solid #cececd; padding: 0 5px; cursor: pointer;
          > i { float: right; color: #cececd; font-size: 20px;}
        }

    }
  }
  .send_gift_text {  margin-bottom: 20px; overflow: hidden;
    > .all_price { float: left;
      > span { color: red; line-height: 30px;}
    }
    > .owner_Gb { float: right;  line-height: 30px;
      > .link_chongzhi { position: inherit; background: none; color: red;}
    }
  }
  .send_gift_btn { clear:both;
    > .btn { color: #FFFFFF; cursor: pointer; background:#CF3838; height: 30px; width: 150px; font-size: 14px;  border: none; margin: 0 auto; text-align: center; line-height: 30px; display: block;}
   }

}
</style>
