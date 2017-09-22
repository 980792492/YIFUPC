<template>
  <div class="content_detail">
    <div class="detail_left left">
    	<!--<div v-if="items.length > 0" class="noitem">
    		暂无已订阅特训班和可订阅特训班
    	</div>-->
    	<div  class="item_wrap" >
	      <!--<div class="item" v-for="item in items" :id="item.Id" >-->
	      <div class="item" v-for="(item, index) in items" :key="index" :id="item.Id" >
	      	
	      	<!--当前有订阅的特训班-->
	        <div class="item_order" v-if='item.PayStatus == 1'>
	        	<div class="title_wrap">
	        		<p class="title">{{item.TeacherName}}：{{item.Title}}</p>
	        		<p class="explain">{{item.Tintroduce}}</p>
	        	</div>
	        	<div class="text_wrap">
	        		<div class="price">
	        			<p>课程价格</p>
	        			<p>{{item.Gold}} <span>G币</span></p>
	        		</div>
	        		<div class="timer">
	        			<p>服务期限</p>
	        			<p>{{item.StartTime | toDate }} &nbsp;至  &nbsp;{{item.EndTime | toDate }}</p>
	        		</div>
	        		<div class="number">
	        			<p>剩余名额</p>
	        			<p><span>{{ item.LeftLimit > 0 ? item.LeftLimit+'个' : '无限制' }}</span></p>
	        		</div>
	        	</div>
	        	<div class="action_wrap">
	        		<p><span><i class="icon iconfont icon-daojishi"></i></span>距离上课时间还有：{{ restTime(item.t) }}</p> <button @click="go(item)">点击购买</button>
	        	</div>
	        	
	        	<!--订阅vip弹窗-->
	        	<el-dialog class="open_wrap"
					  :visible.sync="dialogVisible"
					  :before-close="handleClose">
					  <div class="open_title">请确认订阅信息</div>
					  <div class="detail_wrap">
					  	<p class="content_title">订阅内容：{{item.TeacherName}}{{item.Title}}</p>
					  	<p class="content_time">服务期限：{{item.StartTime}}至{{item.EndTime}}</p>
					  	<p class="content_price">订阅价格：<i>{{item.Gold}}</i>G币</p>
					  	<p v-if="authUser" class="content_name">用户名：{{authUser.UserName}}</p>
					  	<div class="content_quan_wrap">
					  		<div class="change_wrap">
					  			<p><em>使用代金券</em><select  v-model="changeitem" :class="{noitem: !quanitems.length > 0 }" :disabled="!quanitems.length > 0" name="" >
					  				<option :value="item" v-for="(item, index) in quanitems" :key="index"  >{{item.Text}}</option>
					  				<option selected="selected" value="">暂无可使用优惠券</option>
					  			</select></p>
					  		</div>
					  		<!--<p class="action_wrap"><em class="left">需花费<i v-if="changeitem">{{articleDetail.PurchasePrice - changeitem.Gold}}</i><i v-else>{{articleDetail.PurchasePrice}}</i>G币</em> <em class="right" v-if="authUser">您的G币数：{{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank" >充值>></a></em></p>-->
					  		<p class="action_wrap"><em class="left">需花费<i v-if="changeitem">{{item.Gold - changeitem.Gold}}</i><i v-else>{{item.Gold}}</i>G币</em><em class="right" v-if="authUser">您的G币数：{{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank" >充值>></a></em></p>
					  	
					  	</div>
					  </div>
					  <div class="order">
					  	<div class="warning_wrap">
					  		<p class="agree_check"><input type="checkbox" name="" id="" value="" checked="checked" />我已经阅读并确认<a style="color: #666666;" target="_blank" href="http://www.yifucj.com/Help/disclaimer">一富财经免责条款</a></p>
					  		<p v-if="warningshow" class="warning"><i class="icon iconfont icon-warning"></i><em>您的G币余额不足</em></p>
					  	</div>
					  	<input class="open_btn" :class="{disabledbtn: warningshow}" :disabled="warningshow"  type="button" @click="sureorder"   name="" id="" value="确定订阅" />
					  </div>
					</el-dialog>
	        	
	        	
	        </div>
	        <!--当前无可订阅的特训班-->
					<div class="item_ago" v-else >
						<p>
							<span class="icon_wrap"><i class="icon iconfont icon-dengji"></i></span>
							<span class="title">{{item.TeacherName}}：{{item.Title}}</span>
							<span class="timer">{{item.StartTime | toDate }}&nbsp; 至 &nbsp;{{item.EndTime | toDate}}</span>
						</p>
						<p :class="{ nowlive: item.type == 1 }">
							<a class="gonowlive"  v-if="item.Status == 11" :href="`//room.yifucj.com/VIP/Room/${item.Id}`" target="_blank" >正在直播</a>
							<span v-if="item.Status == 21" >服务结束</span>
							<span v-if="item.Status == 0 " >等待开播</span>
						</p>
					</div>
		  	</div>
			</div>
      <!--分页-->
      <div  class="pager" style="text-align: center;">
      	 <div class="block">
			    <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="page"
			      :page-sizes="[5, 10, 15, 20]"
			      :page-size="num"
			      layout="sizes, prev, pager, next, jumper"
			      :total="allCount">
			    </el-pagination>
			  </div>
      </div>
    </div>
    <div class="detail_right right">
      <!--<cjg-right></cjg-right>-->
    </div>
  </div>  
            
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import { toDate } from '@/utils/Filters'

export default {
  data(){
    return {
    	Type: 'passward',
    	dialogVisible: false,
//			设置优惠券的select的数组
			quanitems:[],
			changeitem: '',
//			设置购买默认数据
			buyitem: {},
			
      items:[],
      allCount:0,
			items:[],
      page: 1,
      num: 20,
      orders: []
    }
  },
  created () {
  	this.api = new Api()
    this.loadData(this.teacherId)
			
  },
  mounted(){
  	console.log(this.formats(1500461620804,'yyyy-MM-dd')) 
  	
  },
  methods: {
  	formats(str,fmt){
//			时间戳转成日期格式化
  			str = new Date(str)
			  var o = {
			    "M+": str.getMonth() + 1, //月份 
			    "d+": str.getDate(), //日 
			    "h+": str.getHours(), //小时 
			    "m+": str.getMinutes(), //分 
			    "s+": str.getSeconds(), //秒 
			    "q+": Math.floor((str.getMonth() + 3) / 3), //季度 
			    "S": str.getMilliseconds() //毫秒 
			  };
			  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (str.getFullYear() + "").substr(4 - RegExp.$1.length));
			  for (var k in o)
			  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			  return fmt;
  	},
  	 handleSizeChange(val) {
        this.num = val
    		this.loadData(this.teacherId)
      },
      handleCurrentChange(val) {
//      console.log(`当前页: ${val}`);
        this.page = val
    	  this.loadData(this.teacherId)
      },
  	restTime(str){
//	转换成秒
				const resttimes = str 
//			转换成分钟
				let d = 0, h= 0 , m = 0 , s = 0;
//				if (resttimes > 0 ){
					d = Math.floor(resttimes/60/60/24)
					h = Math.floor(resttimes/60/60%24)
					m = Math.floor(resttimes/60%60)
					s = Math.floor(resttimes%60) 
//				}
				return d+'天'+h+'小时'+m+'分钟'+s+'秒'
  	},
  	go(str){
  		this.buyitem = str
  //	  	判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
//	  	弹窗优惠券的弹窗
		this.dialogVisible = true
		let params = {}
		params.token = Auth.getToken()
		params.type = 1
		params.money = str.Gold
		params.teacher_id = str.TeacherId
		this.api.get('/Voucher/Available', params).then(resp => {
//			resp=[{Text:'yhq1', Gold:-100000, Value:1},{Text:'yhq2', Gold:200, Value:2},{Text:'yhq3', Gold:300, Value:3}]
			this.quanitems = resp
			this.changeitem = resp.length > 0 ? this.quanitems[0] : ''
		})
  		
  	},
  	handleClose(done) {
        done()
   },
   sureorder(){
   		let params = {}
   		params.id = this.buyitem.Id 
   		params.token = Auth.getToken()
   		params.voucher_id = this.changeitem.Value
   		this.api.post('/Vip/Pay', params).then(resp => {
// 				购买成功新窗口跳转到对应页面
					window.open('http://room.yifucj.com/VIP/Room/'+this.buyitem.Id+'')
   		})
   },
    loadData (id, page = 1) {
    	const api = new Api()
      if (id > 0) {
        let params = {
          page: this.page,
          num: this.num,
          token: this.authToken,
          teacher_id: id
        }
        api.get('Vip/info', params).then(resp => {

         	 this.items = resp.List
         	 this.allCount = resp.TotalCount
        })
      }
    },
//  分页加载更多
    loadOrder (id) {
      if (id > 0) {
//         this.api.get('/Vip/List', {teacher_id: id}).then(resp => {
//           console.log(resp)
////           this.orders = resp
//         })
      }
    }
  },
  watch: {
    teacherId (id) {
      if (id > 0) {
        this.loadData(id, 1)
        this.loadOrder(id)
      }
    }
  },
  filters:{
  	toDate
  },
  computed:{
  	warningshow(){
  		if (this.authUser && this.changeitem) {
  			if(this.buyitem.Gold - this.changeitem.Gold > this.authUser.CurrentGcoinsCount){
  				return true 
  			}
  		}
  	},
    ...mapGetters(['teacherId', 'authToken', 'authUser' ])
  }
} 
</script>

<style lang="less" scoped>
//      详细介绍模块
        .content_detail { width: 1175px; margin: 0 auto; overflow: hidden;
            .detail_left {width: 1175px; padding: 36px 66px; background: #FFFFFF;
            		.noitem { text-align: center;}
            		.item_wrap{ min-height: 710px; padding-bottom: 20px;}
            		.pager {height: 30px; text-align: center;
            			 > .block { display: inline-block; } 
            		}
                .item { margin-bottom: 8px; font-size: 14px;
                	* { font-size: inherit; }
                   	/*当前是可订阅的特训班的模块样式*/
                    .item_order {  width: 100%; margin-bottom: 20px; border-bottom: 1px dashed #CCCCCC; padding-bottom: 10px;
                    	> .title_wrap { 
                    		> p:nth-child(1) { font-size: 26px;}
                    		> p:nth-child(2) { font-size: 15px; line-height: 52px; color: #999999;}
                    	}
                    	> .text_wrap { height: 80px; background: #f7f7f7; padding: 13px  10px 10px 44px; 
                    		> .price { width: 250px; border-right: 1px dashed #cdcdcd; float: left;
                    			> p:nth-child(1) { height: 27px; font-size: 12px; color: #666666; padding-top: 3px;}
                    			> p:nth-child(2) { color: #e25147; font-size: 29px;
                    				> span { color: #e25147;}
                    			}
                    		}
                    		> .timer { width: 445px;  border-right: 1px dashed #cdcdcd; padding-left: 36px; float: left;
                    			> p:nth-child(1) { height: 27px; font-size: 12px; color: #666666; padding-top: 3px;}
                    			> p:nth-child(2) { font-weight: 700; font-size: 13px; line-height: 30px; }
                    		}
                    		> .number {width: 200px; padding-left: 22px; float: left;
                    			> p:nth-child(1) { height: 27px; font-size: 14px; color: #666666; padding-top: 3px;}
                    			> p:nth-child(2) {color: #c79963;
                    				> span {font-size: 26px;}
                    			 }
                    		 }  
                    	 }
                    	> .action_wrap { padding-top: 14px; /*overflow: hidden;*/

                    		> p { width: 893px; line-height: 42px; height: 42px; color: #666666; font-size: 17px;  float: left;
                    			> span { margin-right: 10px; 
                    				> i { font-size: 20px; font-weight: 600; color: #cdcdcd;} 
                    			}
                    		}
                    		> button { outline: none; width: 150px; height: 36px; border: none; background: #b53937; color: #FFFFFF; font-size: 18px; cursor: pointer;}
                    	}
                    }
                    
                    /*当前不是可订阅的特训班的模块的样式*/
                    .item_ago { width: 100%;  height: 50px; margin-bottom: 5px; background: #f7f7f7;  padding-left: 25px;
                    	> p:nth-child(1) { width: 870px; line-height: 50px; font-size: 14px; padding-left: 10px; float: left;
                    		 > .timer { }
                    		 > span { color: #666666; }
                    		 > .icon_wrap { 
                    		 	> i { font-size: 18px; color: #e1a637;}
                    		 }
                    		 > .title {display: inline-block; min-width: 220px; }
                    	}
                    	> p:nth-child(2) { width: 100px; height: 100%; background: #e9e7e8; color: #999999; line-height: 50px; float: right;
                    		> .gonowlive { display: block; text-align: center; color: #C69863;  background: #F1DECB; cursor: pointer;}
                    		> span { display: block; text-align: center; color: #999999;}
                    	}
                    	> .nowlive { background: #eedbc7 !important; 
                    		 > a { color: #c79963 !important;}
                    	 }
                    }
                }
            }
            .detail_right { width: 414px; background: #FFFFFF;
            }
        }
		
		.open_wrap { 
						.open_title { font-size: 20px; color: #343434; text-align: center; margin-bottom: 15px;}
						.detail_wrap { 
							.content_title { line-height: 30px; height: 30px; font-size: 16px; color: #323232;}
							.content_time { line-height: 30px; height: 30px; font-size: 16px; color: #323232; }
							.content_price { line-height: 30px; height: 30px; font-size: 16px; color: #323232;
								> i { font-size: 16px; color: #e4393f;}
							}
							.content_name { line-height: 30px; height: 30px; font-size: 16px; color: #323232;}
							
							.content_quan_wrap {  height: 90px; background: #f5f5f5; padding: 0 55px; padding-top: 15px;
								.change_wrap { 
									> p {
										> em { display: inline-block; width: 99px; height: 30px; text-align: center; vertical-align: middle; font-size: 14px; color: #333333; line-height: 30px; border: 1px solid #CCCCCC; border-right: none ;}
										> select { width: 340px; height: 30px; vertical-align: middle; border: 1px solid #CCCCCC;} 
										.noitem { color: #999999;}
									}
								}
								.action_wrap { height: 44px; line-height: 44px; font-size: 14px; color: #333333; 
									i { color: #fb0036;}
									a { color:#fe0002;}
								}
							}
						}
						
						.order { text-align: center; margin-top: ;
							.warning_wrap { position:relative;
								.agree_check { text-align: left; line-height: 24px; height: 35px;
									input { width: 12px; height: 12px;  margin-left: 0px; vertical-align: middle; margin-right: 6px; }
								}
								.warning { width: 100%; padding-left: 8px; height: 30px; font-size: 14px; line-height: 30px; color: #e6393d; text-align: left; background: #fbfba5; position:absolute; top: 0;
									i { margin-right: 6px; font-size: 20px; vertical-align: middle;}		
									em { vertical-align: middle;} 						
								 }
							}
							.open_btn { cursor: pointer; border: none; background: #F44C4C; color: #FFFFFF; width: 200px; height: 40px; font-size: 14px;}
							.disabledbtn { background: #e0e0e0; color: #FFFFFF;}
						}
					}
</style>