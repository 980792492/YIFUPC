<template>
	<div class="footer_wrap">
		<div class="clearn"></div>
		<div class="foot">
			<div class="detail">
				<div class="text">
					<p class="title">关于我们</p>
					<p class="text_link">
						<a href="//www.yifucj.com/help/about" target="_blank">公司介绍</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/contactus" target="_blank">商务合作</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/recruitment" target="_blank">诚聘英才</a>
					</p>
				</div>
				<div class="text">
					<p class="title">使用指南</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help1" target="_blank">帮助中心</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/UserAgreement" target="_blank">用户协议</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/Feedback" target="_blank">意见反馈</a>
					</p>
				</div>
				<div class="text">
					<p class="title">
						安全保障
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/risktip" target="_blank">风险提示</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/lawnotice" target="_blank">法律声明</a>
					</p>
					<p class="text_link">
						<a href="//www.yifucj.com/Help/disclaimer" target="_blank">免责声明</a>
					</p>
				</div>
				<div class="lianxi">
					<p class="title">联系客服</p>
					<div class="QQ">客服QQ群:<span>600300</span></div>
					<div class="dianhua">客服电话:<span>0571-87119797</span><span>17826802022</span></div>
					<div class="time">工作日 8:30-11:30，13:00-17:00</div>
				</div>
				<div class="text">
					<img src="http://static.yifucj.com/images/zbindex1_07.jpg" alt="" />
				</div>
			</div>
			<p class="statement">
				一富财经所载文章、数据仅供参考，使用前务请仔细阅读法律声明，风险自负。Copyright © 2011 www.yifucj.com 浙ICP证20110376号 备案号：浙B2-20110376-2号  地址：杭州市艮山西路102号 
			</p>
			<div class="beian">
				<a href="http://122.224.75.236/wzba/login.do?method=hdurl&doamin=http://www.yifucj.com&id=330108000063530&SHID=1223.0AFF_NAME=com.rouger.%20gs.main.UserInfoAff&AFF_ACTION=qyhzdetail&PAGE_URL=ShowDetail" target="_blank">
					<img src="http://static.yifucj.com/images/icp.jpg" alt="" />
				</a>
				<a href="http://www.315online.com.cn/member/315110096.html" target="_blank">
					<img src="http://static.yifucj.com/images/315online.jpg" alt="" />	
				</a>
			</div>
			<p class="beianhao">
				<img src="http://static.yifucj.com/images/beian.png" alt="" />浙公网安备 33010402000642号
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name:'roomfoot'
}
</script>

<style lang="less" scoped>
	.footer_wrap {background: #e8e8e8; height: 339px;
		.foot { width: 1175px; margin: 0 auto; padding-top: 22px;
			.detail { overflow: hidden;
				> div { height: 130px;}
				.text { width: 165px; border-right: 1px solid #f6f6f6; text-align: center; float: left;
					> img { width: 110px; height: 130px;}
					.title { font-size: 16px; font-weight: 600; color: #615c62; line-height: 26px;}
					.text_link { line-height: 30px; 
						> a { color: #818892;}
					}
				}
				.text:nth-last-child(1) {border-left: 1px solid #f6f6f6; border-right: none;}
				.lianxi { width: 510px; padding-left: 25px; color: #666465; margin-bottom: 27px; float: left;
					.title {font-size: 16px; font-weight: 600; color: #615c62; line-height: 26px; }
					.QQ { height: 26px; line-height: 26px; font-size: 16px; color: #333333; 
						> span { color: #e23c3e; font-size: 20px; font-weight: 600; margin-left: 8px;}
					}
					.dianhua { color: #333333; height: 38px;  line-height: 38px; font-size: 16px;
						> span {	font-size: 18px; font-weight: 600; color: #e6393d; }
						>span:nth-child(1) { margin-left: 20px; margin-right: 16px;}
					}
					.time { color: #333333; padding-top: 4px;}
				}
			}
			.statement {color: #727a7d; text-align: center; margin-bottom: 25px;}
			.beian { text-align: center; margin-bottom: 15px;
				> a { margin-right:20px ;
					> img { width: 108px; height: 40px; };
				}
			}
			.beianhao { width: 300px; height: 45px; margin: 0 auto; text-align: center; color: #727a7d;
				> img { width: 20px; height: 20px; vertical-align: middle;  margin-right: 6px;}
			}
			
		}
	}
</style>