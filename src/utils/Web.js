import { cookie } from 'cookie_js/cookie'
import Constant from './Constant'
import store from '@/store'
import * as types from '@/store/types'

/*
 * 页面相关功能
 */
const Web = {
    // 初始化标题
    initTitle (teacherName) {
        this.title = `${teacherName}:${teacherName}直播室_一富财经直播室_一富财经`
        this.setTitle(this.title)

        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
            null;
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        // 添加监听器
        document.addEventListener(visibilityChangeEvent, () => {
            if (!document[hiddenProperty]) {
                this.setTitle(this.title)
                store.commit(types.CLEAR_NEW_MESSAGE_NUM)
            }
        }, false);
    },
    // 获取初始化标题
    getTitle () {
        return this.title
    },
    // 修改标题
    setTitle (title) {
        document.title = title
    },
    // 播放消息提示音
    play (roomId) {
        if (this.isPlay(roomId)) {
            var audio = new Audio("/static/tone.mp3")
            audio.play()
        }
    },
    // 设置是否播放提示音（cookie）
    setPlay (flag, roomId) {
        if (flag) {
            cookie.set('yf_sound_' + roomId, 1, {
                expires: 2000,
                domain: Constant.COOKIE_DOMAIN,
                path: Constant.COOKIE_PATH
            })
        } else {
            cookie.removeSpecific('yf_sound_' + roomId, {
                domain: Constant.COOKIE_DOMAIN,
                path: Constant.COOKIE_PATH
            })
        }
    },
    // 是否需要播放提示音
    isPlay (roomId) {
        return !!cookie.get('yf_sound_' + roomId)
    },

    // 是否ie
    isIE () {
        const userAgent = navigator.userAgent
        const isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        return isIE;
    },

    // 设置使用老编辑器（cookie）
    setOldEditor (flag) {
        if (flag) {
            cookie.set('yf_old_editor', 1, {
                expires: 2000,
                domain: Constant.COOKIE_DOMAIN,
                path: Constant.COOKIE_PATH
            })
        } else {
            cookie.removeSpecific('yf_old_editor', {
                domain: Constant.COOKIE_DOMAIN,
                path: Constant.COOKIE_PATH
            })
        }
    },

    isOldEditor () {
      return !!cookie.get('yf_old_editor')
    },

    // 初始化xhreditor
    initXheditor (dom, width = 720, height = 212, category = 0) {
        return dom.xheditor({
            "tools":"Source,Fontface,FontSize,Bold,Italic,FontColor,BackColor,SelectAll,Removeformat,Align,List,Underline,Link,Unlink,Emot,Img,Flash,Table,Fullscreen",
            "width":width,
            "height":height,
            "upImgUrl":"http://wxapi.yifucj.com/api/Image/UploadEditorImg?category=" + category,
            "upImgExt":"jpg,jpeg,gif,png",
            "localUrlTest":/^http?:\/\/[^\/]*?(yifucj\.com)\//i,
            "remoteImgSaveUrl":"http://wxapi.yifucj.com/api/Image/UploadRemoteImg?category=" + category,
            "emotPath": "http://static.yifucj.com/xheditor/xheditor_emot/",
            "emots":{
              "yifu":{
                "name":"一富",
                "width":20,
                "height":25,
                "line":10,
                "list":{
                  "hanx":"憨笑","kl":"骷髅","cd":"菜刀","xig":"西瓜","pj":"啤酒","lq":"篮球","pp":"乒乓","zt":"猪头","kf":"咖啡","fan":"饭","mg":"玫瑰","dx":"凋谢","sa":"示爱","ax":"爱心","dg":"蛋糕","sd":"闪电","zhd":"炸弹","dao":"刀","zq":"足球","pch":"瓢虫","bb":"便便","yl":"月亮","ty":"太阳","lw":"礼物","yb":"拥抱","qiang":"强","ruo":"弱","ws":"握手","shl":"胜利","bq":"抱拳","gy":"勾引","qt":"拳头","cj":"差劲","aini":"爱你","bu":"No","hd":"Ok","qsh":"潜水","jl":"敬礼","shh":"石化","anw":"安慰","bgl":"扮鬼脸","wy":"无语","kh":"狂汗","tq":"叹气","jy":"加油","shb":"生病","bt":"摆脱","gj":"孤寂","qy":"惬意","fzh":"烦躁"
                }
              }
            }
        })
    }
}

export default Web
