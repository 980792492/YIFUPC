<template>
	<div class="article_wrap">
		<div class="article_text_wrap">
			<div class="title_wrap">
				<p><span>*</span>文章标题：</p>
				<div>
					<input type="text" v-model='title' maxlength="20"/> 必填，20字以内
				</div>
			</div>
			<div class="text_wrap">
				<p>文章介绍：</p>
				<div>
					<p>非必填，填写内容可包括：服务内容介绍、服务频率、购买者责任、过往战绩（禁止夸大虚假宣传！）等</p>
					<textarea v-model="info" name="" rows="" cols=""></textarea>
				</div>
			</div>
			<div class="text_content">
				<p class="left">文章正文：</p>
				<div class="left">
					<p>提交前请仔细检查，<span>提交后无法修改，也不能追加内容</span></p>
					<div class="edit_wrap">
          				<textarea id="txtbody" placeholder=""></textarea>
					</div>
				</div>
			</div>
			<div v-if="staticShow" class="adjunct_wrap">
				<p class="left">添加附件：</p>
				<div class="left">
					<!--<div class="btn_wrap left ">
						<input class="text" type="text" name="" readonly="readonly" id="text" placeholder="请选择你要上传的文件" v-model="fileSrc" /><a>浏览文件<input type="file" id="file" value=""   @change="change"/></a>
					</div>
					<button @click="upload">上传文件</button>
					选填，如有附件请仔细检查，大小2M以内-->
					<el-upload
					  class="upload-demo"
					  ref="upload"
              		  :action="uploadApi"
              		  :headers="uploadHeaders"
              		  :data="{ token: authToken, category: 0 }"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :file-list="fileList"
					  :before-upload="beforeUpload"
              		  :on-success="handleUpload"
					  :auto-upload="false">
					  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button><br/>
					  <span slot="tip" class="el-upload__tip"><i>附件请先选取文件再点击上传到服务器;只能上传pdf,txt,doc,ppt,xls,zip,rar格式的文件，如果为其他格式的文件请先压缩成rar或者ZIP</i>且大小不超过500kb</span>
					</el-upload>
					
				</div>
			</div>
		</div>
		<div v-if="staticShow" class="price_action_wrap">
			<div class="price_wrap">
				<p class="left"><span>*</span>价格：</p>
				<div class="left">
					<input type="text"  v-model="price" />必填，价格<span>1</span>G币以上，1G币等于1元
				</div>
			</div>
			<div class="time_wrap">
				<p class="left">停止销售时间：</p>
				<div class="left">
					<el-date-picker  class="stopsallTime"
							      v-model="timevalue2"
							      type="datetime"
							      format="yyyy-MM-dd HH:mm:ss"
							      placeholder="选择日期">
					</el-date-picker>停售后，用户将无法订阅，若不填则长期有效
				</div>
			</div>
			<div class="discount_wrap">
				<p class="left">促销方案：</p>
				<div class="discount left">
					<p>折扣力度1~10之间，小数点后1位，包月藏金阁折后最低价为<span>1</span>G币</p>
					<div class="discount_table">
						<div class="title">
							<div class="left">促销方案</div>
							<div class="left">折扣范围</div>
							<div class="left">折扣力度</div>
						</div>
						<div class="time">
							<div class="left"><label for="time"><input @click="check(1)" :checked="staticCheck == 1"   type="checkbox" name="promitType" id="time" value="" />限时</label></div>
							<div class="left">起止日期：
								<el-date-picker class="startTime"
							      v-model="timevalue3"
							      type="datetime"
							      :disabled="staticCheck != 1" 
							      :picker-options="pickerOptions0"
							      placeholder="选择日期时间">
								</el-date-picker>---
							    <el-date-picker class="endTime"
							      v-model="timevalue4"
							      type="datetime"
							      :disabled="staticCheck != 1" 
							      :picker-options="pickerOptions0"
							      placeholder="选择日期时间">
							    </el-date-picker>
							</div>
							<div class="left"><input   :disabled="staticCheck != 1"   :class="{checkbj:staticCheck == 1}"  v-model="disccount1" maxlength="3"   type="text" name="" id="" value="" />折</div>
						</div>
						<div class="commit">
							<div class="left"><label for="commit"><input  @click="check(2)"  :checked="staticCheck == 2" type="checkbox" name="promitType" id="commit" value="" />限额</label></div>
							<div class="left">前<input  :disabled="staticCheck != 2"  :class="{checkbj:staticCheck == 2}"  v-model="num"   type="text" />名购买者享受折扣</div>
							<div class="left"><input  :disabled="staticCheck != 2"   :class="{checkbj:staticCheck == 2}" v-model="disccount2" maxlength="3"  type="text" name="" id="" value=""  />折</div>
						</div>
						<div id="pay" class="pay">
							<div class="left"><label for="pay"><input  @click="check(3)"  :checked="staticCheck == 3"  type="checkbox" name="promitType" id="pay" value="" />消费</label></div>
							<div class="left">起止日期：
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
							 	<el-select  v-model="value"  :disabled="staticCheck != 3"  class="typecheck" >
								    <el-option
								      v-for="item in options"
								      :key="item.value"
								      :label="item.label"
								      :value="item.value">
								    </el-option>
								</el-select>
								消费金额 :
								<input class="accountnum"  :disabled="staticCheck != 3"  v-model="moneynum"  :class="{checkbj:staticCheck == 3}"  type="text" />
							</div>
							<div class="left"><input  :disabled="staticCheck != 3"  :class="{checkbj:staticCheck == 3}" maxlength="3"  v-model="disccount3"  type="text" name="" id="" value="" />折</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="agree_wrap">
			<input type="checkbox" checked="checked" @click="checkedFlag = !checkedFlag" name="" id="" value="" />
			我已阅读并自愿遵守<a href="">播主“藏金阁及文章”撰写规定”</a>
		</div>
		<div class="btn_wrap">
			<div class="warning_wrap">
				<div v-if="status == 1 &&　paywarning"><p><i class="icon iconfont icon-warning"></i>您的<span v-show="!title">付费文章标题；</span><span v-show="!price">付费文章的价格</span>未填写</p></div>
				<div v-if="status == 2 && freewarning"><p><i class="icon iconfont icon-warning"></i><span>您的免费文章标题未填写</span></p></div>
			</div>
			<button @click="submit">确认提交</button>
		</div>
	</div>
</template>

<script>
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'
import { mapGetters, mapState } from 'vuex'
	
	
export default {
	name:'article',
	data(){
		return {
			isPosting: 0,   //判断是否提交状态中,防止连续提交
			
			 fileList: [],
			
//			设置以付费形式展示的标记
			staticShow:true,
//			设置浏览文件的默认显示地址
			fileSrc:null,
			
			
			title:'',
			info:'',
			attachment:'',
			price:'',
			
			
//			设置停止销售时间
			timevalue2:'',
//			设置促销方案中的时间的默认值
			timevalue3:'',
			timevalue4:'',
			timevalue5:'',
			timevalue6:'',
			
			disccount1:'',
			disccount2:'',
			disccount3:'',
			discount:'',
			
			num:'',
			moneynum:'',
			
			pickerOptions0: {
	          disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	          }
	        },
//	                       设置折扣的默认选择
			staticCheck:null,
	        
	        
//		        设置折扣中select的可选值
	        options: [{
	          value: '0',
	          label: '全部'
	        }, {
	          value: '1',
	          label: '购买藏金阁'
	        }, {
	          value: '2',
	          label: '购买VIP直播'
	        }, {
	          value: '3',
	          label: '购买富团'
	        }, {
	          value: '4',
	          label: '购买视频课'
	        }, {
	          value: '5',
	          label: '投票'
	        }, {
	          value: '6',
	          label: '送礼'
	        }, {
	          value: '7',
	          label: '提问'
	        }],
	        value: '0',
	        
	        checkedFlag: true,   // 设置下方的遵守协议的选项
			}
	},
	props:{
		status:Number
	},
	mounted(){
		 // 初始化编辑器
	    this.$nextTick(() => {
	      this.txtbody = $('#txtbody').xheditor({
	        "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
	        "width":898,
	        "height":225,
	        "upImgUrl":"http://wxapi.yifucj.com/api/Image/UploadEditorImg?category=0",
	        "upImgExt":"jpg,jpeg,gif,png",
	        "localUrlTest":/^http?:\/\/[^\/]*?(yifucj\.com)\//i,
	        "remoteImgSaveUrl":"http://wxapi.yifucj.com/api/Image/UploadRemoteImg?category=0",
	        "emots":{
	          "yifu":{
	            "name":"一富",
	            "width":20,
	            "height":25,
	            "line":10,
	            "list":{
	              "hanx":"憨笑","kl":"骷髅","cd":"菜刀","xig":"西瓜","pj":"啤酒","lq":"篮球","pp":"乒乓","zt":"猪头","kf":"咖啡","fan":"饭","mg":"玫瑰","dx":"凋谢","sa":"示爱","ax":"爱心","dg":"蛋糕","sd":"闪电","zhd":"炸弹","dao":"刀","zq":"足球","pch":"瓢虫","bb":"便便","yl":"月亮","ty":"太阳","lw":"礼物","yb":"拥抱","qiang":"强","ruo":"弱","ws":"握手","shl":"胜利","bq":"抱拳","gy":"勾引","qt":"拳头","cj":"差劲","aini":"爱你","bu":"No","hd":"Ok","qsh":"潜水","jl":"敬礼","shh":"石化","anw":"安慰","bgl":"扮鬼脸","wy":"无语","kh":"狂汗","tq":"叹气","jy":"加油","shb":"生病","bt":"摆脱","gj":"孤寂","qy":"惬意","fzh":"烦躁"
	            }
	          }
	        }
	      })
	      // xheditor 在vue中的 bug ， 第一次加载高度计算会出错，强行重新设置
	      $('.xheIframeArea').css('height', 193);
	    })
	},
	destroyed () {
    	$('#txtbody').xheditor(false)
  	},
	methods:{
		submitUpload() {
	        this.$refs.upload.submit();
	    },
	    handleRemove(file, fileList) {
	        console.log(file, fileList);
	    },
	    handlePreview(file) {
	        console.log(file);
	    },
		beforeUpload (file) {
	      const isLogin = !!this.authToken
		  const allowList = ['pdf', 'txt', 'doc', 'docx', 'ppt', 'xls', 'zip', 'rar']
		  const isAllow = allowList.indexOf(file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase())
	      const isLt500K = file.size / 1024 < 500;
	
	      if (!isLogin) {
	        this.$message.error('您还未登陆!');
	      }

	      if (!( isAllow> 0)) {
	        this.$message.error('上传附件只支持‘pdf’,‘txt’,‘doc’‘ppt’‘xls’‘zip’‘rer’格式');
	        
	      }
	      if (!isLt500K) {
	        this.$message.error('上传图片大小不能超过 600KB!');
	      }
	      
	      return isLogin && isAllow > 0 && isLt500K;
		  
	    },
	    handleUpload (res, file) {
	      Api.handleResponse(res).then(resp => {
				this.attachment = resp.FileName
	      }).catch(error => {
	        console.log(error)
	      })
	    },
//		以付费或者免费形式展示
		showType(str){
			if(str == 1) {
				this.staticShow = true
			}
			if (str == 2){
				this.staticShow = false
			}
		},
//		浏览上传文件
		change(){
			var path = document.getElementById('file').value
			this.fileSrc = path
		},
		upload (){
			alert('点击了上传按钮')
		},
		check(str){
//			this.staticCheck = str
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
			if( !this.checkedFlag){
				this.$notify({
			          message: '请先选择并遵守播主规范',
			          type: 'warning'
		    	   });
				return false
			}
			if(this.isPosting) {
				return false
			}
			this.isPosting = 1
			
			this.discount = this.disccount1 || this.disccount2 || this.disccount3  || 0
      		const content = this.txtbody.getSource()
			
			if(!this.staticShow){
//				免费
				let params = {}
				params.token = this.authToken
				params.title = this.title
				params.introduce = this.info
				params.content = encodeURI(content)
				console.log(params)
				this.api.post('/Article/CreateFreeArticle', params).then(resp => {
					this.$notify({
			          title: '成功',
			          message: '创建免费文章成功',
			          type: 'success'
		    	   });
//		    	  	todo清空输入框
					this.isPosting = 0
				 this.$router.push({name:'index',params: {id: 'all'}})
				}).catch(() => {
					this.isPosting = 0
				})
			}else{
//				付费
				let params = {}
				params.token = this.authToken
				params.title = this.title
				params.introduce = this.info
				params.content = encodeURI(content)
				params.attachment = this.attachment
				params.price = this.price
				params.stop_sale_date = this.timevalue2
				
//				折扣数据
				if(this.staticCheck){
					params.promotion = {}
					params.promotion.promotion_type = this.staticCheck
					params.promotion.start_date = this.timevalue3 || this.timevalue5
					params.promotion.end_date = this.timevalue4 || this.timevalue6
					
					params.promotion.limit_count = this.num || 0
					params.promotion.consume_type = this.value
					params.promotion.gold = this.moneynum || 0
					
					params.promotion.disscount = this.discount
				}

				this.api.post('/Article/CreateArticle', params).then(resp => {
					this.$notify({
			          title: '成功',
			          message: '创建付费文章成功',
			          type: 'success'
		    	   });
					this.isPosting = 0
		    	   //  todo 清除输入框数据
				 this.$router.push({name:'index', params: { id: 'all'}})
				}).catch(() => {
					this.isPosting = 0
				})
			}
		},
//		格式时间数据
		formatDateTime(date){
			if(date){
				var y = date.getFullYear();  
			    var m = date.getMonth() + 1;  
			    m = m < 10 ? ('0' + m) : m;  
			    var d = date.getDate();  
			    d = d < 10 ? ('0' + d) : d;  
			    var h = date.getHours();  
			    var minute = date.getMinutes();  
			    minute = minute < 10 ? ('0' + minute) : minute;  
			    return y + '-' + m + '-' + d+' '+h+':'+minute;  
			}else{
				return ''
			}
			
		}
	},
	created(){
		this.showType(this.status)
		this.api = new Api()
		
	},
	update(){
//		console.log(this.status)
	},
	watch:{
		status(val){
			if( val ==1 ){
				this.staticShow = true
			}
			if(val == 2) {
				this.staticShow = false
			}
//			切换付费文章和免费文章数据清空
			this.title = ''
			this.info =''
			this.attachment = ''
			this.price = ''  
			this.fileList = []
			this.timevalue2 = ''
			this.timevalue3 = ''
			this.timevalue4 = ''
			this.timevalue5 = ''
			this.timevalue6 = ''
			this.disccount1 = ''
			this.disccount2 = ''
			this.disccount3 = ''
			this.discount = ''
			this.staticCheck = null
			this.num = ''
			this.moneynum = ''
		}
	},
	computed:{
		paywarning(){
			if(!this.title || !this.price){
				return  true
			}else {
				return false
			}
		},
		freewarning(){
			if(!this.title ){
				return  true
			}else {
				return false
			}
		},
		// 图片上传相关数据
	    uploadApi () {
	      return Api.getUrl('/File/Upload')
	    },
	    uploadHeaders () {
	      return { 'Authorization': Api.getAuthorization() }
	    },
    	...mapGetters(['authToken', 'authUser', 'roomId', 'topicId', 'isTeacher', 'isInviteTeacher'])
		
	}
}
</script>

<style lang="less" scoped>
	.article_wrap {
		.article_text_wrap {
			.title_wrap { height: 42px; line-height: 40px; margin-bottom: 28px; overflow: hidden;
				> p { width: 110px; float: left; text-align: right; font-size: 14px; font-weight: 600; color:#666666; 
					span{ color: #ff0101;}
				}
				> div { height: 40px; font-size: 14px; color: #999999; float: left;
					> input { height: 40px; width: 350px; border: 1px solid #cccccc; margin-right: 12px; outline: none; padding-left: 10px;}
				}
			} 
			.text_wrap {  overflow: hidden;
				> p { width: 110px; float: left; text-align: right; font-size: 14px; font-weight: 600; color:#666666; 
					span{ color: #ff0101;}
				}
				> div { font-size: 14px; color: #666666; float: left;
					> p { height: 28px; font-size: 14px;}
					> textarea { width: 900px; height: 65px; border: 1px solid #c5c5c5;  outline: none; resize: none;}
				}
			}
			.text_content { overflow: hidden; margin-bottom: 16px;
				> p { width: 110px; text-align: right; font-size: 14px; font-weight: 600; color: #666666;}
				> div { 
					> p { font-size: 14px; color: #666666; margin-bottom: 10px; 
						> span { color: #ff0101;}
					}
					div {  width: 898px; height: 228px;}
				}
			}
			.adjunct_wrap { overflow: hidden; padding-bottom: 20px;
				> P { width: 110px; text-align: right; line-height: 40px; font-size: 14px; font-weight: 600; color: #666666;} 
				> div { font-size: 14px; color: #999999; line-height: 40px;
					> .btn_wrap {  width: 352px; height: 40px;
						> .text { padding-left: 10px; width: 272px;  height: 40px; vertical-align: middle; border: 1px solid #CCCCCC; border-right: none;}
						> a { position: relative; overflow:hidden; display: inline-block; width: 80px; height: 40px; border: 1px solid #cccccc; vertical-align: middle; text-align: center; line-height: 40px; font-size: 13px; color: #676767;
							#file { position: absolute; font-size: 16px; top: 4px; left: 0;  filter:alpha(opacity=0) ; opacity: 0;}
						}
					}
					> button { margin-left: 15px; margin-right: 12px; width: 80px; height: 40px; border: none; background: #646464; font-size: 14px; color: #FFFFFF;}
					
				}
				.el-upload__tip {
					i { color:red; margin:0 5px;}
				}
			}
		}
		.price_action_wrap {
			.price_wrap { overflow: hidden; height: 40px; margin-bottom: 15px;
				> p { width: 110px; line-height: 40px; font-size: 14px; color: #666666; text-align: right; font-weight: 600; 
					> span { color: #ff0101; }
				}
				> div {
					> input {margin-right: 14px;  height: 40px; width: 350px; border: 1px solid #cccccc; outline: none;}
					> span { color: #ff0101; }
				}
			}
			.time_wrap {  overflow: hidden; height: 40px; margin-bottom: 15px;
				> p { width: 110px; line-height: 40px; font-size: 14px; color: #666666; text-align: right; font-weight: 600; 

				}
				> div { font-size: 14px; color: #666666;
					> input {margin-right: 14px;  height: 40px; width: 350px; border: 1px solid #cccccc;}
				}
				.stopsallTime { margin-right:10px}
				
			 }			
			.discount_wrap { overflow: hidden; margin-bottom: 15px;
				> p {width: 110px; line-height: 40px; font-size: 14px; color: #666666; text-align: right; font-weight: 600; }
				> .discount {
					> p {line-height: 40px; font-size: 14px; color: #666666; > span { color: #ff0101;}} 
					.discount_table { width: 898px; height: 212px; border-left: 1px solid #d4d4d4; border-top:1px solid #d4d4d4;
							> div {
								> div { height: 100%;} 
								> div:nth-child(1) { width: 114px; border-right: 1px solid #bfc1c0; font-size: 14px; font-weight: 600; color: #4e3133;}
								> div:nth-child(2) { width: 669px; border-right: 1px solid #bfc1c0; font-size: 14px; font-weight: 600; color: #4e3133;}
								> div:nth-child(3) { width: 114px; border-right: 1px solid #bfc1c0; font-size: 14px; font-weight: 600; color: #4e3133;}
							}
						.title { height: 31px; line-height:31px;  background:#d3d5d4;
							> div { padding-left: 8px;}
						}
						.time { height: 44px;
							> div { border-bottom: 1px solid #d4d4d4; background: #f5f5f5;}
							> div:nth-child(1) { line-height: 43px; padding-left: 20px;}
							> div:nth-child(2) { line-height: 43px;  padding-left: 15px;  
								.startTime { margin-left: 5px; margin-right: 5px;}
								.endTime { margin-left: 5px;} 
							}
							> div:nth-child(3) { line-height: 43px;  padding-left: 20px;
								> input { width: 48px; height: 22px; outline: none; margin-right: 10px; background: #EEF1F6; border: 1px solid #d1dbe5;}
							}
						}
						.commit{ height: 43px;
							> div { border-bottom: 1px solid #d4d4d4; background: #f5f5f5;}
							> div:nth-child(1) { line-height: 43px; padding-left: 20px;}
							> div:nth-child(2) { line-height: 43px; padding-left: 15px; 
								 > input { width: 58px; height: 22px;  outline: none; background: #EEF1F6; border: 1px solid #d1dbe5; margin: 0 5px;}
							}
							> div:nth-child(3) { line-height: 43px;  padding-left: 20px; 
								> input { width: 48px; height: 22px; outline: none; margin-right: 10px; background: #EEF1F6; border: 1px solid #d1dbe5;  }
							}
						}
						.pay {  height: 94px; 
							> div { border-bottom: 1px solid #d4d4d4; background: #f5f5f5;}
						
							> div:nth-child(1) { line-height: 94px; padding-left: 20px;}
							> div:nth-child(2) { line-height: 43px; padding-left: 15px;
								.startTime {width: 128px; margin-left: 5px; margin-right: 5px;}
								.endTime { width: 128px; margin-left: 5px;} 
								.typecheck {margin-left: 10px; width: 118px; margin-right: 20px;}
								.accountnum { width: 128px; height: 36px; outline: none; background: #EEF1F6; border: 1px solid #d1dbe5;}
							}
							> div:nth-child(3) { line-height: 43px;  padding-left: 20px;padding-top: 20px;
								> input { width: 48px; height: 22px; outline: none; margin-right: 10px; background: #EEF1F6; border: 1px solid #d1dbe5;}
							}
						}
					}
				}
			 }
			
			
		}
		
		> .agree_wrap { margin-left: 110px;
			 input { outline: none;};
			> a { color: #0099ff; }
		}
		> .btn_wrap {  text-align: center;padding-top: 27px; padding-bottom: 73px;
			.warning_wrap { height: 30px; line-height: 30px;
				p { padding: 0 100px; display: inline-block; color: #DB3735; background: #FBFB9F; font-size: 14px;
					i { font-size:18px;color:#DB3735; margin-right: 10px;}
					span{ font-size: 14px;}
				}
			}
		
			button { width: 300px; height: 50px; background: #e43a3d; color: #fffffd; font-size: 16px; border: none; margin-top: 10px;}
		}
	}

	/*设置折扣的选择背景色*/

	.checkbj { background: #FFFFFF!important;}
	
</style>