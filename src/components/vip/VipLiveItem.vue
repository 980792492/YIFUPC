<template>
	<div class="vip_live_item" v-if="itemData">
		<div class="auther_wrap">
			<div class="img_wrap left">
				<img :src="itemData.HeadImg" alt="" />
				<span class="sanjiao"></span>
			</div>
			<div class="auther_name_wrap left">
				<p class="name_wrap">
            		<img class="idFlag" :src="require(`../../assets/head_${itemData.Identity}.png`)"/>
            		<span class="name">{{itemData.UserName}}</span>
            		<img v-if="itemData.StockGame" class="gameFlag" src="../../assets/game_icon.jpg">
            		<span class="time">{{itemData.CreateDate}}</span>
          		</p>
			</div>
		</div>
		<!--直接消息体-->
		<div ref="inner" class="text_wrap" v-if="itemData.QuoteId == ''" v-html="switchBody(itemData.Body, '!/fwfh/330x80')">
		</div>
		
		<!--引用的消息-->
		<div ref="inner" class="text_wrap" v-if="itemData.QuoteId != ''">
			<!--消息体-->
			<div class="text_inner">
				<div class="top">
					<div class="auther_name_wrap">
						<p class="name_wrap">
            				<img class="idFlag" :src="require(`../../assets/head_${itemData.QuoteIdentity}.png`)"/>
            				<span class="name">{{itemData.QuoteUserName}}</span>
            				<span class="time right">{{itemData.QuoteCreateDate}}</span>
          				</p>
					</div>
				</div>
				<div class="bottom" v-html="switchBody(itemData.QuoteBody, '!/fwfh/330x80')">
				</div>
			</div>
		  <p class="answer_text" v-html="switchBody(itemData.Body, '!/fwfh/330x80')"></p>	
		</div>
		
		<!-- 图片弹出框 -->
		  <el-dialog title="查看大图" size="large" :visible.sync="dialogVisible">
		    <div class="dialog-img"><img :src="dialogImgSrc" /></div>
		  </el-dialog>
	</div>
</template>

<script>
import { switchBody } from '@/utils/Filters'
	
export default {
	name: 'vipliveitem',
	data() {
		return { 
			dialogVisible: false,
			dialogImgSrc: null,
		}
	},
	mounted(){
		if (this.$refs.inner) {
	      let imgs = this.$refs.inner.querySelectorAll('img')
	      for (let img of imgs) {
	        // 绑定加载完成事件
	        img.onload = () => {
	          this.$emit('imgLoad')
	        }
	        // 绑定图片放大事件
	        img.onclick = () => {
	          let origin = img.getAttribute('origin');
	          if (origin) {
	            this.dialogImgSrc = origin;
	            this.dialogVisible = true;
	          }
	        }
	      }
	   }
	},
	props:{
		itemData: {
			type: Object,
			default() {
				return { }
			}
		}
	},
	methods:{
		switchBody,
		
	}
}
</script>

<style lang="less" scoped>
	.vip_live_item { overflow: hidden; width: 100%;
		.auther_wrap { height: 67px;
			.img_wrap {width: 54px; padding-top: 16px; padding-left: 5px;  height: 67px;
				img { width: 40px; height: 40px; border-radius: 50%;}
				.sanjiao {display: block; width: 0; height: 0; border-left: 6px solid transparent;border-right: 6px solid transparent; border-bottom: 6px solid #f2edf4;
   						  margin-left:15px; margin-top: 3px; }
			
			}
			.auther_name_wrap { padding-top: 26px;
				.name_wrap {
					.idFlag { display: inline-block; vertical-align: middle; width: 13px; height: 13px;}
					.name { display: inline-block; vertical-align: middle; font-size: 16px; margin-left: 4px;}
					.gameFlag { display: inline-block; vertical-align: middle; margin-left: 4px;}
					.time {display: inline-block; vertical-align: middle; font-size: 14px; color: #999999; margin-left: 13px;}
					
				}
				
			}
			
		}
		.text_wrap { background: #f1eef5; padding: 14px 18px; line-height: 24px; font-size: 14px; color: #666666; border-radius: 5px;
			.text_inner { padding: 10px 15px; background: #ffffff;
				.top {
					.auther_name_wrap { 
						.name_wrap {
							.idFlag { display: inline-block; vertical-align: middle; width: 13px; height: 13px;}
							.name { display: inline-block; vertical-align: middle; font-size: 16px; margin-left: 4px;}
							.gameFlag { display: inline-block; vertical-align: middle; margin-left: 4px;}
							.time {display: inline-block; vertical-align: middle; font-size: 12px; color: #999999; margin-left: 13px;}
						}
					 }
				}
				.bottom { line-height: 20px; font-size: 14px; word-break: break-all;}
			}
			.answer_text { line-height: 20px; font-size: 14px; margin-top: 4px; word-break: break-all;}
		
		
		
		}
		
	/*// 图片放大*/
   	 .dialog-img { text-align: center; }
		
		
	}
	
	
</style>