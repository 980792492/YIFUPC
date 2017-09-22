<template>
	<div>
		<div class="content_detail">
			<div class="resume">
				<p class="resume_title">【个人简介】</p>
				<div class="resume_detail" v-html="introduce"></div>
			</div>
			<div class="honors">
				<p class="honors_title">【荣誉记录】</p>
				<div class="honors_detail" v-html="honorRecord"></div>
			</div>
			<div class="idea">
				<p class="idea_title">【操盘理念】</p>
				<div class="idea_detail" v-html="operationIdea"></div>
			</div>
			<div class="explain">
				<p class="explain_title">【服务说明】</p>
				<div class="explain_detail" v-html="services"></div>
			</div>
		</div>
		<EliteIntroduce></EliteIntroduce>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import EliteIntroduce from '@/components/room/EliteIntroduce'
import Api from '@/utils/Api'

export default {
	name:'room-intro',
	data(){
		return {
			introduce: null,
			honorRecord: null,
			operationIdea: null,
			services: null,
		}
	},
	created () {
		this.loadData()
	},
	methods:{
		loadData () {
			if (this.teacherId > 0) {
				const api = new Api()
				api.get('Teacher/Introduce', { teacher_id:  this.teacherId }).then(resp => {
					this.introduce = resp.Introduce
					this.honorRecord = resp.HonorRecord
					this.operationIdea = resp.OperationIdea
					this.services = resp.Services
				}).catch(error => console.log(error))
			}
		}
	},
	computed:{
		...mapGetters(['teacherId'])
	},
	components:{
		EliteIntroduce
	}
}
</script>
<style scoped lang="less">
/*详细介绍模块*/
    .content_detail { width: 1175px;background: #FFFFFF; padding: 43px 40px; margin: 0 auto;
        .resume {
            .resume_title { height: 40px; background: #EEEEEE; line-height: 40px; color: #333333; font-weight: 700; padding-left: 10px;}
            .resume_detail { color: #6c6c6c;
                .resume_detail_title { line-height: 40px; margin-bottom: 12px;}
                .resume_detail_text { line-height: 25px;}
            }
        }
        .honors {
            .honors_title {  height: 40px; background: #EEEEEE; line-height: 40px; color: #333333; font-weight: 700; padding-left: 10px; }
            .honors_detail {  padding-top: 20px;
                p { line-height: 45px;font-size: 13px; color: #343434;
                    span { padding: 8px 20px ; background: #e43a3d; color: #FFFFFF; border-radius: 18px;  font-size: 13px; margin-right: 16px;}
                }
            }
        }
        .idea {
            .idea_title {  height: 40px; background: #EEEEEE; line-height: 40px; color: #333333; font-weight: 700; padding-left: 10px; }
            .idea_detail { padding-top: 12px; padding-bottom: 18px;
                p { line-break: 24px; color: #676767;}
            }
        }
        .explain {
            .explain_title {  height: 40px; background: #EEEEEE; line-height: 40px; color: #333333; font-weight: 700; padding-left: 10px; }
            .explain_detail { padding-top: 12px; padding-bottom: 18px;
                .detail-item {
                    .item-title { line-height: 24px; color: #5c5c5c; font-weight: 700;}
                    .item-text-wrap {
                        > p {  line-height: 26px;}
                    }
                }

            }
        }
    }
</style>
