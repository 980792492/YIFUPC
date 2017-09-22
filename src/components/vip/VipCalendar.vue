<template>
	<div id="history_calendar">
		<div class="month">
			<span class="choose-year">{{ currentYear }}年</span><span class="choose-month">{{ currentMonth }}月</span>
		</div>
		<ul class="weekdays">
		  <li style="color:red">日</li>
		 <li>一</li>
		  <li>二</li>
		  <li>三</li>
		  <li>四</li>
		  <li>五</li>
		  <li style="color:red">六</li>
		</ul>
		<ul class="days">
		  <li @click="pick(day)" v-for="day in days" :class="{ belong: !(day < startTime) && !(day > endTime), start: startTime == day }"  >
		   <!--今天-->
		   	<span v-if="day.getMonth()+1 != currentMonth" class="other_month">{{ day.getDate()}}</span>
		   	<span v-else>
		   	<!--今天-->
		  	 	<span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == myDay" class="active">{{ day.getDate() }}</span>
		   		<span v-else>{{day.getDate()}}</span> 
		   </span>
		  </li>
  		</ul>
		
		
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'historycalendar',
	data (){
		return {
		   startTime:'1503244800000',
		   endTime: '1503964800000',
		   myDay: 20,
		   myMounth:'',
		   myYear:'',
		   days: [],
		}
	},
	created(){
		this.initData()
		this.myDay = new Date().getDate()   
		
		this.initRiliDate( new Date().getTime())
	},
	methods:{
		initData: function(cur) {
	   	  var date;
		   if (cur) {
		      date = new Date(cur);
		   } else {
		      date = new Date();
		   }
	   	   this.currentDay = date.getDate();      //获取当前日期（日）

	       this.currentYear = date.getFullYear();   //获取当前年限 （年）
	       this.currentMonth = date.getMonth() + 1;   // 获取当前月份 （月）
	       this.currentWeek = date.getDay();          // 1...6,0      获取今日周几 （周几）
	       
	       
	       if (this.currentWeek == 0) {
	          this.currentWeek = 1;
	       }
	       
	   	   var str = this.formatDate(this.currentYear , this.currentMonth, this.currentDay);    //将取到的当前时间拼接
		   this.days.length = 0;
		   
		   
		   // 今天是周日，放在第一行第7个位置，前面6个
//		   console.log(this.currentWeek)
		   for (var i = this.currentWeek; i >= 0; i--) {
		    var d = new Date(str);      // 格式化取到的当前时间
		    	d.setDate(d.getDate() - i);    //设置毫秒数
			    this.days.push(d);
		   }
//		        上面的代码是将当前日期和当前日期的前一天push到days中	   
		   for (var i = 1; i <= 35 - this.currentWeek; i++) {
		    var d = new Date(str);
		    d.setDate(d.getDate() + i);
		    this.days.push(d);
		   }
		   
	   	},
	   pick: function(date) {       //点击选择日期
//	   		alert(date)
			this.initRiliDate(date)
	   		this.currentDay = date.getDate()
	   		this.myDay = date.getDate()
	   		this.currentMonth = date.getMonth()+1
	   		this.currentYear = date.getFullYear()
	   		this.initData(this.formatDate(this.currentYear, this.currentMonth, this.currentDay))
	   },
	   // 返回 类似 2016-01-02 格式的字符串
	   formatDate: function(year,month,day){
		   var y = year;
		   var m = month;
		   if(m<10) m = "0" + m;
		   var d = day;
		   if(d<10) d = "0" + d;
		   return y+"-"+m+"-"+d
	   },
	   ...mapActions(['initRiliDate'])
	   
	}
}
</script>

<style lang="less">
#history_calendar { padding: 0 50px; width: 414px; height: 290px; overflow: hidden;
	.month { text-align: center; color: #FFFFFF; height: 50px; line-height: 50px;
		> span { color: #FFFFFF; font-size: 16px;}
	}
	.weekdays {
		li { float: left; width: 14.2%; color: #391958; background: #9e949f; text-align: center; height: 30px; line-height: 30px; font-size: 14px; border-right: 1px solid #57405c;}
		
	}
	
	
	.days {
		.other_month { color: #77608e !important; }
		.active { background: #ffcc00; border-radius: 15px;}
	}
	
  	.days li { display: inline-block; width: 14.2%; text-align: center; height: 24px; line-height: 24px; margin: 8px 0; font-size: 1rem;
  				color: #76618a;  font-size: 14px; cursor: pointer;
  			span { font-size: 14px; font-weight: 600; color: #ffffff; display: block;}
  	}
	.days .belong { background: #875e3e;}
/*	.days li.belong { border-radius: 5px;}*/
}
</style>