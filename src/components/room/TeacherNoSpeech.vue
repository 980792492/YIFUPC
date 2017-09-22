<template>
	<div class="no_speech_wrap">
		  <el-checkbox-group class="my_group" v-model="checkedCities" @change="handleCheckedCitiesChange">
		    <el-checkbox v-for="(item, index) in cities" :label="item" :key="index">{{item.UserName}}</el-checkbox>
		  </el-checkbox-group>
		<p class="all_wrap">
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		</p>
		<p class="btn_wrap">
			<button @click="untie">解禁</button>
		</p>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '@/utils/Api'
import Auth from '@/utils/Auth'

export default{
	name:'no-speech-set',
	data(){
		return {
			checkAll: true,
	        checkedCities: [],
//	        设置存放禁言用户
	        cities: [],
	        isIndeterminate: true
		}
	},
	created(){
//		组件 初始化时获取被禁言用户列表
		this.api = new Api()
		this.getnospeechlist(this.roomId)
	},
	methods:{
		handleCheckAllChange(event) {
	      this.checkedCities = event.target.checked ? this.cities : [];
	      this.isIndeterminate = false;
	    },
	    handleCheckedCitiesChange(value) {
	      let checkedCount = value.length;
	      this.checkAll = checkedCount === this.cities.length;
	      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
		  	this.checkedCities = value
	    },
//	    对选中的禁言用户解禁
	    untie(){
	    	// console.log(this.checkedCities)
	    	var user_ids = ''
	    	this.checkedCities.forEach(function(v){
	    		user_ids = user_ids + v.Id +','
	    	})
	    	user_ids = user_ids.substring(0,user_ids.length-1)
	    	let params = {}
	    	params.token = this.authToken
	    	params.user_ids = user_ids
	    	// console.log(params)
	    	this.api.post('/Teacher/RemoveForbidUser', params).then(resp => {
	    		//todo
	    		this.$notify({
		          title: '成功',
		          message: '成功取消禁言',
		          type: 'success'
		        });
	    		this.checkedCities = []
	    		this.getnospeechlist(this.roomId)
	    	})
	    },
		...mapActions(['getnospeechlist'])
	},
	watch:{
		nospeechlist(val){
			this.cities = val
		}
	},
	computed:{
    	...mapGetters(['authToken', 'nospeechlist', 'roomId'])
	}

}
</script>

<style lang="less" scoped>
	.no_speech_wrap { padding: 10px 20px;
		.my_group { height: 200px; overflow-y: scroll; padding: 15px 0;
			> label { display:inline-block; margin-left: 0; min-width: 120px; }
		}
		.all_wrap { border-top: 1px solid #C5C5C5; padding-top: 10px; }
		.btn_wrap { height: 30px; text-align: center;
			> button { background: #F87549; border: none; padding: 3px 20px; color: #FFFFFF; cursor: pointer; outline: none;}
		}
	}
</style>
