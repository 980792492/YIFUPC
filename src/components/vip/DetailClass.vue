<!--详情页面-->
<template>
	<div id="detail_class_wrap" class="detail_class_wrap" v-if="detailData">
		<!--老师的-->
		<div class="top" v-if="isTeacher">
			<p class="status_wrap left">
				<span>当前状态：</span>
				<span v-if="!detailData.EnableSubscribe">暂停订阅</span>
				<span v-if="detailData.EnableSubscribe" class="open_order">开启订阅中</span>
			</p>
			<p class="action_wrap right">
				<router-link :to="{name:'changesetview', query:{edit: detailData.Id}}"  target="_blank">修改特训班设置</router-link>
				<router-link target="_blank" :to="{name:'detaillive', params:{id: detailData.Id}}">进入特训班</router-link>
			</p>
		</div>
		<!--用户的-->
		<div class="student_top" v-if="!isTeacher &&　detailData.Accessibility">
			<p class="left">{{authUser.UserName}}，您的订阅期限为：{{detailData.StartDate}}至{{detailData.EndDate}} （共{{detailData.Days}}交易日），还有<span class="red">{{detailData.RemainingDays}}</span>天到期</p>
			<router-link :class="{user_right: !isTeacher }" class="right" target="_blank" :to="{name: 'detaillive', params:{id: detailData.Id}}">进入特训班</router-link>
		</div>
		
		<!--老师详情页，关闭订阅-->
		<div v-if="!detailData.EnableSubscribe" class="content  teacher_close">
			<div class="inner">
				<div class="icon_wrap">
					<span><i class="icon iconfont icon-suo"></i></span>
				</div>
				<p class="tishi">
					{{ isTeacher ? '您已关闭订阅，用户无法购买' : '老师暂停订阅，敬请等待下次开放，'}}
					<router-link v-if="!isTeacher" :to="{name: 'vipmain', params: {id: 'all'}}" target="_blank">查看更多特训班 > ></router-link>
				</p>
			</div>
		</div>
		
		<!--开启订阅-->
		<div v-if="detailData.EnableSubscribe" class="open_order" :class="isTeacher ? 'teacher_open_order' : 'user_open_order' ">
			<div class="top"><span class="left title">{{isTeacher ? '当前价格：' : '订阅周期：' }}</span>
				<div class="left">
					<div class="item left" v-for="(item, index) in priceList" :key="index" @click="elect(item, index)">
						{{item.PriceLevel}}交易日/<span>{{item.Price}}</span>G币
						<div  v-if="!isTeacher && staticItemIndex == index" class="dagou"></div>
					</div>
				</div>
			</div>
			<div class="youhui_wrap">
				<span class="left title">优惠信息：</span>
				<p class="info left" v-if="detailData.Promotion.Type"">
					<span>{{detailData.Promotion.StartDate}}至{{detailData.Promotion.EndDate}}</span>, 在本直播{{message}}满<span class="red">{{detailData.Promotion.Gold}}元，</span>可享受<span class="red">{{detailData.Promotion.Discount}}折优惠</span>
				</p>
				<p v-else class="info left">
					暂无优惠信息
				</p>
			</div>
			<div class="price_wrap" v-if="!isTeacher">
				<span class="left title">订阅价格：</span>
				<p class="detail left"><span>{{staticItem.Price}}</span>G币</p>
				<div class="clearn"></div>
				<p class="btn_wrap"><button @click="lijiorder">{{ detailData.Accessibility ? '立即续订' : '立即订阅'}}  </button></p>
			</div>
		</div>
		
		
		<div class="bottom">
			<p class="title">特训班说明</p>
			<div class="text">
				尾盘股的风格和规律,尾盘股的风格和规律,尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律尾盘股的风格和规律
			</div>
		</div>
		
		
		<!--点击立即订阅的弹窗-->
		<el-dialog
		  class="Pop_detail_wrap"
		  
		  :visible.sync="dialogVisible"
		  >
			<div class="pop_body" v-if="dialogData && !orderSuccess">
				<p class="title">请确认订阅信息</p>
				<div class="content_wrap">
					<p class="text"><span>订阅内容：{{dialogData.Title}}</span></p>
					<p class="timer">服务期限：{{dialogData.StartDate}}至<span>{{dialogData.EndDate}}</span>（共<span>{{dialogData.Days}}</span>交易日）</p>
					<p class="price_wrap">订阅价格：<span>{{dialogData.TruePrice}}</span>G币</p>
					<p class="name_wrap">用户名：{{dialogData.UserName}}</p>
					<div class="discount_wrap">
						<p><span>使用代金券</span><select v-model="voucher"  :disabled="!dialogVoucher.length > 0"  name="">
							<option :value="item" v-for="(item, index) in dialogVoucher" :key="index" value="0">{{item.Text}}</option>
							<option selected="selected" value="">无可用的代金券</option>
						</select></p>
						<p><span class="left">需花费<i>{{dialogData.TruePrice - ( voucher.Gold || 0 ) }}</i>G币</span> <span class="right">您的G币数：{{authUser.CurrentGcoinsCount}} <a target="_blank" href="//pay.yifucj.com" >充值>></a></span></p>
						<div class="clearn"></div>
					</div>
					<div class="tishi">
						<input type="checkbox" checked="checked" />我已经阅读并确认<a href="">一富财经免责条款</a>
						<p v-show=" !(authUser.CurrentGcoinsCount - (dialogData.TruePrice - ( voucher.Gold || 0 )) > 0 )" class="warning"><span><i class="icon iconfont icon-warning"></i></span>您的G币余额不足</p>
					</div>
				</div>
				<div class="btn_wrap">
					<button @click="submit" :class="{warning: !(authUser.CurrentGcoinsCount - (dialogData.TruePrice - ( voucher.Gold || 0 )) > 0 ) }" :disabled="!(authUser.CurrentGcoinsCount - (dialogData.TruePrice - ( voucher.Gold || 0 )) > 0 )">确认订阅</button>
				</div>
			</div>
			<div class="order_success" v-if="orderSuccess">
				<router-link :to="{name: 'detaillive', params:{id: detailData.Id}}" target="_blank">订阅成功，进入特训班 >> </router-link>
			</div>
		</el-dialog>
	</div>
</template>

<script>

import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'detailclass',
	data() {
		return {
			isStop: false,       /*关闭订阅*/
			detailData:{},     //页面数据绑定   
			hasorder: true,     /*已经订阅,用户用*/
			priceList: [], /*用户见价格列表以及服务选择列表*/
			staticItem: {},      /*用户的订阅选择,默认第一个*/
			staticItemIndex: 0,
			dialogVisible: false,   //弹窗显示标志
			dialogData: null,    //设置弹窗中的信息    
			dialogVoucher: [],  //代金券的列表
			voucher: {},        //默认使用的代金券	
			orderSuccess: false,     //购买特训班成功
		}
	},
	created(){
		this.api = new Api()
		this.initData()

		
	},
	methods: {
		initData(){
			let params = {}
			params.token = this.authToken
			params.teacher_id = this.$route.params.id
			this.api.get('/TrainingRoom/Info', params).then(resp => {

				this.detailData = resp
				this.priceList = this.detailData.Prices
				this.staticItem = this.priceList[0]
			})
		},
		elect(item, index){
			this.staticItem = item
			this.staticItemIndex = index
		},
		Popdetail(){  //渲染弹窗订购信息（点击了立即订阅按钮）
			let params = {}
			params.token = this.authToken
			params.id = this.detailData.Id
			params.level = this.staticItem.PriceLevel
			this.api.get('/TrainingRoom/Detail', params).then(resp => {
				this.dialogData = resp
				console.log(this.dialogData)
			})
		},
		PopVoucher(){  //渲染弹窗的优惠券信息 
			let params = {}
			params.token = this.authToken
			params.type = 1
			params.money = this.dialogData.TruePrice
			params.teacher_id = this.dialogData.TeacherId
			this.api.get('/Voucher/Available', params).then(resp => {
//				let list = [{Text:'优惠券1', Value: 1, Gold: 10},{Text:'优惠券2', Value: 2, Gold: 20},{Text:'优惠券3', Value: 3, Gold: 30},]
//				this.dialogVoucher = list
				this.dialogVoucher = resp
				this.voucher = this.dialogVoucher.length > 0 ?  this.dialogVoucher[0] : ''
			})
		},
		submit(){   //弹窗的弹出按钮
			let params = {}
			params.token = this.authToken
			params.id = this.detailData.Id
			params.level = this.staticItem.PriceLevel
			params.voucher_id = this.voucher.Value
			console.log(params)
			this.api.post('/TrainingRoom/Pay', params).then(resp => {
				this.orderSuccess = true
			})
		},
		lijiorder(){   //立即订阅按钮
			this.Popdetail()
			
			this.dialogVisible = true
		},
		...mapActions(['initUserData'])
	},
	computed: {
		message(){
			return this.detailData.Promotion.ConsumptionType == 0 ? '累计消费' : 
				   this.detailData.Promotion.ConsumptionType == 1 ? '学堂投票' : 
				   this.detailData.Promotion.ConsumptionType == 2 ? '学堂提问' : 
				   this.detailData.Promotion.ConsumptionType == 3 ? '查看纸条' : 
				   this.detailData.Promotion.ConsumptionType == 4 ? '查看文章' : 
				   this.detailData.Promotion.ConsumptionType == 5 ? '学堂送礼' : 
				   this.detailData.Promotion.ConsumptionType == 7 ? '购买视频' : 
				   this.detailData.Promotion.ConsumptionType == 9 ? '购买VIP' : 
				   this.detailData.Promotion.ConsumptionType == 10 ? '购买付费观点' : ''
		},
		isTeacher(){ 
//			判断是否为老师
//			console.log(this.detailData.UserId == this.detailData.TeacherId)
			return this.detailData.UserId == this.detailData.TeacherId
		},
		...mapGetters(['authUser', 'authToken'])
	},
	watch:{
		dialogData(val){
			this.PopVoucher()
		}
	}
}
</script>

<style lang="less">
#detail_class_wrap { background: #ffffff; padding: 40px 50px; height: 741px;
	/*老师内容头部*/
	.top { height: 80px;
		.status_wrap { padding-top: 12px;
			span:nth-child(1){ font-size: 14px; color: #333333; margin-right: 10px;}
			span:nth-child(2){ font-size: 16px; color: #666666;}
			.open_order { font-size: 16px; color: #666666; color: #e33a3d !important;}
		}
		.action_wrap { 
			a { display: inline-block; width: 250px; height: 50px; font-size: 16px; text-align: center; line-height: 50px;}
			a:nth-child(1) { border: 1px solid #e33b3b; border-radius: 35px; color: #e3393c; margin-right: 30px;}
			a:nth-child(2) { background: #e3ad41; border-radius: 35px; color: #FFFFFF;}
		}
	 }
	 /*用户内容头部*/
	 .student_top {	height: 100px;  background: #fdefef; line-height: 100px; margin-bottom: 30px;
	 	p {display: inline-block; font-size: 16px; color: #835940; padding-left: 40px; 
	 		 span.red { color: #e53b3c; font-size: 16px;}
	 	}
	 	a { display: inline-block; width: 250px; height: 50px; background: #e3ad41; line-height: 50px; border-radius: 35px; text-align: center; font-size: 18px;
	 	  margin-top: 25px; margin-right: 25px;  color: #FFFFFF;}
	 	.user_right{ width: 188px !important;}
	 }
	 
	 
	 
	 
	 /*老师关闭订阅*/
	.content { border-bottom: 1px solid #eeeeee; 
		.inner { height: 220px; background: #f2effa; margin-bottom: 26px; padding-top: 54px;
			.icon_wrap {  width: 76px; height: 76px; margin: 0 auto; padding-top: 4px; text-align: center; background: #d7d3e4; border-radius: 50%;
				span { display: block; margin: auto; border: 4px solid #f2effa; border-radius: 50%; width: 68px; height: 68px;padding-top: 5px;
					i { font-size: 45px; color: #f2effa;}
				}
			}
			.tishi { text-align: center; font-size: 18px; color: #988eb3; padding-top: 24px; 
				a { font-size: 16px; color: #c38846; }
			}
			
			
		}
	}
	/*老师开启订阅*/
	.open_order { height: 244px; border-bottom: 1px solid #eeeeee;
		.top { height: 77px; 
			.title { width: 86px; height: 77px; font-size: 14px; padding-top: 4px;}
			> div { width: 989px; height: 77px;
				.item { position: relative; width: 232px; height: 60px; border: 1px solid #e5dcdf; margin-left: 20px; text-align: center; line-height: 60px; font-size: 20px; cursor: pointer;
					span { color: #e43a3d; font-size: 20px; }
					.dagou { position: absolute; width: 21px; height: 21px; background: url(../../assets/dagou.png) no-repeat; bottom: 0; right: 0;}
				}
				.item:nth-child(1) { margin-left:0 ;}
			}
			
		}
		.youhui_wrap {
			.title { width: 86px; height: 77px; font-size: 14px; padding-top: 4px; line-height: 77px;}
			.info {width: 989px; height: 77px; padding-left: 24px;  background: #fceead; line-height: 77px; font-size: 16px; 
				span { font-size: 16px; font-weight: 600; }
				span.red { color: #e43a3d; font-size: 16px;}
			 }
		}
		.price_wrap {
			.title { width: 86px; height: 77px; font-size: 14px; padding-top: 4px; line-height: 77px;}
			.detail { height: 77px; line-height: 77px;  font-size: 14px;
				span { color: #e43a3d; font-size: 24px; margin-right: 6px;}
			}
			.btn_wrap { padding-left: 84px; 
				> button { width: 250px; height: 50px; border-radius: 35px; border: none; background: #e43a3d; font-size: 20px; color: #FFFFFF; outline: none; cursor: pointer;}
			}
		}
		
		
	}
	/*老师的可订阅的框的高度*/
	.teacher_open_order {height: 244px;}
	/*用户的可订阅的框的高度*/
	.user_open_order { height: 316px;}
	
	
	
	.bottom { padding-top: 30px;
		.title { font-size: 20px; color: #dfbe8b;}
		.text { line-height: 25px; color: #666666; padding-top: 21px; }
		
	
	}
	
	
	.Pop_detail_wrap { 
		.el-dialog {  width: 650px; height: 445px; 
			.pop_body { padding: 0 30px; padding-top: 30px;
				.title { text-align: center; height: 22px; line-height: 22px; font-size: 20px; color: #333333;}
				.content_wrap { padding-top: 22px;
					.text { height: 30px;
						span { font-size: 16px; color: #333333;}
					}
					.timer { height: 30px; font-size: 16px; color: #333333;
						span { font-size: 16px; color: #e43b3e;}
					}
					.price_wrap { font-size: 16px; height: 30px;
						span { font-size: 16px; color: #e43a3d;}
					}
					.name_wrap { font-size: 16px; height: 30px;}
					.discount_wrap {  height: 90px; background: #f5f5f5;padding: 0 55px; padding-top: 15px;
						>p:nth-child(1) { height: 45px; 
							span { display: inline-block; vertical-align: middle; width: 99px; height: 30px; text-align: center; color: #333333; line-height: 30px; border: 1px solid #cccccc; border-right: none;}
							select { width: 340px; height: 30px; outline: none; padding-left: 12px; color: #999999; border: 1px solid #cccccc; vertical-align: middle;}
							
						}
						>p:nth-child(2) { font-size: 14px; 
							span { font-size: 14px;
								i { font-size: 14px; color: #e43a3d;}
								a　{ font-size: 14px; color: #e43a3d;}
							}
						}
					}
					.tishi { height: 33px; line-height: 28px; position: relative;
						.warning { width: 100%; height: 28px; line-height: 28px; top: 0; padding-left: 8px; font-size: 14px; color: #E43A3D; ; background: #fbfba5; position: absolute;
							i { color: #E43A3D; font-size: 18px; margin-right: 6px}
						}
						
					
					}
				}
				.btn_wrap { text-align: center; 
					button { width: 300px; height:50px; border: none; background:#e43a3d; font-size: 14px; color: #FFFFFF; cursor: pointer;}
					.warning { background: #CCCCCC;}
				}
			}
			.order_success { text-align:  center; padding-top: 150px;
				a { display: inline-block; height: 30px; line-height: 30px;   font-size: 26px; font-weight: 600;}
			}
		}
	}
	
	
	
}


</style>