<template>
<div class="bottom_wrap">
	<div class="bottom_left left">
		<ul>
		  	 <li v-for="item in items">
		  	 	<a :href="link(item)" target="_blank">{{ title(item.Title, item.UserName) }}</a>
		  	 </li>
		</ul>
	</div>
	<div class="bottom_right left">
	 	 <a :href="roomAds2.LinkUrl" target="_blank">
		   <img class="pic" :src="roomAds2.ImageUrl" alt="" />
		 </a>
	</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/utils/Api'

export default {
	name:'EliteIntroduce',
	data (){
    	return {
    		items: []
    	}
    },
    created (){
		const api = new Api()
		api.get('RoomIndex/Recommend').then(resp => {
			this.items = resp
		})

    },
    methods:{
    	title (title, userName) {
    		return (userName ? userName + ': ' : '') + title
    	},
    	link (item) {
    		switch (item.Type) {
    			case 1:
    				return 'http://pc.yifucj.com/article/detail/' + item.Id
    			case 3:
    				return 'http://room.yifucj.com/Video/Detail?liveId=' + item.Id
    			case 4:
    				return item.IsHistory == 0 ? `http://pc.yifucj.com/room/${item.RoomId}/live` : `http://pc.yifucj.com/history/${item.RoomId}_${item.Id}/live`
    			case 5:
    				return 'http://q.yifucj.com/lswz/' + item.Id
    			case 6:
    				return 'http://www.yifucj.com/Book/Detail/' + item.Id
    			default:
    				console.log('unknow type')
    				return ''
    		}

    	}
    },
    computed:{
  		...mapGetters(['roomAds2'])
    }
}



</script>

<style lang="less" scoped>
	 .bottom_wrap { width: 1175px; height: 160px; margin: 0 auto; margin-top: 15px; background: #FFFFFF; clear: both;
            .bottom_left { width: 760px; height: 160px; padding:19px 33px 16px 21px ;
                ul { width: 700px; height: 100%;
                    li { height: 25px; line-height: 25px;
                        a { display: inline-block; color: #6b6b6b; font-size: 14px; width: 340px; white-space:nowrap; overflow: hidden; text-overflow:ellipsis;
                            &:hover { color: #e7735a;}
                        }
                    }
                    li:nth-child(odd) {float: left; }
                    li:nth-child(even) { float: right;}


                }
            }
            .bottom_right { width: 415px; height: 160px;
                > a { display: block; width: 100%; height: 100%;
                	> img  { width: 100%; height: 100%;}
                }
            }
        }

</style>
