<template>
  <div id="app">
  	<y-top></y-top>
    <div class="content_wrap">
      <router-view></router-view>
    </div>
    <y-foot></y-foot>
    <!-- 全局登陆弹出框 -->
    <y-login-dialog></y-login-dialog>
  </div>
</template>

<script>
import YLoginDialog from '@/components/LoginDialog'
import YTop from '@/components/Top'
import YFoot from '@/components/Foot'

export default {
  name: 'app',
  watch: {
    // 全局加载遮罩策略
    // api 请求超过1s之后，会出现加载遮罩，提高用户体验
    '$store.getters.isLoading' (isLoading) {
      if (!this.loading && isLoading) {
        this.loadingTimer = setTimeout(() => {
          this.loading = this.$loading({
            fullscreen: true,
            lock: true,
            text: '拼命加载数据中...'
          })
        }, 1000)
      } else if (!isLoading) {
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer)
          this.loadingTimer = null
        }
        if (this.loading) {
          this.loading.close()
        }
      }
    }
  },
  components: {
    YLoginDialog,
    YTop,
    YFoot
  }
}
</script>

<style src="../static/css/iconfont.css"></style>
<style lang="less" src="./styles/reset.less"></style>
<style lang="less" src="./styles/app.less"></style>

<style lang="less">
	
	.footer { height: 100px; text-align: center; background: bisque;}

	/*定时未登录弹窗样式*/
	.open_popup {
		a { position: relative; display: block; width: 470px; height: 470px; margin: 0 auto;
			span { position: absolute; z-index: 10; background:rgba(0,0,0,0); border: 1px solid #FFFFFA; width: 47px; height: 47px; right: 28px; top: 4px; border-radius: 50%; cursor: pointer; }
		}
		.el-dialog { background: none; box-shadow: none;}
	}

	/*用户界面礼物轮播模块样式*/
	.bottomnume_right {
		.el-carousel__arrow {
			width: 14px;
			height: 36px;
			border-radius: 0;
		}


		.el-carousel__arrow--left { left: 8px !important;}
		.el-carousel__arrow--right { right: 8px !important;}

	}

	/*用户可订阅产品轮播*/
	.change{
		> .block {
			> .el-carousel {
				> .el-carousel__container {
				 	> .el-carousel__arrow--left { left: 12px !important;}
				 	> .el-carousel__arrow--right { right: 12px !important;}
				}
			}
		}
	}
/*可订阅产品的ele组件原有样式修改*/
.goods_menu {
	.el-carousel__arrow { width: 14px !important; height: 36px !important; border-radius: 0 !important;}
}

/*文章模块的老师的我的文章的select的框的样式*/
.select_wrap { width: 100px;
					.el-input { height: 31px;
						i { width: 27px; height: 26px; top: 19px!important; border-right: 1px solid #bfcbd9!important;}
						input { padding-right: 26px;}
					}
						.el-input__inner { height: 26px!important; border-radius: 0;}
					}




/*订阅cjg和文章模块的使用优惠券弹窗*/
.pay_article_wrap{
	.btn_wrap {
		.open_wrap {
			.el-dialog { width: 650px; height: 440px;
				.el-dialog__header { text-align: center !important;}
				.el-dialog__body { }
				.el-dialog__footer { }
			}
		}
	}
}


/*登录弹窗样式*/
.login_open_wrap {
			.el-dialog { width: 650px; height: 450px;}
			.el-dialog__header { padding:15px 20px;}
  		.el-dialog__title { color: #666666; }
  		.el-form { padding:0  40px; padding-right: 50px;
  		}
  }


/*分享按钮的微信弹出框*/

#bsWXBox { width: 232px !important; height: 256px !important;}
#bsBox { width: 560px; height: 419px;
	.bFind-wrapper-top { height: 25px;}
}



/*问答模块 */
/*全部老师,选择老师*/
.question_open_wrap {font-size: 18px;
		.el-dialog { width: 650px !important; height: 445px;}
}
/*main页面选择老师*/
.dialog_open {
	.el-dialog { width: 650px; height: 500px;}
			.el-dialog__body { padding-top: 20px !important;}
}

/*article模块文章订阅页弹窗*/
.payarticle_open_wrap{
	.el-dialog { padding:0 10px}
}




/*问答模块,右侧的推荐的立即提问弹窗*/
.recommend_question_open_wrap {
		.el-dialog { width: 650px; height: 450px;}
}


/*问答模块,我的问答,老师修改价格弹窗*/
.open_change_price {
		.el-dialog { width: 650px; height: 250px;}
	}

/*问答模块的,全部问答,别人提问自己付费查看弹窗*/
.open_question_all_show {
		.el-dialog { width: 650px; height: 350px;}


}

/*全部老师弹窗*/
.question_open_wrap {
		.el-dialog { width: 650px; height: 500px;}

}
	
	
/*vip模块的老师创建我的特训班*/
.vip_create_time { width: 186px !important;
	.el-input__inner { height: 26px !important;}
}
.vip_create_select {width: 122px; margin-right: 20px;
	.el-input__inner { height: 26px !important;}
}

	
	
/*特训班详情,,无特训班弹窗*/	
.vip_open_detail {
			.el-dialog { width: 650px; height: 450px;}
}
	
	
	
</style>
