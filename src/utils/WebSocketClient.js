import Constant from './Constant';

class WebSocketClient {

  constructor (opt) {
    this.option = opt
    this.ws = this.init()
    return this.ws
  }

  init () {
    if ( !window.WebSocket ) {
      return null
    }
    const ws = new WebSocket(Constant.WS_URL)
    ws.onopen = e => {
      console.log("连接成功。")
      this.option.onOpen && this.option.onOpen.call(this, e)
    }

    ws.onmessage = event => {
      // console.log(event.data)

      // 处理收到的数据
      let resp = JSON.parse(event.data)
      if (resp.type === 'tip') {
        // 收到普通数据
        console.log(resp.body)
        return
      } else if (resp.type === 'data') {
        // 收到更新数据
        this.option.getData && this.option.getData.call(this, resp.body)
      }
    }

    ws.onclose = () => {
      console.log("连接关闭。", "ERROR")
      this.option.onClose && this.option.onClose.call(this)
    }

    ws.onerror = () => {
      console.log("WebSocket错误。", "ERROR")
      this.option.onError && this.option.onError.call(this)
    }

    return ws
  }

  login (topicId, userId) {
    const data = {
      t : "login",
      topic : topicId,
      user : userId
    }
    this.ws.send(JSON.stringify(data))
  }

}

// const WebSocketClient = {
//   init(option) {
//     this.onOpen = option.onOpen || this.onOpen;
//     this.onMessage = option.onMessage || this.onMessage;
//     this.onClose = option.onClose || this.onClose;
//     this.onError = option.onError || this.onError;

//     return this.connect();
//   },

//   onOpen() {
//     console.log("连接成功。");
//   },

//   onMessage(event) {
//     console.log(event.data);
//   },

//   onClose() {
//     console.log("连接关闭。", "ERROR");
//   },

//   onError() {
//     console.log("WebSocket错误。", "ERROR");
//   },

//   connect() {
//     let ws = new WebSocket(Constant.WS_URL);
//     ws.onopen = this.onOpen;
//     ws.onmessage = this.onMessage;
//     ws.onclose = this.onClose;
//     ws.onerror = this.onError;
//     return ws;
//   },
// }

export default WebSocketClient;
