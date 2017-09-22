<template>
	<div class="article_content_wrap">
		<div class="clearn"></div>
		<!--老师的我的文章-->
		<div v-if="isTeacher == 2 && mytype == 1 " class="isTeacher">
			<div class="teacher_my_thead">
				<div class="time left">创建时间</div>
				<div class="title left">标题</div>
				<div class="type left">
					<el-select class="select_wrap"  @change="dochange" v-model="value" >
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="number left">阅读量</div>
				<div class="status left">状态</div>
				<div class="action left">操作</div>
			</div>
			<div class="teacher_my_tbody">
				<div class="tbody_item" v-for="(item, index) in status">
					<div class="time left">{{item.CreateDate}}</div>
					<div class="title left"><router-link target="_blank" :to="{name:'detail', params:{id:item.Id}}">{{item.Title}} </router-link></div>
					<div class="type left">{{ item | toType}}</div>
					<div class="number left">{{item.ReadCount}}</div>
					<div v-if="item.Type == 1" class="status left" :class="'item_status'+item.Status">{{item.Status == 1 ? '可订阅' : item.Status == 2 ? '服务中': item.Status == 3 ? '已结束' :'' }}</div>
					<div v-if="item.Type == 2" class="status left" :class="'item_status'+item.Status">{{item.Status == 1 ? '可订阅' : item.Status == 2 ? '已下架': item.Status == 3 ? '已结束' :'' }}</div>
					<div v-if="item.Type == 3" class="status left"></div>
					<div v-else class="action left"><button  @click="toTop(0, item.Id), toup(index)" :class="{toped:item.Top == 1 }" v-if="item.Top == 1">已置顶</button><button @click="toTop(1, item.Id), toup(index)" v-else>置顶</button></div>
					<div v-if="item.Type == 3" class="action left"></div>
				</div>
			</div>
		</div>

		<!--老师,用户的我的关注-->
		<div v-else class="item" v-for="(item, index) in status">
			<div class="img_wrap left">
				<router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}" ><img :src="item.HeadImg" alt="" /></router-link>
			</div>
			<div class="text_wrap right">
				<p class="name"><router-link target="_blank" :to="{name:'cjg', params:{id:item.RoomId}}">{{item.TeacherName}}</router-link></p>
				<p class="title"><router-link target="_blank" :to="{name:'detail', params:{id:item.Id}}"><span class="cjgflag" v-if="item.Type == 1">CJG</span>{{item.Title}}</router-link><span class="jingbi"><i v-if="item.Price > 0" class="icon iconfont icon-xianxing1"></i></span>
					<img v-if="item.Price > 0 && item.Status == 1 && mytype != 1" src="../../assets/list-5.png"></img>
					<img v-if="item.Price > 0 && item.Status == 2  && mytype != 1" src="../../assets/list-6.png"></img>
					<span class="order" v-if="item.Price > 0 && item.Status == 3">服务已结束 <i class="right"></i></span>
				</p>
				<p class="text">
					<router-link target="_blank" :to="{name:'detail', params:{id:item.Id}}">{{item.Info}}</router-link>
					</p>
				<p class="timer">
					<span class="left">发表时间：{{item.CreateDate}}</span><span class="right">{{item.ReadCount}}人阅读</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { toType } from '@/utils/Filters'
import Auth from '@/utils/Auth'
import Api from '@/utils/Api'

export default {
	name:'articleitem',
	data(){
		return {
			 options: [{
		          value: '0',
		          label: '全部文章'
		        }, {
		          value: '1',
		          label: '藏金阁'
		        }, {
		          value: '2',
		          label: '付费文章'
		        }, {
		          value: '3',
		          label: '免费文章'
		        }],
				value: '0'
		}
	},
	props:{
		mytype:Number,
		isTeacher:{
			type:String,
			default:''
		},
		status:{
			type:Array,
			default(){
				return {}
			}
		}
	},
	created(){
		this.api = new Api()
//		console.log(this.mytype+'1122')
//		console.log(this.status)
//		console.log(this.isTeacher)
	},
	methods:{
		dochange(){
			this.$emit('child',this.value)
		},
		toup(index){
			console.log(index)
			this.$emit('fromchild',index)
		},
		toTop(str, id){
			let params = {}
			params.token = this.authToken
			params.top = str
			params.id = id
			this.api.post('/Article/UpToTop',params).then(resp => {
				if(str == 1){
					 this.$notify({
			          title: '成功',
			          message: '置顶成功',
			          type: 'success'
			        });
				}else if( str == 0){
					this.$notify({
			          title: '成功',
			          message: '成功取消置顶',
			          type: 'success'
			        });
				}
			})
		}
	},
	filters:{
		toType
	},
	computed:{
		...mapGetters(['authToken'])
	}
}
</script>

<style scoped lang="less">
	.article_content_wrap {
		> .isTeacher {  margin-top: 14px;border-top: 1px solid #e3e3e3;  border-left: 1px solid #e3e3e3;
			.teacher_my_thead { height:39px;
				> div { height: 39px; background: #f2f0f1; text-align: center; line-height: 38px; font-size: 14px; color: #656565; font-weight: 600; border-right: 1px solid #e3e3e3; border-bottom: 1px solid #e3e3e3; }
				.time { width: 137px;}
				.title { width: 212px;}
				.type { width: 120px;
					.select_wrap { width: 100px;
						.el-input__inner { height: 26px!important; border-radius: 0;}
					}
				}
				.number { width: 73px;}
				.status { width: 67px;}
				.action { width: 120px;}
			}
			.teacher_my_tbody {
				.tbody_item { height: 49px;
					> div { height: 49px; text-align: center; line-height: 48px; color: #666666; border-right: 1px solid #e3e3e3; border-bottom: 1px solid #e3e3e3; }
					.time { width: 137px;}
					.title { width: 212px; height: 49px; text-align: left; padding-left:10px; padding-right: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
						a { color: #666666;
							&:hover { color: #e73741;}
						}
					}
					.type { width: 120px; text-align: left; padding-left:10px; }
					.number { width: 73px; text-align: left; padding-left:10px;}
					.status { width: 67px; overflow: hidden;}
					.item_status1{ color: #e73741;}
					.item_status2{ color: #2285ea ;}
					.item_status10{color: #676767; }

					.ordering { color: #e43c3c;}
					.fuwuing { color: #1c87e9;}
					.ending { }
					.action { width: 120px;
						> button { width: 60px; height: 25px; line-height: 25px; background: #f1f1f1; border: 1px solid #cccccc; cursor: pointer; outline: none;}
						.actived { color: #1e85ec;}
						.toped { color: #2285ea;}
					}
				}
			}
		}
		> .item {  border-bottom: 1px solid #eeeeee; padding-top: 20px; padding-bottom: 20px; overflow: hidden;
			.img_wrap {width: 85px;
				 img { width: 70px; height: 70px; border-radius: 50%;}
			}
			.text_wrap { width: 635px;
				.name { height: 23px;
					> a {font-size: 15px; color: #666;
						&:hover { color: #e04241;}
					}
				}
				.title {  line-height: 36px; font-size: 19px; color: #444;
					a {font-size: 19px; color: #444;
						&:hover {color: #e04241;}
					}
					.cjgflag { display: inline-block; height: 20px; line-height: 20px; vertical-align:middle; margin-right: 10px; padding:0 10px ; background: #F79900; border-radius: 15px; color: #FFFFFF; }
					.jingbi { display: inline-block; vertical-align: middle;
						i {font-size:20px; color: #fb9735; margin-left: 2px;}
					}
					.order { margin-left: 2px; display: inline-block; vertical-align: middle; width: 80px; height: 20px; line-height: 20px; color: #fffffd; padding-left: 8px;  background: #CCCCCC;
						i { display: in; width: 0; height: 0; border-top: 10px solid transparent; border-right: 10px solid #ffffff; border-bottom: 10px solid transparent; }
					}
					img { vertical-align: middle;}
				}
				.text { line-height: 20px; width: 634px; overflow: hidden; padding-top: 4px; font-size: 14px; color: #666; max-height: 42px;
					> a { font-size: 14px; color: #666;
						&:hover { color: #e04241;}
					}
				 }
				.timer { margin-top: 15px; color: #aaa; vertical-align: middle;}
			}
		}
	}

</style>
