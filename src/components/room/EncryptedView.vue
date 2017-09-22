<template>
	<div class="encry_item">
		<div class="item-author">
			<div class="img-wrap ">
				<img :src="data.HeadImg"/>
			</div>
			<div class="person-name">
				<p>
         	<img v-if="data.Identity" :src="require(`../../assets/head_${data.Identity}.png`)"/>
					<span class="name">{{ data.TeacherName }}</span>
					<img v-if="data.StockGame == 1" src="../../assets/game_icon.jpg">
					<span class="time">{{ data.CreateDate }}</span>
				</p>
			</div>
			<div class="action-wrap ">
        <span v-if="!isTeacher">加密观点</span>
        <span v-else-if="isStop">已停售</span>
				<span v-else @click="stopSale">停止销售</span>
			</div>
		</div>
		<div class="item-detail">
			<div v-if="isTeacher || isBuy" class="view-unlock">
				<p class="unlock-title">
					<span><i class="icon iconfont icon-unlock"></i></span>此观点{{ data.Golds }}G币,您已拥有查看权限:
				</p>
				<div class="unlock-view" v-html="data.Content"></div>
			</div>
      <div v-else-if="isStop" class="view-out">
        <div class="icon-wrap"><i class="icon iconfont icon-suo"></i></div>
        <div class="title"><p>此加密观点已下架</p></div>
      </div>
      <div v-else>
        <a class="view-secret">
          <div class="icon-wrap"><i class="icon iconfont icon-suo"></i></div>
          <div class="secret-hover">
            <p class="pcs" :style="{width: data.MonthGolds > 0 ? '50%' : '100%'}" @click="unlock(1)">解锁单条加密观点：<span>{{ data.Golds }}</span>G币</p>
            <p v-show="data.MonthGolds > 0" class="month" @click="unlock(2)">订阅观点包：<span>{{ encryptedViewMonthGolds || data.MonthGolds }}</span>G币/月
              <em class="right">划算</em>
            </p>
          </div>
        </a>
      </div>
		</div>

    <!-- todo: 为方便，弹窗封装在组件中，以后有时间应该用vuex实现 -->
	    <el-dialog class="open_wrap"
	      :visible.sync="dialogVisible">
	      	<div class="open_top">
	      		请确认订阅信息
	      	</div>
	      	<div class="open_content">
	      		<p>
	      			<span>订阅内容：</span>
	      			<span>{{ data.TeacherName + data.CreateDate + '加密观点'}}</span>
	      		</p>
	      		<p v-if="type === 2">
	      			<span>服务期限：</span>
	      			<span>{{ data.CreateDate.substr(0, 10) }} 至 {{ serviceEndDate.substr(0, 10) }}(共30天)</span>
	      		</p>
		     		<p>
		     			<span>订阅价格：</span>
		     			<span><i>{{ type === 1 ? data.Golds : encryptedViewMonthGolds }}</i>G币</span>
		     		</p>
	      		<p v-if="authUser">
	      			<span>　用户名：</span>
	      			<span>{{ authUser.UserName }}</span>
	      		</p>
	        	<p>
							<span>　代金券：</span>
							<el-select v-model="voucher" placeholder="请选择">
								<el-option label="不使用代金券" value="0"></el-option>
								<el-option
									v-for="item in vouchers"
									:key="item.Id"
									:label="`${item.FaceValue}元代金券--${item.EndDate}过期`"
									:value="item.Id">
								</el-option>
							</el-select>
		        </p>
	      	</div>
		    <div class="open_footer">
		        <div class="warning" v-if="type === 2">订阅后即可查看此服务期限内本直播室的所有加密观点</div>
		       <el-button type="primary" @click="handlePay">确认</el-button>
		    </div>
	    </el-dialog>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import store from '@/store'
import * as types from '@/store/types'

export default {
  data: function () {
	  return {
      dialogVisible: false,
      // 是否停止销售
      isStop: this.data.Status == 1,
      // 可用代金券
      vouchers: [],
      // 购买类型<1: 单只 2: 包月>
      type: 0,
      // 选择的代金券
      voucher: null,
			// 包月停止付费时间，后端计算
			serviceEndDate: null,
	  }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  created: function() {

  },
  methods: {
    // 购买付费观点包
  	unlock (type) {
      Auth.isLogin().then(() => {
        const api = new Api()
        api.get('EncryptedView/TopicDetail', {
          id: this.data.ViewId,
          token: this.authToken,
          type: type
        }).then(resp => {
          this.isStop = resp.Status == 1
          this.vouchers = resp.Vouchers
          this.type = type
					this.serviceEndDate = resp.ServiceEndDate
          // 更新全局包月价格
          if (resp.MonthGolds != this.encryptedViewMonthGolds) {
            store.commit(types.UPDATE_ENCRYTED_VIEW_MONTH_GOLDS, resp.MonthGolds)
          }
          this.dialogVisible = true
        })
      }).catch(error => {
        Auth.openLoginDialog()
      })
  	},
    // 消费付费观点
    handlePay () {
      const api = new Api()
      const params = {
        id: this.data.ViewId,
        token: this.authToken,
        type: this.type
      }
      if (this.voucher > 0) {
        params.voucher_id = this.voucher_id
      }
      api.post('EncryptedView/Pay', params).then(resp => {
        this.dialogVisible = false
        // 重新加载购买记录
        // todo 直接修改vuex state
        this.getUserEncryptedView()
      })
    },
    // 停售付费观点
    stopSale () {
      this.$confirm('您确认需要下架此付费观点吗？', '提示').then(() => {
        const api = new Api()
        api.post('EncryptedView/StopSale', {
          token: this.authToken,
          id: this.data.ViewId
        }).then(() => {
          this.isStop = true
        })
      })
    },
    ...mapActions(['getUserEncryptedView'])
  },
  computed: {
    // 是否以购买
    isBuy () {
      if (!this.authUserEncryptedView) {
        return false
      } else if (this.authUserEncryptedView.month == 1) {
        return true
      } else {
        let index = this.authUserEncryptedView.single.findIndex(item => {
          return item == this.data.ViewId
        })
        return index !== -1
      }
    },
    ...mapGetters(['isTeacher', 'authToken', 'authUser', 'encryptedViewMonthGolds', 'authUserEncryptedView', 'roomData'])
  }
}
</script>

<style lang="less" scoped>
	.encry_item { margin-bottom: 8px;}
	.item-author { height: 60px;
    	.img-wrap { width: 53px; text-align: center; padding-top:7px; float: left;
    		> img { width: 40px; height: 40px ; border-radius: 50%;}
    	 }
    	.person-name { height: 50px; padding-top: 18px;  width: 557px; float: left;
    		> p { padding-left: 8px; height: 20px; margin-top:0 !important; line-height: 20px;
    		  > img { vertical-align: middle; vertical-align: middle; }

    		  .name { margin-left: 4px; margin-right:4px ; vertical-align: middle; font-weight: 600; color: #666666; }
    		  > span {display: inline-block; height: 20px; vertical-align: middle; font-size: 12px; }

    		  .time { color: #666666;}
    		}
    	}
    	.action-wrap { width: 80px; padding-top: 20px; float: left;
    		>span { border: 1px solid #ff775a; padding: 0 14px; color: #ff775a; cursor: pointer; border-radius: 2px;}
    	}

     }



	 .view-out { height: 50px; background: url(../../assets/view-out-bj1.jpg) repeat-x;
            .icon-wrap { height: 100%; text-align: center; line-height: 50px; width: 66px; float: left;
                i { font-size: 33px; color: #919191;}
            }
            .title { width: 624px; line-height: 50px; color: #919191; float: left;
            	> p { font-size: 14px; color: #949494; }
            }
        }
        .view-secret { display: block; height: 50px; background: url(../../assets/view-out-bj2.jpg) repeat-x; cursor: pointer; position: relative;
            // 20170808 彩霞说不要移入效果了
             /*&:hover .secret-hover{ display: block;}*/
            .icon-wrap { height: 100%; line-height: 50px; width: 66px; text-align: center; float: left;
                i { font-size: 33px; color: #FFFFFF;}
            }
            .title { width: 624px; line-height: 50px; color: #646464; float: left;
            	> p { font-size: 14px; color: #5d5d5d;}
            }

            .secret-hover { position: absolute; height: 50px; width: 100%; display: none; left: 0; display: block;
                .pcs, .month {width: 50%; float: left; line-height: 50px; color: #FFFFFF; text-align: center; font-size: 14px;
                        > span { font-size: 20px;}
                    }
                .pcs { background: #fd8402;}
                .month {background: #f8512f; overflow: hidden;
                    em {display: block; width: 77px;  height: 25px; font-weight: 700; line-height: 25px;  margin-top: 6px; margin-right: -24px; transform: rotate(45deg); background: #fffc00; color: #fc6a31;}
                }
            }
        }
        .view-unlock {
            .unlock-title {height: 30px; background: #fd8402; line-height: 30px;  color: #FFFFFF;
                i { font-size: 20px;};
            }
            .unlock-view {background: url(../../assets/view-out-bj2.jpg) repeat; padding: 13px 16px; font-size: 14px;
                p { line-height: 20px;}
             }
        }


        /*购买付费观点弹窗样式*/
       .open_wrap {
       		> div { width: 200px !important;}
       		.open_top { font-size: 18px; text-align: center; margin-bottom: 20px; font-weight: 600; color: #666666;}
       		.open_content { padding:0  80px; overflow: hidden; margin-bottom: 10px;
       			> p { height: 40px;  line-height: 40px;
       				> span { font-size: 16px; color: #666666;
       					> i { font-size: 16px; color:red;}
       				}
       				> span:nth-child(1) { }

       			}
       			> p:nth-last-of-type(1) { height: 40px; line-height: 40px;
       				> div { font-size: 16px; color: #666666;}
       			}


       		}
       		.open_footer { text-align: center;
       			> .warning { color: #fab536; text-align: left; padding-left: 80px;}
       			button { margin-top: 10px; background:#e43a3d; border: none;}
       		 }
       }


</style>
