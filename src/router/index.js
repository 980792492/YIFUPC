import Vue from 'vue'
import Router from 'vue-router'

// pages
import Room from '@/pages/Room'
import Cjg from '@/pages/Cjg'
import Vip from '@/pages/Vip'
import Blog from '@/pages/Blog'
import LiveQuestion from '@/pages/Question'
import Video from '@/pages/Video'
import Intro from '@/pages/Intro'
import Live from '@/pages/live/Live'
import LiveMain from '@/pages/live/Main'

import LivePaper from '@/pages/live/Paper'
import LiveEncryptedView from '@/pages/live/EncryptedView'

// 历史直播
import HistoryList from '@/pages/history/HistoryList'
import History from '@/pages/history/History'
import HistoryLive from '@/pages/history/Live'
import HistoryPaper from '@/pages/history/Paper'
import HistoryEncryptedView from '@/pages/history/EncryptedView'

//文章模块
import Article from '@/pages/article/Article'
import ArticleMain from '@/pages/article/Main'
import ArticleDetail from '@/pages/article/Detail'
import ArticleDeliver from '@/pages/article/Deliver'
import PayArticle  from '@/pages/article/PayArticle'

//问答模块
import Question from '@/pages/question/Question'
import QuestionMain from '@/pages/question/Main'
import AllTeacher from '@/pages/question/AllTeacher'
import Detail from '@/pages/question/Detail'

//VIP直播模块
import VipRoom from '@/pages/vip/Vip'
import VipMain from '@/pages/vip/Main'
import ChangeSetView from '@/pages/vip/ChangeSetView'
import OrderRecord from '@/pages/vip/OrderRecord'
import VipDetail from '@/pages/vip/VipDetail'
import VipDetailLive from '@/pages/vip/VipDetailLive'
import VipHistoryLive from '@/pages/vip/HistoryLive'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/room/:id', component: Room, name: 'room', redirect: '/room/:id/live/main',
      children: [
        {
          path: 'live', component: Live, redirect: 'live/main',
          children: [
            { path: 'main', component: LiveMain, name: 'live-main'},
            { path: 'paper', component: LivePaper, name: 'live-paper' },
            { path: 'encrypted-view', component: LiveEncryptedView, name: 'live-encrypted-view' },
          ]
        },
        { path: 'cjg', component: Cjg, name: 'cjg' },
        { path: 'vip', component: Vip, name: 'vip' },
        { path: 'question', component: LiveQuestion , name:'livequestion' },
        { path: 'video', component: Video, name: 'video' },
        { path: 'blog', component: Blog, name: 'blog' },
        { path: 'intro', component: Intro, name: 'intro' },
        { path: 'history-list', component: HistoryList, name:'history-list' },
      ]
    },
    {
      path: '/history/:id', component: History, redirect: '/history/:id/live',
      children: [
        { path: 'live', component: HistoryLive, name: 'history' },
        { path: 'paper', component: HistoryPaper, name: 'history-paper' },
        { path: 'encrypted-view', component: HistoryEncryptedView, name: 'history-encrypted-view' }
      ]
    },
    {
      path: '/article', component: Article,  redirect: {name: 'index', params: {id: 'all'}},
      children: [
      	{path:'main/:id', component: ArticleMain, name:'index'},
      	{path:'detail/:id', component:ArticleDetail,name:'detail'},
      	{path:'payarticle/:id', component:PayArticle, name:'payarticle'},
      	{path:'deliver', component:ArticleDeliver, name:'deliver'}

      ]
    },
    { 
      path: '/question', component: Question, name:'question', redirect: {name: 'questionmain', params: {id: 'all'}},
      children: [
      	{path:'main/:id', component: QuestionMain, name:'questionmain'},
      	{path:'allteacher', component:AllTeacher, name:'allteacher'},
      	{path:'detail/:id', component:Detail, name:'questiondetail'}

//    	{path:'detail/:id', component:ArticleDetail,name:'detail'},
//    	{path:'payarticle/:id', component:PayArticle, name:'payarticle'},


      ],
    },
    {
    	path: '/vip', component: VipRoom,  redirect: {name: 'vipmain', params: {id: 'all'}},
    	children:[
    		{ path:'room/:id', component:VipMain, name: 'vipmain'},
    		{ path:'tchangesetview', component:ChangeSetView, name: 'changesetview'},
    		{ path:'orderrecord/:id', component:OrderRecord, name: 'orderrecord'},
    		{ path:'detail/:id', component:VipDetail, name: 'vipdetail'},
    		{ path: 'viplive/:id', component: VipDetailLive, name: 'detaillive'},
    		{ path: 'historylive', component: VipHistoryLive, name: 'VipHistoryLive'},
    	]
    	
    }



  ]
})
