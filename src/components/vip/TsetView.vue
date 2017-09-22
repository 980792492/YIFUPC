<template>
	<div class="Tset_wrap">
		<div class="content">
			<div class="title_wrap">
				<span class="left">特训班标题<i>*</i> :</span>
				<p class="left"><input type="text"  v-model="title" />请为你的特训班起个响亮的标题，不超过15个字</p>
			</div>
			<div class="txb_info">
				<span class="left">特训班介绍 :</span>
				<p class="left">非必填，填写内容可包括：服务内容介绍、服务频率、购买者责任、过往战绩（禁止夸大虚假宣传！）等</p>
				<div class="clearn"></div>
				<div class="input_wrap">
					<textarea  v-model="introduce" name="" rows="" cols=""></textarea>
				</div>
			</div>
			<div class="key_wrod">
				<span class="left">关键词:</span>
				<p class="left"><input maxlength="10"  v-model="keywords0" type="text" /><input maxlength="10" v-model="keywords1" type="text" />最多可填2个关键词，每个关键词限10个字，例如“中短结合” “干货技术” 等</p>
			</div> 
			<div class="price_set">
				<span class="left">价格设置:</span>
				<p class="left">请至少填写1种大于0的期限价格（整数），不填或填写为0则表示不设置此种服务期限</p>
				<div class="clearn"></div>
				<div class="price"><span><i>2</i>交易日价格 :</span><input v-model="price0" type="text" /></div>
				<div class="price"><span><i>5</i>交易日价格 :</span><input v-model="price1"  type="text" /></div>
				<div class="price"><span><i>15</i>交易日价格 :</span><input v-model="price2"  type="text" /></div>
				<div class="price"><span><i>30</i>交易日价格 :</span><input v-model="price3" type="text" /></div>
			</div>
			<div class="discount_wrap">
				<span class="left">促销方案	：</span>
				<p class="left">折扣力度1~10之间，小数位后1位</p>
				<div class="clearn"></div>
				<div class="discount">
					<div class="title_wrap">
						<div class="left">促销方案</div>
						<div class="left">折扣范围</div>
						<div class="left">折扣力度</div>
					</div>
					<div class="time_wrap">
						<div class="left">
							<input @click="selectPromot(1)" :checked="promot == 1" type="checkbox" value="" /><i>限时</i>
						</div>
						<div class="left">
							<el-date-picker
							  class="vip_create_time"
						      v-model="value1"
						      type="datetime"
						      :disabled="promot != 1"
						      placeholder="选择日期时间">
						    </el-date-picker>
							--
							<el-date-picker
							  class="vip_create_time"
						      v-model="value2"
						      type="datetime"
						      :disabled="promot != 1"
						      placeholder="选择日期时间">
						    </el-date-picker>
							
						</div>
						<div class="left">
							<input v-model="discount1" maxlength="3" class="discount_input" :disabled="promot != 1" type="text" /><i>折</i>
						</div>
					</div>
					<div class="xiaofei_wrap">
						<div class="left">
							<input  @click="selectPromot(3)" :checked="promot == 3" type="checkbox" value="" /><i>消费</i>
						</div>
						<div class="left">
							<el-date-picker
							  class="vip_create_time"
						      v-model="value3"
						      type="datetime"
						      :disabled="promot != 3"
						      placeholder="选择日期时间">
						    </el-date-picker>
							--
							<el-date-picker
							  class="vip_create_time"
						      v-model="value4"
						      type="datetime"
						      :disabled="promot != 3"
						      placeholder="选择日期时间">
						   </el-date-picker>
							<br/>
							<div class="leixing">
								消费类型：  
									<el-select  class="vip_create_select"  :disabled="promot != 3"  v-model="value" placeholder="请选择">
						    		<el-option
						      			v-for="item in options"
						      			:key="item.value"
						      			:label="item.label"
						      			:value="item.value">
						    		</el-option>
						 	 		</el-select>
						 	 	消费金额 ：<input v-model="gold" class="pricenum discount_input" :disabled="promot != 3"  type="text" />
							</div>
						</div>
						<div class="left">
							<input  v-model="discount2" maxlength="3" class="discount_input" type="text" :disabled="promot != 3" /><i>折</i>
						</div>
					</div>
				</div>
			</div>
			<div class="btn_wrap">
				<div>
					<span class="left">是否开启订阅 :</span><p class="left"><img @click="orderFlag =Number(!orderFlag)" :src="require(`../../assets/vip_open${orderFlag}.png`)"/></p>
				</div> 
				<div>
				<span class="left">是否开启互动 :</span><p class="left"><img @click="hudongFlag =Number(!hudongFlag)" :src="require(`../../assets/vip_open${hudongFlag}.png`)" /></p>
				</div> 
			</div>
			<div class="ensure_btn_wrap">
				<button :class="{disabledSubmit:!title }" :disabled="!title" @click="submit">确定提交</button>
			</div>
		</div>
	</div>
</template>

<script>
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'	
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'tsetview',
	data() {
		return {
			isEdit: false,   //判断是否为修改设置页面
			
			title:'',     //特训班标题
			introduce: '', // 特训班介绍
			keywords0: '',  //关键词1
			keywords1: '', //关键词2
			price0:　'',　//2日价格
			price1:　'',　//5日价格
			price2:　'',　//15日价格
			price3:　'',　//30日价格
			value1:'',  //限时折扣的开始时间
			value2:'',  //限时折扣的结束时间
			value3:'',  //消费折扣的开始时间
			value4:'',  //消费折扣的结束时间
			discount1: '',  //限时折扣
			discount2: '',  //消费折扣
			value: '',  //消费折扣的消费类型
			gold: '',  // 消费折扣的消费金额
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
		        }, {
		          value: '10',
		          label: '购买付费观点'
	        }],
	        orderFlag:0,  //是否开启订阅标识
	        hudongFlag:0,  //是否开启互动标识
			promot: null,   /*折扣标识*/
		}
	},
	created(){
		this.api = new Api()
		
		if(this.$route.query.edit) {     //判断是否为修改特训班设置的编辑页面
			this.isEdit = true
		}
		
	},
	methods: {
		submit() {
			let keyword = []    //关键词
			keyword.push(this.keywords0)
			keyword.push(this.keywords1)
			let price = []      //价格数组
			price.push(this.price0 || 0)
			price.push(this.price1 || 0)
			price.push(this.price2 || 0)
			price.push(this.price3 || 0)
			
			let params  = {}
			params.token = this.authToken
			params.title = this.title
			params.introduce = this.introduce
			params.keywords = keyword
			params.prices = price
			
			let promotion = {}   //折扣参数
			promotion.promotion_type = this.promot || undefined
			promotion.start_date = this.value1 || this.value3 || undefined
			promotion.end_date =  this.value2 || this.value4 || undefined
			
			promotion.disscount = this.discount1 || this.discount2 || undefined
			promotion.consume_type = this.value || undefined 
			promotion.gold = this.gold || undefined
			
			params.promotion = promotion
			params.enable_subscribe = this.orderFlag  //是否开启订阅
			params.enable_intact = this.hudongFlag

			
			if(this.isEdit){
				params.id = this.$route.query.edit
				console.log(params)
				this.api.post('/TrainingRoom/Edit', params).then(resp => {
					this.$notify({
	          			title: '成功',
	          			message: '成功修改特训班设置',
	          			type: 'success',
	          			duration:500     //延时关闭时间
	        		});
	        		this.$router.push({name:'vipdetail', params:{id: this.authUser.Id}})
				})
			}else{
				this.api.post('/TrainingRoom/Create', params).then(resp => {
					this.$notify({
	          			title: '成功',
	          			message: '已成功创建特训班',
	          			type: 'success'
	        		});
	        		window.location.reload()   //创建成功刷新页面
				})
			}
			
				
			
		},
		selectPromot(str) {
			this.value1 = ''
			this.value2 = ''
			this.value3 = ''
			this.value4 = ''
			
			this.discount1 = ''
			this.discount2 = ''
			this.value = ''
			this.gold = ''
			
			
			if( str == this.promot ){
				this.promot = null
			}else{
				this.promot = str
			}
			
		}
	},
	computed:{
		...mapGetters(['authUser', 'authToken'])
	}
}
</script>

<style lang="less" scoped>
.content {
	.title_wrap { overflow: hidden;
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p {  font-size: 14px; color: #999999;
			input {width: 300px; height: 40px;  margin-right: 8px;}
		}
	}
	.txb_info { overflow: hidden; padding-top: 10px;
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p {  font-size: 14px; color: #999999; height: 40px; line-height: 40px;}
		.input_wrap { margin-left: 152px;
			textarea { width: 920px; height: 70px; resize: none;}
		}
	}
	.key_wrod { overflow: hidden; padding-top: 12px;
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p { font-size: 14px; color: #999999;
			input { width: 200px; height: 40px; line-height: 40px; margin-right: 10px;}
		}
	}
	.price_set { overflow: hidden; padding-top: 10px;
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p { height: 40px; line-height: 40px; font-size: 14px; color: #999999;}
		.price { margin-left: 152px; font-size: 14px; padding-top: 15px;
			span {font-size: 14px; i { font-size: 14px;} }
			input { width: 145px; height: 40px; margin-left: 9px;}
		}
		.price:nth-of-type(4) {
			input { margin-left: 2px;}
		}
		.price:nth-of-type(5) {
			input { margin-left: 2px;}
		}
	}
	.discount_wrap { overflow: hidden; padding-top: 6px;
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p { height: 40px; line-height: 40px; font-size: 14px; color: #999999;}
		.discount { border: 1px solid #d4d4d4; border-bottom: none; border-right: none; margin-left:152px; margin-top: 0px;
			.title_wrap { overflow: hidden; 
				> div {background: #d9dbda; height: 31px; line-height: 31px; padding-left: 8px; font-size: 14px; font-weight: 600;}
				> div:nth-child(1) { width: 114px; border-right: 1px solid #bfc1c0;}
				> div:nth-child(2) { width: 694px; border-right: 1px solid #bfc1c0;}
				> div:nth-child(3) { width: 114px; border-right: 1px solid #bfc1c0;}
			}	
			.time_wrap { overflow: hidden; height: 40px;
				> div {background: #f5f5f5; height: 40px; border-bottom: 1px solid #bfc1c0; line-height: 31px; padding-left: 8px; font-size: 14px; font-weight: 600;}
				> div:nth-child(1) { width: 114px; border-right: 1px solid #bfc1c0;
					input { vertical-align: middle;}
					i { vertical-align: middle; margin-left: 4px;}
				}
				> div:nth-child(2) { width: 694px; border-right: 1px solid #bfc1c0; padding-top: 5px;
				
				}
				> div:nth-child(3) { width: 114px; border-right: 1px solid #bfc1c0;
					input {  width: 48px; height: 22px; margin-right: 4px;}
					.discount_input:disabled {background: #EEF1F6; border: 1px solid #CCCCCC; }
				}
			}
			.xiaofei_wrap { overflow: hidden; height: 76px;
				> div {background: #f5f5f5; border-bottom: 1px solid #bfc1c0; padding-left: 8px; font-size: 14px; font-weight: 600;}
				> div:nth-child(1) { width: 114px; height:76px; padding-top: 10px; border-right: 1px solid #bfc1c0;
					input { vertical-align: middle;}
					i { vertical-align: middle; margin-left: 4px;}
				}
				> div:nth-child(2) { width: 694px; height: 76px; border-right: 1px solid #bfc1c0; padding-top: 10px;
					.leixing { margin-top: 6px;}
					.pricenum { width: 120px;}
					.discount_input:disabled {background: #EEF1F6; border: 1px solid #CCCCCC; }
					
				}
				> div:nth-child(3) { width: 114px; height: 76px; padding-top: 10px;  border-right: 1px solid #bfc1c0;
					input {  width: 48px; height: 22px; margin-right: 4px;}
					.discount_input:disabled {background: #EEF1F6; border: 1px solid #CCCCCC; }
				}
				
				
			}
		 }
		
	}
	.btn_wrap { overflow:hidden ;
		> div { overflow: hidden;  margin-top: 15px;}
		span { width: 144px; height: 40px; line-height: 40px; font-weight: 600; font-size: 16px; margin-right: 8px; color: #666666; text-align: right; i { color: #fe0000;}}
		p { height: 40px; line-height: 40px; padding-top: 5px; cursor: pointer;}
	}
	.ensure_btn_wrap { text-align: center; margin-top: 32px; padding-bottom: 76px;
		button { width: 300px; height: 50px; font-size: 16px; color: #FFFFFF; background: #db3738; border: none; border-radius: 5px;}
		.disabledSubmit { background: #CCCCCC; }
	}
	
	
	
}

		
</style>