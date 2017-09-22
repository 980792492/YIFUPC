<template>
	<div class="cjg_wrap">
		<div class="title_wrap">
			<div class="title_check_wrap">
				<p class="title">藏金阁标题<span class="redflag">*</span>：</p>
				<div @click="tab('title',index)" class="title_check" :class="{action_color: staticTitle == index }" v-for="(item, index) in  ['自定义标题','独家自选股','精选策略','短线金股']">
					{{item}}
					<div v-if="staticTitle == index" class="dagou"></div>
				</div>
			</div>
			<div class="input_wrap" v-if="staticTitle == 0">
				<input v-model="title" placeholder="请输入自定义标题内容" type="text" maxlength="20" />自定义标题不超过20个字
			</div>
		</div>
		<div class="time_wrap">
			<div class="time_check_wrap">
				<p class="title">服务时长<span class="redflag">*</span>：</p>
				<div @click="tab('time',index)" class="title_check" :class="{action_color: staticTime == index }" v-for="(item, index) in  ['2天','7天','30天']">
					{{item}}
					<div v-if="staticTime == index" class="dagou"></div>
				</div>
				<div class="title_check">
					<input @change="changeCount" @focus="onFocus" placeholder="其他" type="text" v-model="otherDay" /> 
				</div>
				<div class="tishi">最长不超过60天</div>
			</div>
			<div class="time_detail_wrap">
				<div class="endSallTime">
					<p>停止销售时间<span class="redflag">*</span> :</p>
					<template>
					  <div class="block timecheck">
					    <el-date-picker
					      v-model="timevalue1"
					      type="datetime"
					      :picker-options="pickerOptions0"
					      placeholder="选择日期时间">
					    </el-date-picker>
					  </div>
					</template>
					<div class="tishi">停售后，用户将无法订阅，已订阅用户可继续查看</div>
				</div>
				<div class="endFuwuTime">
					<p>停止服务时间：</p>
					<template>
					  <div class="block">
					    <el-date-picker
					      v-model="timevalue2"
					      type="datetime"
					      disabled
					      placeholder="选择日期时间">
					    </el-date-picker>
					  </div>
					</template>
					<div class="tishi">服务到期后将不能追加</div>
				</div>
			</div>
		</div>
		<div class="cjg_text_wrap">
			<p class="text">藏金阁介绍：</p><p class="text_topic">非必填，填写内容可包括：藏经阁类型、服务内容介绍、服务频率、购买者责任、过往战绩（禁止夸大虚假宣传！）等</p>
			<textarea class="cjg_text_content"  v-model="info"  name="" rows="" cols=""></textarea>
		</div>
		<div class="cjg_main_text_wrap">
			<p class="title_wrap"><span class="text">藏金阁正文：</span><span class="tishi">提交前请仔细检查，</span><span class="wraning">提交后无法修改，只能追加内容</span></p>
			<div class="cjg_body">
				<div class="item">
					<p>我加入的自选股：</p>
					<input type="" v-model="my_stock" name="" id="" value="" />
				</div>
				<div class="item">
					<p>我关注的价位是：</p>
					<input type="" v-model="my_stock_price"  name="" id="" value="" />
				</div>
				<div class="item">
					<p>我的止盈价位是：</p>
					<input type="" v-model="my_stop_profit_price" name="" id="" value="" />
				</div>
				<div class="item">
					<p>我的止损价位是：</p>
					<input type="" v-model="my_stop_loss_price" name="" id="" value="" />
				</div>
				<div class="cjg_content_wrap">
					<p class="topic">我现在的策略是：</p>
					<div class="inner_text">
						<textarea id="txtbody" placeholder=""></textarea>
					</div>
				</div>
			</div>
		</div>
		<div class="price_wrap">
			<p>价格<span class="redflag">*</span>：</p>
			<div class="input_wrap">
				<input type="" v-model="my_price" name="" id="" value="" />必填，价格<i>1</i>G币以上，1G币等于1元
			</div>

		</div>
		<div class="sale_promit_wrap">
			<div class="top">
				<p>促销方案 ：</p>
				<div>折扣力度1~10之间，小数位后<span>1</span>位</div>
			</div>
			<div class="sale_body">
				<div class="topic_grid">
					<div>促销方案</div>
					<div>折扣范围</div>
					<div>折扣力度</div>
				</div>
				<div class="time_grid">
					<div><label  for="time"><input @click="check(1)"  type="checkbox" name="promitType" :checked="staticCheck == 1" id="time" value="" />限时</label></div>
					<div>起止日期：
						<el-date-picker class="startTime"
					      v-model="timevalue3"
					      type="datetime"
					      :disabled="staticCheck != 1"
					      :picker-options="pickerOptions1"
					      placeholder="选择日期时间">
						</el-date-picker>---
					    <el-date-picker class="endTime"
					      v-model="timevalue4"
					      type="datetime"
					      :disabled="staticCheck != 1"
					      :picker-options="pickerOptions1"
					      placeholder="选择日期时间">
					    </el-date-picker>
					</div>
					<div><input class="discountnum"  :class="{checkbj:staticCheck == 1 }"  type="text"  v-model.trim="disscount1"  :disabled="staticCheck != 1" maxlength="3" name="" id="" value="" />折</div>
				</div>
				<div class="commit_grid">
					<div><label for="commit"><input @click="check(2)"   type="checkbox" name="promitType" :checked="staticCheck == 2" id="commit" value="" />限额</label></div>
					<div>前<input :class="{checkbj:staticCheck == 2 }"  type="text" v-model="num"   :disabled="staticCheck != 2" />名购买者享受折扣</div>
					<div><input class="discountnum"  :class="{checkbj:staticCheck == 2 }"  type="text" v-model="disscount2"  :disabled="staticCheck != 2"  maxlength="3" name="" id="" value="" />折</div>
				</div>
				<div class="pay_grid">
					<div><label for="pay"><input  @click="check(3)"   type="checkbox" name="promitType" :checked="staticCheck == 3" id="pay" value="" />消费</label></div>
					<div>起止日期：
						<el-date-picker class="startTime"
					      v-model="timevalue5"
					      type="date"
					      :disabled="staticCheck != 3"
					      placeholder="选择日期">
					    </el-date-picker>---
				       	<el-date-picker  class="endTime"
					      v-model="timevalue6"
					      type="date"
					      :disabled="staticCheck != 3"
					      placeholder="选择日期">
					 	</el-date-picker><br/>
					 	消费类型 :
					 	<el-select  v-model="value" class="typecheck" :disabled="staticCheck != 3" >
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
						消费金额 :
						<input class="accountnum"  :class="{checkbj:staticCheck == 3 }"  v-model="moneynum"  type="text"  :disabled="staticCheck != 3" />
					</div>
					<div><input class="discountnum" :class="{checkbj:staticCheck == 3 }"   type="text"  v-model="disscount3" :disabled="staticCheck != 3"  maxlength="3" name="" id="" value="" />折</div>
				</div>
			</div>
			<div class="agree_text">
				<input type="checkbox" id="" value="" checked="checked" />我已阅读并自愿遵守<a href="">播主“藏金阁及文章”撰写规定</a>
			</div>
			<div class="button_wrap">
				<div class="warning_wrap" >
					<p v-if="warning"><i class="icon iconfont icon-warning"></i>您的<span v-show="!title">藏金阁标题;</span> <span v-show="staticTime == null">藏金阁服务时长；</span><span v-show="!timevalue1">藏金阁停售时间；</span><span v-if="!my_price">藏金阁价格</span><span v-if="promitWarning">；促销规则</span> 未填写完整</p>
				</div>
				
				<input type="button" :class="{disab: warning }" @click="submit" :disabled="warning"  name="" id="" value="确认提交" />
			</div>
		</div> 
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
export default {
	name:'cjg',
	data(){
		return {
			isPosting: 0,   //判断是否提交状态
//			设置标题的默认值
			staticTitle:null,
//			自定义标题（也可用作存放其他标题的title）
			title:'',
			staticTime:null,
//			设置其他天数的默认值
			otherDay:null,
//			设置参照的时日
			theDays:null,
//			设置时间可选值
			timevalue1:'',
			timevalue2:'',
//			藏金阁介绍
			info:'',
//			自选股信息
			my_stock:'',
//			自选股价位
			my_stock_price:'',
//			止盈价位
			my_stop_profit_price:'',
//			止损价位
			my_stop_loss_price:'',
//			价格
			my_price:'',
//			设置促销方案的选项框的默认值(也可做促销类型的方案)
			staticCheck:null,
			
			
			
//			折扣(页面展示)
			disscount1:null,
			disscount2:null,
			disscount3:null,
//			接口传参的折扣
			discount:0,
//			限额显示num
			num:'',
//			限额接口参数
			limitnum:0,
//			折扣处显示时间
			timevalue3:'',
			timevalue4:'',
			timevalue5:'',
			timevalue6:'',
			
			
//			接口传递的开始和结束时间参数
			startTime:'',
			endTime:'',
			
//			消费金额显示
			moneynum:null,
			consum:0,
			
//			设置过去时间不可选
			pickerOptions0: {
//	          disabledDate(time) {
////	          	console.log(this)
////	            return time.getTime() > Date.now() + (this.otherDay*12*60*60*1000);
//	          }
				disabledDate: time => {
					return  time.getTime() > Date.now() + (this.theDays*12*60*60*1000);
				}
	       },
			pickerOptions1: {
	          disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	          }
	        },
//	        设置select的可选值
	        options: [{
	          value: '0',
	          label: '全部类型'
	        }, {
	          value: '1',
	          label: '学堂投票'
	        }, {
	          value: '2',
	          label: '学堂提问'
	        }, {
	          value: '3',
	          label: '查看纸条'
	        }, {
	          value: '4',
	          label: '查看文章'
	        }, {
	          value: '5',
	          label: '学堂送礼'
	        }, {
	          value: '7',
	          label: '购买视频'
	        }, {
	          value: '9',
	          label: '购买VIP'
	        },{
	          value: '10',
	          label: '购买付费观点'
	        }],
	        value: '0'
			}
	},
	mounted(){
		 // 初始化编辑器
	    this.$nextTick(() => {
	      this.txtbody = $('#txtbody').xheditor({
	        "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
	        "width":660,
	        "height":90,
	        "upImgUrl":"http://wxapi.yifucj.com/api/Image/UploadEditorImg?category=0",
	        "upImgExt":"jpg,jpeg,gif,png",
	        "localUrlTest":/^http?:\/\/[^\/]*?(yifucj\.com)\//i,
	        "remoteImgSaveUrl":"http://wxapi.yifucj.com/api/Image/UploadRemoteImg?category=0",
	        "emots":{
	          "yifu":{
	            "name":"一富",
	            "width":20,
	            "height":20,
	            "line":10,
	            "list":{
	              "hanx":"憨笑","kl":"骷髅","cd":"菜刀","xig":"西瓜","pj":"啤酒","lq":"篮球","pp":"乒乓","zt":"猪头","kf":"咖啡","fan":"饭","mg":"玫瑰","dx":"凋谢","sa":"示爱","ax":"爱心","dg":"蛋糕","sd":"闪电","zhd":"炸弹","dao":"刀","zq":"足球","pch":"瓢虫","bb":"便便","yl":"月亮","ty":"太阳","lw":"礼物","yb":"拥抱","qiang":"强","ruo":"弱","ws":"握手","shl":"胜利","bq":"抱拳","gy":"勾引","qt":"拳头","cj":"差劲","aini":"爱你","bu":"No","hd":"Ok","qsh":"潜水","jl":"敬礼","shh":"石化","anw":"安慰","bgl":"扮鬼脸","wy":"无语","kh":"狂汗","tq":"叹气","jy":"加油","shb":"生病","bt":"摆脱","gj":"孤寂","qy":"惬意","fzh":"烦躁"
	            }
	          }
	        }
	      })
	      // xheditor 在vue中的 bug ， 第一次加载高度计算会出错，强行重新设置
	      $('.xheIframeArea').css('height', 56);
	    })
	},
	destroyed () {
    	$('#txtbody').xheditor(false)
  	},
	props:{
		status:Number
	},
	created(){
		this.api = new Api()
	},
	computed:{
		warning(){
			if( !this.title || this.staticTime == null || !this.timevalue1 || !this.my_price || this.promitWarning){
				return true
			}else {
				return false
			}
		},
		promitWarning(){
			if(this.staticCheck){
				if(this.staticCheck == 1) {
					if(this.timevalue3  && this.timevalue4 && this.disscount1){
						return false
					}else {
						return true
					}
				} 
			    if (this.staticCheck == 2) {
			    	if(this.num && this.disscount2) {
			    		return false;
			    	}else {
			    		return true
			    	}
			    } 
				if(this.staticCheck == 3 ){
					if( this.timevalue5 && this.timevalue6 && this.disscount3){
						return false;
					}else {
						return true
					}
				}
			}else {
				return false
			}
		},
		...mapGetters(['authToken'])
	},
	methods:{
		tab(str,index){
			if(str == 'title') {
				this.staticTitle = index
				switch (index){
					case 1 :
					this.title = '独家自选股'
					break;case 2 :
					this.title = '精选策略'
					break;case 3 :
					this.title = '短线金股'
					break;
					
				}
			}
			if (str == 'time') {
				this.staticTime = index
				let mydate = new Date().getTime()
				switch (index){
					case 0 :
					this.theDays = 2
					mydate = mydate + 2*24*60*60*1000 
					this.timevalue2 = mydate
					break;
					case 1 :
					this.theDays = 7
					mydate = mydate + 7*24*60*60*1000 
					this.timevalue2 = mydate
					break;
					case 2 :
					this.theDays = 30
					mydate = mydate + 30*24*60*60*1000 
					this.timevalue2 = mydate
					break;
				}
				this.timevalue1 = new Date().getTime() + (this.theDays)*12*60*60*1000
				
			}
		},
		onFocus(){
			this.staticTime = 999
		},
//		服务时长输入框发送变化
		changeCount(){
			if( this.otherDay >= 0 &&  this.otherDay < 61 ){
				let  mydate = new Date().getTime()
				mydate = mydate + this.otherDay*24*60*60*1000 
				this.timevalue2 = mydate
//				此次仅设置警告的藏金阁服务时长的显示问题
//				this.staticTime = 999
				this.theDays = this.otherDay
				this.timevalue1 = new Date().getTime() + this.otherDay*12*60*60*1000
			}else {
				  this.$notify({
		          	title: '警告',
		          	message: '请输入正确的时间',
		         	type: 'warning'
		       	 });
			}
		},
		check(str){
			this.disscount1 = null
			this.disscount2 = null
			this.disscount3 = null
			
			this.timevalue3 = ''
			this.timevalue4 = ''
			this.timevalue5 = ''
			this.timevalue6 = ''
			
			this.num = ''
			this.moneynum = ''
			console.log(str)
			switch (str){
				case 1:
					if( this.staticCheck == 1){
						this.staticCheck = null
					}else{
						this.staticCheck = 1
					}
					break;
				case 2:
					if( this.staticCheck == 2){
						this.staticCheck = null
					}else{
						this.staticCheck = 2
					}
					break;	
				case 3:
					if( this.staticCheck == 3){
						this.staticCheck = null
					}else{
						this.staticCheck = 3
					}
					break;	
				default:
					break;
			}
		},
		submit(){
			if(this.isPosting){
				return false
			}
			
			this.isPosting = 1    //将创建藏金阁的提交状态改成true
			if(this.warning) {
				 this.$notify({
		          title: '警告',
		          message: '提交前请检查数据是否非法',
		          type: 'warning'
		        });
				return false
			}
			
			this.discount = this.disscount1 || this.disscount2 || this.disscount3 || 0
      		const content = this.txtbody.getSource()
			
			this.startTime = this.timevalue3 || this.timevalue5
			this.endTime = this.timevalue4 || this.timevalue6
			this.consum = this.moneynum || 0
			this.limitnum = this.num || 0
			
			let params = {}
			params.token = this.authToken
			params.title = this.title
			params.stop_sale_date = new Date(this.timevalue1) 
			params.stop_service_date =new Date(this.timevalue2) 
			
//			测试数据
			var data = new Date(params.stop_service_date)
			
			params.introduce = this.info
//			正文
			params.stock = this.my_stock
			params.stock_price = this.my_stock_price
			params.stop_profit_price = this.my_stop_profit_price
			params.stop_loss_price = this.my_stop_loss_price
			params.content = encodeURI(content)
			params.price = this.my_price
			
//			促销
			if (this.staticCheck){
				params.promotion = {}
				params.promotion.promotion_type = this.staticCheck
				params.promotion.disscount = this.discount
				params.promotion.limit_count = this.limitnum
				params.promotion.start_date = this.startTime
				params.promotion.end_date = this.endTime
				params.promotion.consume_type = this.value
				params.promotion.gold= this.consum
			}
			this.api.post('/Article/CreateCjg', params).then(resp => {
				this.isPosting = 0
				
				this.$notify({
			          title: '成功',
			          message: '创建藏金阁成功',
			          type: 'success'
		    	 })
				 this.$router.push({name:'index', params: {id: 'all'}})
			}).catch( () => {
				this.isPosting = 0
			})
			
		},

	},
//		设置折扣的保留一位小数
	watch:{
		disscount1(str){
			console.log(str)
		}
	}
}
</script>

<style lang="less" scoped>
	* { font-size: 14px;}
	.cjg_wrap{
		.title_wrap {
			.title_check_wrap{ overflow: hidden;
				.title { float: left; font-size: 14px; font-weight: 600; line-height:40px ;  width: 100px; text-align: right; color: #666666;
					.redflag { color: #ff0101;}
				}
				.title_check { float: left; cursor: pointer; width: 145px; height: 40px; position: relative; border: 1px solid #cccccc; color: #666666; margin-left: 10px; text-align: center; line-height: 40px;
					.dagou { position: absolute; width: 22px; height: 22px; background: url(../../assets/dagou.png) no-repeat; right: 0; bottom: 0;}
				}
				.action_color {border-color: #ff9900; }
			}
			.input_wrap { margin-top: 11px;  margin-left: 10px; height: 40px; font-size: ; color: #999999;
				input { width: 300px; height: 40px; border: 1px solid #CCCCCC; font-size: 14px; padding-left: 12px; margin-right: 10px; margin-left: 100px;}
			}
		}
		.time_wrap { margin-top: 23px;
			.time_check_wrap { overflow: hidden;
				.title { float: left; font-size: 14px; font-weight: 600; line-height:40px ;  width: 100px; text-align: right; color: #666666;
					.redflag { color: #ff0101;}
				}
				.title_check { float: left; cursor: pointer; width: 145px; height: 40px; font-size: 13px; position: relative; border: 1px solid #cccccc; color: #666666; margin-left: 10px; text-align: center; line-height: 40px;
					.dagou { position: absolute; width: 22px; height: 22px; background: url(../../assets/dagou.png) no-repeat; right: 0; bottom: 0;}
					 > input { display: block; width: 100%;  height: 100% ; border: none; text-align: center; outline: none;}
				}
				.action_color {border-color: #ff9900; }
				.tishi { float: left; line-height: 40px; color: #999999; margin-left: 10px;}
			}
			.time_detail_wrap { margin-top: 14px;
				.endSallTime { overflow: hidden;
					> p { float: left; width: 100px;  height: 40px; text-align: right; line-height: 40px; margin-right: 10px; font-size: 14px; font-weight: 600; color: #666666;
						.redflag { color: #ff0101;}
					}
					.timecheck { float: left;}
					.tishi { float: left; height: 40px; line-height: 40px; color: #9a9a9a; margin-left: 12px;}
				}
				.endFuwuTime { margin-top: 16px; overflow: hidden;
					> p { float: left; width: 100px; height: 40px; text-align: right; margin-right: 10px; line-height: 40px; font-size: 14px; font-weight: 600; color: #666666;
						.redflag { color: #ff0101;}
					}
					> div { float: left;}
					.tishi { float: left; height: 40px; line-height: 40px; color: #9a9a9a; margin-left: 12px;}
				}
			}
		}
		.cjg_text_wrap {  margin-top: 25px;
			.text{ display: inline-block; width: 100px;  text-align: right; font-size: 14px; font-weight: 600; color: #666666;}
			.text_topic { display: inline-block; font-size: 13px; color: #666666;}
			.cjg_text_content { display: block; margin-left: 110px; margin-top: 13px; width: 890px; height: 70px; outline: none;}
		}
		.cjg_main_text_wrap {
			.title_wrap{line-height: 45px;
				.text {display: inline-block; width: 100px; font-size: 14px; font-weight: 600; color: #666666; text-align: right;} 
				.tishi { font-size: 14px; color: #666666;}
				.wraning {font-size: 14px; color: #fe0000; }
			 }
			.cjg_body { margin-left: 110px;background: #f5f5f5; width: 890px; height: 398px; padding: 0 13px;
				.item { border-bottom: 1px dashed #cccccc; height: 70px; padding-right: 36px; overflow: hidden;
					p { float: left; width: 145px; line-height: 74px; text-align: right; font-size: ; font-weight: 600; color: #666666;}
					input { width: 636px; padding-left: 10px; margin-left: 20px; font-size: 14px; height: 40px; margin-top: 17px; outline: none; border:1px solid #CCCCCC; }
				}
				.cjg_content_wrap {  overflow: hidden;
					.topic { float: left; width: 145px; text-align: right; font-size: 14px; font-weight: 600; color: #666666; padding-top: 18px;}
					.inner_text { float: left; width:660px; background: #FFFFFF; margin-top: 8px; margin-left: 20px;}
					img { float: left; width: 24px; height: 20px; margin-top: 65px; margin-left: 5px; cursor: pointer;};
				 }
			}
		}
		.price_wrap { height: 40px; margin-top: 12px;
			> p { float: left; width:100px ; text-align: right; line-height: 40px; font-size: 14px; font-weight: 600; color: #666666;
				.redflag { color: #fd0000;}
			}
			.input_wrap { float: left; margin-left: 10px;  color: #989898;
				input { width: 350px; height: 40px; padding-left: 10px; margin-right: 10px; border: 1px solid #CCCCCC; outline: none;}
				 i { color: #fd0000;}
			}
		}
		.sale_promit_wrap { 
			.top { height: 41px; line-height: 41px;
				> p { float: left; width: 100px; font-size: 14px; text-align: right; font-weight: 600; color: #666666;}
				> div { float: left; margin-left: 10px; color: #666666; 
					> span { color: #f30001;}
				}
			}
			.sale_body { width: 900px; height: 214px; border: 1px solid #d4d4d4; margin-left: 110px;
				> div { height: 31px; color: #4e3135; border-bottom: 1px solid #d4d4d4;
					>div:nth-child(1) { width: 114px; float: left; border-right: 1px solid #c1c1c1; font-size: 14px; padding-left: 10px;  line-height: 31px; 
						input { margin-left: 10px; margin-right: 5px; vertical-align: middle; outline: none;};
					}
					> div:nth-child(2) { width: 669px; float: left; border-right:1px solid #c1c1c1; font-size: 14px; padding-left: 10px; line-height: 31px;}
					> div:nth-child(3) { width: 113px; float: left; line-height: 31px; padding-left: 10px;  font-size: 14px; color: #4a3137;
						input {  width: 48px; height: 22px; margin-right: 10px; outline: none; background: #EEF1F6; border: 1px solid #d1dbe5;}
					}
				}
				.topic_grid { background: #dddfde; }
				.time_grid { height: 44px;
					> div { height: 44px;}
					> div:nth-child(2) { line-height: 43px; 
						.startTime { margin-left: 5px; margin-right: 5px;}
						.endTime { margin-left: 5px;} 
					}
					> div:nth-child(3) { line-height: 43px; 
					}
				}
				.commit_grid { height: 43px;
					> div { height: 43px;}
					> div:nth-child(2) { line-height: 43px; 
						 > input { width: 58px; height: 22px; border: 1px solid #d1dbe5; background:#EEF1F6 ; outline: none; margin: 0 5px;}
					}
					> div:nth-child(3) { line-height: 43px; 
					}
				}
				.pay_grid { height: 94px; border-bottom: none;
					> div { height: 94px;}
					> div:nth-child(2) { line-height: 43px; 
						.startTime {width: 128px; margin-left: 5px; margin-right: 5px;}
						.endTime { width: 128px; margin-left: 5px;} 
						.typecheck {margin-left: 10px; width: 118px; margin-right: 20px;}
						.accountnum { width: 128px; height: 36px; outline: none; background: #eef1f6; border: 1px solid #d1dbe5;}
					}
					> div:nth-child(3) { line-height: 43px; 
					}
				}
			}
		}
		.agree_text { margin-left: 110px; margin-top: 26px; font-size: 14px;
			input { outline: none;} 
		}
		.button_wrap { margin-top: 10px; text-align: center; padding-bottom: 52px;
			> input  { border-radius: 3px; width: 300px; margin-top: 10px; height: 50px; border: none; background: #db3738; color: #fffeff; font-size: 15px; outline: none; cursor: pointer;
				&:hover { background: #a01828;}
			}
			.disab { background: #CCCCCC;}
			.warning_wrap { height: 30px; line-height: 30px;
				> p { display: inline-block;  font-size: 14px; padding: 0 100px; margin: 0 auto; color: #DB3735; background: #FBFB9F;
					i { font-size:20px;color:#DB3735; margin-right: 10px;}
					> span { font-size: 14px;}
				}
			}
			
		}
		
		
		
	}


	/*设置折扣的选择背景色*/
	
	.checkbj { background: #FFFFFF!important;}
	

</style>