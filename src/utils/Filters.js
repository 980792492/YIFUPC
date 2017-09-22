import Constant from '@/utils/Constant'
// 公用过滤器

// 富文本处理图片及表情
export const switchBody = function (text, imgSuffix = '') {
	// 过滤不合法的内容
	if (text === undefined || text === null || text === '') return '' 

	// 过滤表情
	if (/\[@.*@\]/.test(text)) {
	  text = text.replace(/\[@(F_[0-9]{1,4})([J|G])@\]/g, (s0, s1, s2) => {
	    return `<img class="js-ubb" src="${Constant.UBB_IMG_URL}${s1}.${s2==='J' ? 'jpg' : 'gif'}" />`
	  })
	}

	// 过滤图片
	if (/\[#.*#\]/.test(text)) {
	  text = text.replace(/\[#(.+?)#\]/g, (s0, s1) => {
	    return `<img class="js-ubb-img am-img-thumbnail" src="${s1}${imgSuffix}" origin="${s1}" />`
	  })
	}

	return text
	// return text.replace(/href=["'].+?["']/g, "href=\"javascript:;\"");
}

//历史直播页面根据类型显示内容
export const historyshow = function(str){
	return str == 1 ? '进入直播' : '查看记录'
}

//最近5条订阅记录的type转换成name
export const typeName = function(str){
	return  str == 305 ? 'vip'  : str == 306 ?  '付费观点'  :  'CJG' 
}

//时间截取
export const toDate = function(str){
	return  str.split(' ')[0]
}
//剩余时间转换

//export const restTime = function( str1 ,str2 ){
//	str1 = Date.parse( new Date(str1) ) 
//	const restTime = str2
//	
//	
//	
//	return restTime
//}


//文章模块,我的文章(老师)文章类型
export const toType = function(item){
	if(item.Type == 1){
		return '藏金阁'
	}
	if(item.Type == 2) {
		return '付费文章'
	}
	if (item.Type == 3){
		return '免费文章'
	}
	
}

