<template>
  <div class="history_wrap">
    <div class="allhistory">
      <div class="all_left left">
        <img src="../../assets/all_history.png" alt="" /> 全部直播
      </div>
      <div class="search left">
        <div class="search_left left">查询：</div>
        <div class="select_right left">
          <el-select v-model="year" placeholder="请选择年份">
            <el-option
              v-for="item in optionYears"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="month" placeholder="请选择月份">
            <el-option
              v-for="item in optionMonths"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!--清除浮动影响-->
    <div class="clearn"></div>
    <div class="history_content">
      <div class="content_title">
        <div class="timer left">直播日期</div>
        <div class="title left">直播主题</div>
        <div class="number left">参与人数</div>
        <div class="live left">查看直播</div>
      </div>
      <div class="content_text">
        <ul>
          <li v-for="item in items">
            <div class="time left">{{item.CreateDate}}</div>
            <div class="text left">{{item.TopicName}}</div>
            <div class="number left">{{item.TotalOnLine}}</div>
            <!-- 历史直播 -->
            <div v-if="item.Status == 21"  class="action left">
              <!-- todo: 暂时先跳转到老的历史直播 -->
              <!-- <a :href="`//room.yifucj.com/History/${item.RoomId}_${item.TopicId}`" target="_blank">查看记录</a> -->
              <router-link :to="{ name:'history', params: { id: item.RoomId + '_' + item.TopicId } }">查看记录</router-link>
            </div>
            <!-- 正在直播 -->
            <div v-else class="action left">
              <router-link class="todaylive" :to="{ name:'live-main', params: { id: item.RoomId } }">进入直播</router-link>
            </div>
          </li>
        </ul>
        <!-- 分页 -->
        <div class="pager">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[5, 15, 20]"
              :page-size="num"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>

      </div>
    </div>
    <elite-introduce></elite-introduce>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EliteIntroduce from "@/components/room/EliteIntroduce"
import Api from '@/utils/Api'
import { historyshow } from '@/utils/Filters'

export default {
  name:"history-list",
  data(){
    return {
      year: null,
      month: null,
      optionYears:[],
      optionMonths:[],
      items:[],
      // 分页
      page: 1,
      num: 20,
      total: 0,
    }
  },
  created () {
    this.api = new Api()
    this.initSearch()
    this.loadData(this.teacherId)
  },
  methods:{
    handleSizeChange(num) {
      this.loadData(this.teacherId, this.page, num)
    },
    handleCurrentChange(page) {
      this.loadData(this.teacherId, page, this.num)
    },
    initSearch () {
      // 初始化年份
      let beginYear = 2014
      let currentYear = new Date().getFullYear()
      for (let i = currentYear; i >= beginYear; i--) {
        this.optionYears.push({
          label: i + '年',
          value: i
        })
      }
    },
    loadData (id, page = 1, num = 20) {
      if (id > 0) {
        this.api.get('Room/History', {
          teacher_id: id,
          year: this.year || 0,
          month: this.month || 0,
          page: page,
          num: num
        }).then(resp => {
          this.page = page
          this.num = num
          this.items = resp.List,
          this.total = resp.TotalCount
        })
      }
    }
  },
  watch:{
    teacherId (id) {
      this.loadData(id, 1)
    },
    year (y) {
      this.optionMonths = []
      this.month = null
      const date = new Date()
      // 如果和当前年份相同，就需要判断月份，否则就是12个月
      let maxMonth = date.getFullYear() == y ? date.getMonth() + 1 : 12
      for (let i = maxMonth; i >= 1; i--) {
        this.optionMonths.push({
          label: i + '月',
          value: i
        })
      }
    },
    month (m) {
      if (m) {
        // 选择了月份
        this.loadData(this.teacherId)
      }
    }
  },
  computed:{
    action:function(){
      return item.type == 1 ? '进入直播' : '查看记录'
    },
    ...mapGetters(['teacherId'])
  },
  filters:{
    historyshow
  },
  components:{
    EliteIntroduce
  }
}
</script>

<style lang="less" scoped>
  .history_wrap { width: 1175px; margin: 0 auto; padding-bottom: 13px;
    .allhistory { height: 51px; border-bottom:  1px solid #d9d9d7; padding: 0 20px; background: #ffffff; line-height: 51px;
      .all_left { width: 162px;  font-size: 20px; font-weight: 600; margin-right: 46px; color: #303030;
        > img { vertical-align: middle; margin-top: -5px;}
      }
      .search { color: #303030;
        .search_left {font-size:14px ; margin-right: 26px;}
        .select_right {
          > select { width: 90px; height: 30px; }
        }
      }
    }
    .history_content {
      .content_title { height: 50px; line-height: 50px; border-bottom: 1px solid #f1f1ef; background: #f3f3f1;
        > div { text-align: center; font-size: 13px; color: #999997;}
        > .timer {width: 186px; height: 50px; line-height: 50px; font-size: 14px;}
        > .title {width: 444px; height: 50px; line-height: 50px;  font-size: 14px;}
        > .number {width: 272px; height: 50px; line-height: 50px;  font-size: 14px;}
        > .live {width: 273px; height: 50px; line-height: 50px;  font-size: 14px;}
      }
      .content_text { padding: 0 0; background: #ffffff;
        > ul {
          > li { height: 61px; border-bottom: 1px solid #efefef;
            > div { text-align: center; line-height: 61px; color: #383838; font-size: 14px;}
            > .time { width: 186px; padding-left: 40px; }
            > .text { width: 444px; text-align: left; padding-left: 155px;
              > a { text-decoration: underline;}
            }
            > .number { width: 272px; text-align: left; padding-left: 125px;}
            > .action { width: 273px; text-align: right;  padding-right: 75px;
              > a { padding: 12px 32px; border-radius: 20px; border: 1px solid #e5383a; color: #e5383a; font-size: 14px;}
              > .todaylive { background: #e43a3d; color: #fffffa;}
            }
          }
        }
        > .page { height: 60px;}
      }
    }
  }
  .footer_wrap { margin-top: 13px;}
  .pager { padding: 12px;  text-align: center;}

</style>
