<template>
  <el-dialog
  	class="login_open_wrap"
    :visible.sync="dialogVisible"
    >
    <div class="action_wrap">
    	<p class="login_logo">
    		<span>登录</span><img src="../assets/vipindex1_logo.jpg"/>
    	</p>
    </div>
    <el-form class="login_body" :model="form">
    	<p class="name_wrap">
    		<span>用户名</span>
    		<input type="text" ref="myinput"  v-model="form.username" name="" id="" value="" placeholder="请输入手机号/邮箱/昵称" />
    	</p>
    	<p class="mima_wrap">
    		<span>密&nbsp;&nbsp;&nbsp;码</span>
    		<input type="password" v-model="form.password" placeholder="请输入密码" />
    	</p>
    	<p class="zidong_wrap">
    		<label for="checkzidong">
    			<input type="checkbox" name="checkzidong" id="checkzidong" v-model="form.remember" />自动登录
    		</label>
    		<a target="_blank" href="http://www.yifucj.com/user/validateuserMobile/" class="right">忘记密码</a>
    	</p>
    </el-form>
    <div class="open_footer">
    	<p>
    		<a target="_blank" href="http://www.yifucj.com/user/UserRegMobile">没有账号？立即注册</a>
    		<input type="button" name="" @click="handleSubmit" id="login_btn" value="登录" />
    	</p>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/utils/Auth'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        username: null,
        password: null,
        remember: false,
      },
      formLabelWidth: '70px'
    }
  },
  methods: {
    handleSubmit () {
      // console.log(this.form)
      // 表单验证
      // 登陆
      this.login({
        username: this.form.username,
        password: this.form.password,
        type: 0,
        remember: this.form.remember
      }).then(token => {
        this.initUserData(token)
        Auth.closeLoginDialog()
      })
    },
    ...mapActions(['login', 'initUserData'])
  },
  created(){
  	// console.log(this.showLoginDialog)
  },
//directives: {
//  focus: {
//      inserted: function (el, {value}) {
//      		console.log(value)
//          if (value) {
//              el.focus();
//          }
//      }
//  }
//	},
	mounted(){
		this.$nextTick(function(){	
		});
	},
  watch: {
    showLoginDialog (flag, flag2) {
    	// console.log(flag+'--'+flag2)
      this.dialogVisible = flag
    },
    dialogVisible (flag) {
      flag ? Auth.openLoginDialog() : Auth.closeLoginDialog()
    }
  },
  computed: {
    ...mapGetters(['showLoginDialog'])
  }
}
</script>

<style lang="less" scoped>

	.action_wrap {
		.login_logo { padding-left: 45px;
			span { font-size: 31px; display: inline-block; height: 30px; line-height: 30px; color: #9a9a9a; vertical-align: middle;}
			img { height: 30px; vertical-align: middle;}
		}

	}
  .login_logo { margin-bottom: 38px;}
  .login_body {
  	.name_wrap { height: 41px;  line-height: 41px; margin-bottom: 21px;
  			span { font-size: 16px; margin-right: 19px; display: inline-block; width: 48px;}
  			input { height: 41px; width: 448px;  font-size: 14px; padding-left: 10px; border: 1px solid #888;}

  	}

  	.mima_wrap { height: 41px;  line-height: 41px; margin-bottom: 36px;
  			span { font-size: 16px; margin-right: 19px; display: inline-block; width: 48px;}
  			input { height: 41px; width: 448px;font-size: 14px; padding-left: 10px; border: 1px solid #888;}

  	}
  	.zidong_wrap {  color: #5097ed; margin-bottom: 14px;
  		label {
  			input { vertical-align: middle; margin-right: 8px;}
  		}
  		a { color: #5097ed;}
  	 }
  }
  .open_footer { padding-top: 30px;
  	p { padding-left: 45px; margin-top: 5px;
  		a { display: inline-block; vertical-align: middle; width: 250px; height: 50px; border: 1px solid #9a9a9a; line-height: 50px; text-align: center; font-size: 16px; color: #666666;}
  		input { width: 250px; height: 50px; margin-left: 10px; vertical-align: middle; background: #db3638; border: none; font-size: 16px; color: #FFFFFF;}
  	}


  }



</style>
