<template>
	<div class="pay_article_wrap">
		<div class="pay_article">
			<div class="pay_left left">
				<p class="title"><span class="cjgflag" v-if="articleDetail.Type == 1">CJG</span>{{articleDetail.Title}}</p>
				<p class="name_wrap">
					<img :src="articleDetail.HeadImg" alt="" /><span class="name" >{{TeacherInfo.UserName}}</span><span class="time">发表时间：{{articleDetail.CreateDate}}</span>
					<!--cjg-->
					<span v-if="articleDetail.Type == 1" class="fuwu_time right">服务时间：{{articleDetail.CreateDate}}至{{articleDetail.StopDate}}</span>
					<!--文章-->
					<!--<span v-else class="fuwu_time right">服务时间：{{articleDetail.CreateDate}}至{{articleDetail.StopDate}}</span>-->

				</p>
				<p class="tishi">{{articleDetail.Type == 1 ? '订阅后即可查看本文全部详细内容，在服务期限内老师可能随时更新，敬请关注' :  articleDetail.Type == 2 ? '此为付费文章，不提供后续追加服务，订阅后即可查看全文内容'  : '订阅后即可查看本文全部内容'}}</p>
				<div class="old_price">
					<span>原订阅价：</span>
					<span>{{articleDetail.Price}}G币</span>
				</div>
				<div class="discount_idea">
					<p class="left">优惠信息：</p>
					<p class="left nospecial" v-if="!saleDiscount">
							无优惠信息
					</p>
					<p class="left isspecial" v-if="saleDiscount && Promotion.Type == 1" >
						<span>{{Promotion.EndDate}}</span>分前订阅用户可享受<span>{{Promotion.Discount}}折优惠</span>
					</p>
					<p  class="left isspecial" v-if="saleDiscount && Promotion.Type == 2" >
						前<span>{{Promotion.LimitCount}}</span>名订阅用户享受<span>{{Promotion.Discount}}折优惠</span>，目前还有<span>{{Promotion.RemaingingCount}}</span>个优惠名额
					</p>
					<p  class="left isspecial" v-if="saleDiscount && Promotion.Type == 3" >
						{{Promotion.StartDate}}至{{Promotion.EndDate}},在本直播室{{payType}}消费满<span>{{Promotion.Gold}}元，</span>可享受<span>{{Promotion.Discount}}折优惠</span>
					</p>
					<div class="clearn"></div>
				</div>
				<div class="new_price">
					<span>订阅价格：</span>
					<span>{{articleDetail.PurchasePrice}}<i>G币</i> </span>
				</div>
				<div class="btn_wrap">
					<input v-if="!authUser || (authUser.Id != TeacherInfo.TeacherId && articleDetail.Status == 1)" class="pay_submit" @click="submit"  type="button" name="" id="" value="立即订阅" />
					<input v-else-if="authUser.Id != TeacherInfo.TeacherId && articleDetail.Status == 2" class="stopserver"  type="button" name="" id="" value="已下架" />
					<input v-else-if="authUser.Id != TeacherInfo.TeacherId && articleDetail.Status == 3" class="stopserver"  type="button" name="" id="" value="已停止服务" />
					<router-link v-else target="_blank" :to="{name:'detail', params:{id:this.$route.params.id}}"  class="pay_submit">查看详细</router-link>

					<span v-if="articleDetail.Type != 2 && articleDetail.Status == 1 "><i class="sanjiao"></i>{{t}}</span>
					<!--订阅弹窗信息-->
					<el-dialog class="payarticle_open_wrap"
					  :visible.sync="dialogVisible"
					  :before-close="handleClose">
					  <div class="open_title">请确认订阅信息</div>
					  <div class="detail_wrap">
					  	<p class="content_title">订阅内容：{{articleDetail.Title}}</p>
					  	<p class="content_time">服务期限：{{articleDetail.CreateDate}}至{{articleDetail.StopDate}}</p>
					  	<p class="content_price">订阅价格：<i>{{articleDetail.PurchasePrice}}</i>G币</p>
					  	<p v-if="authUser" class="content_name">用户名：{{authUser.UserName}}</p>
					  	<div class="content_quan_wrap">
					  		<div class="change_wrap">
					  			<p><em>使用代金券</em><select  v-model="changeitem" :class="{noitem: !quanitems.length > 0 }" :disabled="!quanitems.length > 0" name="" >
					  				<option :value="item" v-for="(item, index) in quanitems" :key="index"  >{{item.Text}}</option>
					  				<option selected="selected" value="">暂无可使用优惠券</option>
					  			</select></p>
					  		</div>
					  		<p class="action_wrap"><em class="left">需花费<i v-if="changeitem">{{articleDetail.PurchasePrice - changeitem.Gold}}</i><i v-else>{{articleDetail.PurchasePrice}}</i>G币</em> <em class="right" v-if="authUser">您的G币数：{{authUser.CurrentGcoinsCount}} <a href="//pay.yifucj.com" target="_blank" >充值>></a></em></p>
					  	</div>
					  </div>
					  <div class="order">
					  	<div class="warning_wrap">
					  		<p class="agree_check"><input type="checkbox" name="" id="" value="" checked="checked" />我已经阅读并确认<a target="_blank" href="http://www.yifucj.com/Help/disclaimer">一富财经免责条款</a></p>
					  		<p v-if="warningshow" class="warning"><i class="icon iconfont icon-warning"></i><em>您的G币余额不足</em></p>
					  	</div>
					  	<input class="open_btn" :class="{disabledbtn: warningshow}" :disabled="warningshow"  type="button" @click="sureorder"   name="" id="" value="确定订阅" />
					  </div>
					</el-dialog>
				</div>
				<div class="easy_info">
					<p class="info">简介：</p>
					<p class="detail">{{articleDetail.Description}}</p>
				</div>

			</div>
			<div class="pay_right right" v-if="TeacherInfo">
				<div class="right_top">
					<p class="img_wrap">
						<img  :src="TeacherInfo.HeadImg" alt="" />
					</p>
					<p class="info_wrap">
						<i class="name">{{TeacherInfo.UserName}}</i>
						<!--<span class="guanzhu">关注</span>-->
						<span :class=" careflag == 0 ? 'guanzhu' : 'yiguanzhu' " @click="care(careflag)" >{{careflag == 0 ? '关注' :'已关注'}}</span>
						<router-link  target="_blank" v-if="TeacherInfo.RoomId > 0" :to="{name:'live-main', params:{id:TeacherInfo.RoomId}}" class="zhibo"  >看直播</router-link>
					</p>
					<p class="detail_wrap">
							{{TeacherInfo.Info}}
					</p>
				</div>
				<div class="right_botttom">
					<p class="title_wrap" v-if="TeacherInfo">
						TA的其它文章<router-link target="_blank" class="right" :to="{name:'cjg', params:{id:TeacherInfo.RoomId}}" >更多...</router-link>
					</p>
					<div class="item detail_wrap" v-for="(item, index) in otherArticle">
						<router-link target="_blank" class="text" :to="{name:'detail', params:{id:item.Id}}" ><span></span>{{item.Title}}</router-link>
						<p class="time">{{item.CreateDate}}</p>
					</div>

				</div>
			</div>
			<div class="clearn"></div>
		</div>
	</div>
</template>

<script>
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import { mapGetters } from 'vuex'

export default{
	name:'payarticle',
	data(){
		return {
			careflag:0,
//			是否有促销信息
			saleDiscount:0,
//			具体优惠信息
			Promotion: {},
//			文章信息
			articleDetail: {},
//			老师信息
			TeacherInfo: {},
//			TA的其他文章数据
			otherArticle: [],

			dialogVisible: false,
//			设置优惠券的select的数组
			quanitems:[],
			changeitem: ''
		}
	},
	created(){
//		购买页面检测是否登录状态
		// if(!this.authUser){
		// 	Auth.openLoginDialog()
		// 	return false;
		// }

		this.api = new Api()
		let params = {}
		params.token = this.authToken
		params.id = this.$route.params.id
		this.api.get('/Article/Info', params).then(resp => {
			this.careflag = resp.TeacherInfo.Attaction
			this.articleDetail = resp.Detail
			this.TeacherInfo = resp.TeacherInfo
			this.otherArticle = resp.OtherArticle

			this.saleDiscount = resp.HasPromotion
			this.Promotion = resp.Promotion
		})
	},
	mounted(){
//		console.log(this.TeacherInfo)
	},
	methods: {
	  submit(){
//	  	判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
//	  	弹窗优惠券的弹窗
		this.dialogVisible = true
		let params = {}
		params.token = this.authToken
		params.type = this.articleDetail.Type
		params.money = this.articleDetail.PurchasePrice
		params.teacher_id = this.TeacherInfo.TeacherId
		this.api.get('/Voucher/Available', params).then(resp => {
//			resp=[{Text:'yhq1', Gold:-10000, Value:1},{Text:'yhq2', Gold:200, Value:2},{Text:'yhq3', Gold:300, Value:3}]
			this.quanitems = resp
			this.changeitem = resp.length > 0 ? this.quanitems[0] : ''
		})
	  },
	  handleClose(done) {
        done()
     },
      sureorder() {
        let params = {}
        params.id = this.$route.params.id
        params.token = this.authToken
        params.voucher_id = this.changeitem.Value
        this.api.post('/Article/Pay', params).then(resp =>　{
        	 this.$notify({
	          title: '成功',
	          message: '订阅成功',
	          type: 'success'
	        })
        	this.$router.push({name:'detail', params:{id:this.$route.params.id}})
        })
      },
    formatDate(str){
    	if(str < 0) {
    		return   '可永久购买！'
    	}
//  	天
    	var d = parseInt(str)/( 60 * 60 * 24 )
//  	小时
    	var h = (parseInt(str)%(60 * 60 * 24))/(60*60)
//  	分钟
		var m = (parseInt(str)%(60*60*24)%(60*60))/(60)
//  	秒
//		var s = parseInt(str)%(60*60*24)%(60*60)%60

    	return   '在'+parseInt(d)+'天'+parseInt(h)+'小时'+parseInt(m)+'分钟后停止购买！'
    },
    care(str){
//    		判断是否登陆
		if(!this.authUser) {
			Auth.openLoginDialog()
			return false
		}
		str = Number(str)
		let params = {}
		params.token = this.authToken
		params.room_id = this.TeacherInfo.RoomId
		params.type = str
		console.log(params)
		this.api.post('/Room/Like', params).then(resp => {
//				if(str){
				this.$notify({
		          title: '成功',
		          message: str ? '已取消关注':'关注成功',
		          type: 'success'
	    	  	});
//				}
			this.careflag = !this.careflag
		})
    }
  },
  computed: {
  	t(){
  		return this.formatDate(this.articleDetail.t)
  	},
  	payType(){
  		let str = ''
  		if (this.Promotion.ConsumptionType == 0){
  			str = '累计'
  		}
  		if (this.Promotion.ConsumptionType == 1){
  			str = '学堂投票'
  		}
  		if (this.Promotion.ConsumptionType == 2){
  			str = '学堂提问'
  		}
  		if (this.Promotion.ConsumptionType == 3){
  			str = '查看纸条'
  		}
  		if (this.Promotion.ConsumptionType == 4){
  			str = '查看文章'
  		}
  		if (this.Promotion.ConsumptionType == 5){
  			str = '学堂送礼'
  		}

  		if (this.Promotion.ConsumptionType == 7){
  			str = '购买视频'
  		}
  		if (this.Promotion.ConsumptionType == 9){
  			str = '购买VIP'
  		}
  		if (this.Promotion.ConsumptionType == 10){
  			str = '购买付费观点'
  		}
  		return str
  	},
  	warningshow(){
  		if (this.authUser && this.changeitem) {
  			if(this.articleDetail.PurchasePrice - this.changeitem.Gold > this.authUser.CurrentGcoinsCount){
  				return true
  			}
  		}
  	},
	...mapGetters(['authUser', 'authToken'])
  }
}
</script>

<style lang="less" scoped>
	* { font-size: 14px;}

	.pay_article_wrap { width: 100%; background: #E3E3E3; padding-top: 15px; padding-bottom: 35px;
		.pay_article { width: 1175px;height: 1186px;  margin: 0 auto; background: #FFFFFF;
			.pay_left { width: 874px;  background: #FFFFFF; padding:0 50px;padding-top: 45px;
				.title { text-align: center; font-size: 30px; color: #333333; height: 62px;
					.cjgflag { display: inline-block; height: 30px; vertical-align: middle; line-height: 30px; margin-right: 10px; padding:0 15px ; font-size: 20px; background: #F79900; border-radius: 15px; color: #FFFFFF; }

				}
				.name_wrap { height: 45px; border-bottom: 1px solid #EEEEEE;
					img,span { vertical-align: middle;}
					img { width: 30px; height: 30px; border-radius: 50%;}
					.name { margin-left: 7px; margin-right: 18px; font-size: 16px; color: #343434;}
					.time { color: #989898;}
					.fuwu_time { color: #989898; padding-top: 6px;}
				}
				.tishi { color: #ff6600; text-align: center; font-size: 16px; height: 73px; line-height: 73px;}
				.old_price { padding-bottom: 21px;
					> span { display: inline-block; font-size: 14px; color: #323232; }
					>span:nth-child(1){ width: 92px; text-align: right; }
					>span:nth-child(2){ text-decoration: line-through;}
				}
				.discount_idea { padding-bottom: 20px;
					> p:nth-child(1) { width: 92px; text-align: right; font-size: 14px;color: #323232; }
					> p:nth-child(2) { width: 677px; height: 77px; background: #fceead; margin-left: 4px;}
					.nospecial { line-height: 77px; text-indent: 24px; font-size: 14px; color: #343434;}


					.isspecial { line-height: 77px; text-indent: 24px; font-size: 14px; color: #333333;
						> span { color: #e33a3d; font-size: 16px;}
					 }


				}
				.new_price {  padding-bottom: 39px;
					> span { display: inline-block; font-size: 14px; color: #323232; }
					>span:nth-child(1){ width: 92px; text-align: right; }
					>span:nth-child(2){ font-size: 24px; color: #e43a3d;
						i { color: #333333;}
					}
				}
				.btn_wrap { padding-bottom: 51px; border-bottom: 1px solid #eeeeee;
					input { width: 210px; height: 55px; border: none; background: #e43a3d; font-size: 18px; color: #FFFFFF; margin-left: 98px;}
					span { position: relative; margin-left: 13px; display: inline-block; width: 242px; height: 30px; background: #EEEEEE; line-height: 30px; text-align: center; color: #666666; border-radius: 5px;
						.sanjiao { position: absolute; left: -6px;top: 10px; display: inline-block; border-top:6px solid transparent ; border-bottom: 6px solid transparent; border-right: 6px solid #EEEEEE;}
					}
					.pay_submit { cursor: pointer; display: inline-block; vertical-align: middle; text-align: center;line-height: 55px;  width: 210px; height: 55px; border: none; background: #e43a3d; font-size: 18px; color: #FFFFFF; margin-left: 98px;}
					.stopserver { background: #C1C1C1;}
					.payarticle_open_wrap {
						.open_title { font-size: 20px; color: #343434; text-align: center; margin-bottom: 15px; padding: 0 40px;}
						.detail_wrap { padding: 0 40px;
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
								.action_wrap { height: 44px; line-height: 44px; font-size: ; color: #333333; padding-right: 20px;
									i { color: #fb0036;}
									a { color:#fe0002;}
								}
							}

						}



						.order { text-align: center; margin-top: ; padding: 0 40px;
							.warning_wrap { position:relative;
								.agree_check { text-align: left; line-height: 24px; height: 35px;
									input { width: 12px; height: 12px;  margin-left: 0px; vertical-align: middle; margin-right: 6px; }
									a { color: #666666;
										&:hover { color: #E23C3C;}
									}
								}
								.warning { width: 100%; padding-left: 8px; height: 30px; font-size: 14px; line-height: 30px; color: #e6393d; text-align: left; background: #fbfba5; position:absolute; top: 0;
									i { margin-right: 6px; font-size: 20px; vertical-align: middle;}
									em { vertical-align: middle;}
								 }
							}
							.open_btn { cursor: pointer; margin-left: 0;}
							.disabledbtn { background: #e0e0e0; color: #FFFFFF;}
						}
					}



				}
				.easy_info { padding-top: 7px;
					.info { line-height: 44px; font-size: 16px; color: #666666; font-weight: 600;}
					.detail { line-height: 25px; font-size: 14px; text-indent: 28px; color: #666666; word-break: break-word;}
				}


			 }
			.pay_right { width: 301px; height: 100%; background: #FFFFFF; padding-top: 29px; border-left: 1px solid #E3E3E3;
				.right_top {
					.img_wrap {  text-align: center;
						img { width: 90px; height: 90px; border-radius: 50%;}
					}
					.info_wrap { height: 44px; line-height: 44px; text-align: center;
						.name { font-size: 16px; color: #333333;}
						.guanzhu { display: inline-block; width: 62px; height: 24px; border: 1px solid #e6393b; line-height: 24px; border-radius: 5px; margin-left: 17px;}
						.zhibo { display: inline-block; width: 62px; height: 24px; border: 1px solid #e6393b; line-height: 24px; border-radius: 5px; margin-left: 7px;}
					 	> .yiguanzhu { cursor:pointer; border-color: #cccccc;  color: #cbcbcb; }
						> a,span { cursor: pointer; display: inline-block; margin-left: 6px; width: 62px; height: 24px; font-size: 13px; color: #e43a3d; line-height: 24px; text-align: center; border: 1px solid #e43a3d; border-radius: 4px;}

					}
					.detail_wrap { line-height: 20px; word-break: break-all; font-size: 14px; color: #676767; padding-left: 20px; padding-right: 28px; padding-bottom: 16px; border-bottom: 1px solid #EEEEEE;}
				}
				.right_botttom { padding-top: 36px; padding-left: 20px; padding-right: 23px;
					.title_wrap { font-size: 17px; color: #323232; height: 41px;
						a { color: #323233;
							&:hover { color: #ec5d35;}
						}
					}
					.detail_wrap {
						.text {display: block; font-size: 13px; color: #343434; width: 256px; height: 17px; line-height: 17px; white-space: normal; text-overflow: ellipsis; overflow: hidden;
					 		&:hover { color: #ec5d35; }
							span {display: inline-block; width: 0; height: 0;  border: 3px solid #cdcdcd;  border-radius: 50%;  margin-right: 12px; }
						 }
						 .time { line-height: 40px; height: 40px;  color: #9a9a9a;  padding-left: 16px; font-size: 12px; }
					}
				}
			}
		}
	}

</style>
