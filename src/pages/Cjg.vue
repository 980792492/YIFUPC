<template>
  <div class="content_detail">
    <!--room下的藏金阁和文章的列表修改-->
    <div class="cjg_item_wrap">
    	<div class="user_change">
        <span  @click="check(1)"  :class="{checkborder:staticCheck == 1 }">全部</span><span v-if="isTeacher" @click="check(2)"  :class="{checkborder:staticCheck == 2 }" >服务中的</span><span v-if="!isTeacher" @click="check(2)"  :class="{checkborder:staticCheck == 2 }" >可订阅的</span><span v-if="!isTeacher" @click="check(3)"  :class="{checkborder:staticCheck == 3 }">已订阅的</span>
      </div>
    	<div class="item_wrap">
    			  <div class="item" v-for="item in items" >
    			  	<div class="item_left left">
    			  		<img :src="item.HeadImg"/>
    			  	</div>
    			  	<div class="item_right left">

    			  		<p class="title_wrap">
    			  			<router-link target="_blank" :to="{name:'detail', params:{id:item.Id}}" >
    			  				<span class="cjgflag" v-if="item.Type == 1">CJG</span>{{item.TeacherName}} -{{item.Title}}
    			  			  <span v-if="item.Price > 0" class="jingbi"><i  class="icon iconfont icon-xianxing1"></i></span>
    			  			  <img v-if="item.Price > 0 && item.Status == 1 && staticCheck != 3" src="../assets/list-5.png"></img>
					          <img v-if="item.Price > 0 && item.Status == 2 && staticCheck != 3" src="../assets/list-6.png"></img>
					          <span class="order" v-if="item.Price > 0 && item.Status == 3">服务已结束 <i class="right"></i></span>
					          <img v-if="item.Price > 0 && item.Status == 4" src="../assets/list-7.jpg"></img>
    			  		  </router-link>
    			  		</p>
    			  		<!--<p class="title_wrap"><a target="_blank" :href="`//room.yifucj.com/Golden/Detail/${item.Id}`" >{{item.Title}}<span v-if="item.Price > 0" class="jingbi"><i  class="icon iconfont icon-xianxing1"></i></span><img class="order" :src="require(`../assets/list-${item.Status == 1 ? 5 : 6}.png`)"/><span class="userorder userorder3">订阅中 <i class="right"></i></span></a></p>-->
    			  		<p class="info_wrap">{{item.Info}}</p>
    			  		<p class="time_wrap_cjg" v-if="item.Type == 1">
    			  			<span class="order_time">订阅时间：{{item.CreateDate}}至{{item.EndDate}}</span>
    			  			<span class="fuwu_time">服务时间：{{item.CreateDate}}至{{item.StopDate}}</span>
    			  		</p>
    			  		<p class="time_wrap_wenzhang">
    			  			<span>{{item.CreateDate}}</span>
    			  			<span class="right">{{item.ReadCount}}人阅读</span>
    			  		</p>
    			  	</div>
    			  	<div class="clearn"></div>
    			  </div>
    	</div>
    	<div class="pager">
					<div class="block">
				    <el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="currentPage"
				      :page-sizes="[10,15, 20, 40]"
				      :page-size="num"
				      layout="sizes, prev, pager, next, jumper"
				      :total="allCount">
				    </el-pagination>
				  </div>
      </div>
    </div>
    
  </div>  
            
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'


export default {
  data(){
    return {
    	currentPage: 1,
      items:[],
      allCount:null,
      page: 1,
      num: 20,
      staticCheck:1    // 设置默认展示全部列表
    }
  },
  created () {
    this.api = new Api()
//	判断是否登陆
//	if(!this.authUser) {
//		alert(1)
//			Auth.openLoginDialog()
//			return false
//		}
//		Auth.isLogin().then(() => {}).catch(()=> {
//      Auth.openLoginDialog()
//		})
//	
  	
  	
  	
    this.loadData(this.teacherId)
  },
  methods: {
		handleSizeChange(val) {
	    this.num = val
    	this.loadData(this.teacherId)
	  },
	  handleCurrentChange(val) {
	    this.page = val
    	this.loadData(this.teacherId)
	  },
    loadData (id) {
      if (id > 0 ) {
        let params = {
          page: this.page,
          num: this.num,
          teacher_id: id,
          token: this.authToken,
          type:this.staticCheck - 1,
        }
        if(this.isTeacher){
        	this.api.get('/Article/TList', params).then(resp => {
        		this.items = resp.List
	          this.allCount = resp.TotalCount
        	})
        }else{
        	this.api.get('/Article/TUList', params).then(resp => {
	          this.items = resp.List
	          this.allCount = resp.TotalCount
	        })
        }
      }
    },

    check(str){
    	if (str == 3){
//	判断是否登陆
      	if(!this.authUser) {
			 		Auth.openLoginDialog()
			    return false
		   	}
    	}
    	this.staticCheck = str
    	this.loadData(this.teacherId)
    }
  },
  watch: {
    teacherId (id) {
      if (id > 0) {
        this.loadData(id, 1)
      }
    }
  },
  computed:{
    ...mapGetters(['teacherId','isTeacher','authUser', 'authToken'])
  }
} 
</script>

<style lang="less" scoped>
/*设计图修改调整样式*/
			.content_detail { width: 1175px; margin: 0 auto; overflow: hidden;
					.cjg_item_wrap { background: #FFFFFF; padding: 28px 40px; padding-right: 45px;
							.user_change {
            			span { display: inline-block; cursor: pointer; width: 120px; height: 30px; text-align: center; line-height: 30px; border: 1px solid #CCCCCC;}
            			.checkborder { border-color: #ee8687; color: #ee8687;}
            	}
            	.item_wrap { margin-top: 8px;
            			.item { border-bottom: 1px solid #EEEEEE; padding-top: 30px;
            				.item_left { width: 109px;  padding-left: 4px;
            					img { width: 80px; height: 80px; border-radius: 50%;}
            				}
            				.item_right { width: 981px;
            						.title_wrap { height: 38px; line-height: 38px; font-size: 19px; color: #666666;
            							> a { font-size: 19px; color: #666666; height: 25px; line-height: 25px;
            							 	> img { vertical-align: middle;}
            									&:hover { color: #e04241;}
															.cjgflag { display: inline-block; height: 20px; vertical-align: middle; line-height: 20px; margin-right: 10px; padding:0 10px ; font-size: 16px; background: #F79900; border-radius: 15px; color: #FFFFFF; }
            							}
													.jingbi { display: inline-block; vertical-align: middle; padding-top: 2px;
														i {font-size:20px; color: #fb9735; margin-left: 2px;}
													}
													.order { vertical-align: middle; margin-left: 6px; background:#cccccc; padding: 4px 5px}
													
													.userorder { margin-left: 6px; display: inline-block; width: 60px; height: 20px; line-height: 20px; color: #fffffd; padding-left: 8px;  background: #df4142;
														i { display: in; width: 0; height: 0; border-top: 10px solid transparent; border-right: 10px solid #ffffff; border-bottom: 10px solid transparent; }
													}
													
													/*用户可订阅（即订阅中）*/
													.userorder1 { }
													/*用户已经下架*/
													.userorder2 {  }
													/*用户已结束*/
													.userorder3 {  background: #FFFFFF;  color: #666666; border: 1px solid #a3a3a3; }
													/*用户已订阅*/
													.userorder4 {  }
													
													
												}
												.info_wrap { line-height: 20px; font-size: 14px; color: #666666; word-break: break-all;}
												
												.time_wrap_cjg { margin-top: 16px; color: #666666; margin-bottom: 25px;
													.order_time{ margin-right: 38px;}
												}
												.time_wrap_wenzhang { margin-top: 16px; color: #BBBBBB; margin-bottom: 25px; 	 }
												
            				 }
            			}
            	}
					  .pager { text-align: center; margin-top: 10px;}
					
					
					}
			 }

</style>