





class PokerHand {
  constructor(site_name, game_number, table_name, table_id) {
    this.site_name = site_name
    this.game_number = game_number
    this.table_name = table_name
    this.table_id = table_id

    this.handState = 'in progress'

  }

  setHandState(val) {
    this.handState = val
  }

}



const getTableName = (socket) => {

  if (socket?.RedisPath) {

    return `Tournament # ${ORIGINAL_WINDOW.tournamentInfo[socket.RedisPath].TournamentID.Value} - Table ${ORIGINAL_WINDOW.tournamentInfo[socket.RedisPath].TableID.Value}`
  }
  else if (socket?.tableId) {

    return ORIGINAL_WINDOW.tableInfo[socket.tableId][0]
  }

  return 'unknown'
}

async function processMessage(eventMessage, site, socket) {


  const message = JSON.parse(eventMessage.data)
  let game_number = ''
  if (message?.cmd === 'GCT' && message?.name === 'CTN' && message?.results) {

    message.results.forEach((result) => {

      ORIGINAL_WINDOW.tournamentInfo[result.RedisPath] = result.Values
    })

  }
  if (message?.payload?.t) {
    switch (message.payload.t) {
      case 'TableConnected': {
        const tableSessionId = message.payload?.p[9]
        ORIGINAL_WINDOW.tableInfo[tableSessionId] = message.payload.p
        socket.tableId = tableSessionId
        break;
      }
      case 'TableHandStart': {
        const game_number = message.payload.p[0]
        const table_name = getTableName(socket)
        const tableId = socket?.RedisPath || socket?.tableId
        ORIGINAL_WINDOW.handData[game_number] = new PokerHand('everygame.eu', game_number, table_name, tableId)
        break;
      }
      case 'TableHandEnd': {
        game_number = message.payload.p[0]
        if (ORIGINAL_WINDOW.handData.hasOwnProperty(game_number)) {
          hand = ORIGINAL_WINDOW.handData[game_number]
          hand.setHandState('completed')
          ORIGINAL_WINDOW.handData[game_number] = hand
        }

        break;
      }
    }
  }
  console.log('HAND DATA:')
  console.log(ORIGINAL_WINDOW.handData)


}





async function parseSocketData(eventMessage, site, socket) {


  // console.log("-----------------------------")
  // console.log(eventMessage.data)
  // console.log(eventMessage)
  // console.log("-----------------------------")
  // site = site || "poker.everygame.eu"
  // console.log('hhheeerrreeee')
  // console.log(socket)

  await processMessage(eventMessage, site, socket)


  // if (eventMessage.origin === 'wss://gs1.wssdata1.com:4703') {
  //   // var xhr = new XMLHttpRequest();
  //   // console.log("message data type")
  //   // console.log(typeof eventMessage.data)
  //   // xhr.open("POST", 'https://api.cornblaster.com/post/test', true);
  //   // xhr.setRequestHeader('Content-Type', 'application/json');
  //   // xhr.send(eventMessage.data)
  //   // console.log('did request')

  // }
  // else {
  //   console.log("origin was incorrect: " + eventMessage.origin)
  // }
}


const ORIGINAL_WINDOW = window

ORIGINAL_WINDOW.handData = {}
ORIGINAL_WINDOW.tournamentInfo = {}
ORIGINAL_WINDOW.tableInfo = {}

const getEmbeddedWindow = async () => {

  return new Promise((resolve, reject) => {
    const check = () => {

      if (document?.getElementById('gameFrame')?.contentWindow) {
        return resolve(document.getElementById('gameFrame').contentWindow)
      }
      setTimeout(check, 50)
    }
    check()
  })

}


highjackWebsocket = async () => {
  const embeddedWindow = await getEmbeddedWindow()
  WebSocket = embeddedWindow.WebSocket
  let ws2 = WebSocket

  ws2.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws2 = embeddedWindow.WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);
      this.socketWindow = embeddedWindow

      this.addEventListener('message', event => {
        let ws_sniff_debug_from = new CustomEvent("ws_sniff_debug_from", {
          detail: {
            data: event,
            obj: this
          }
        });
        document.body.dispatchEvent(ws_sniff_debug_from);
        //this.socketWindow = embeddedWindow

        let site



        parseSocketData(event, site, this)

        if (event.origin === 'wss://gs1.wssdata1.com:4703/ws/game') {
          site = "EveryGame Poker"

        }

      });

      this.addEventListener('open', event => {
        let ws_sniff_debug_open = new CustomEvent("ws_sniff_debug_open", {
          detail: {
            data: event,
            obj: this
          }
        });

        const date = new Date()
        const socketId = date.getTime()
        this.webSocketId = socketId


      });


    }
    send(...args) {
      let ws_sniff_debug_to = new CustomEvent("ws_sniff_debug_to", {
        detail: {
          data: args[0],
          obj: this
        }
      });
      document.body.dispatchEvent(ws_sniff_debug_to);
      let msg
      try {
        msg = JSON.parse(ws_sniff_debug_to.detail.data)
        console.log(msg)
      }
      catch (err) {
      }
      if (msg?.payload && msg?.payload?.t === 100 && msg.payload?.p && msg.payload.p[0]) {
        this.RedisPath = msg.payload.p[0]
      }
      super.send(...args);
    }
  }


}

let ws1 = WebSocket

ws1.prototype = null; // extending WebSocket will throw an error if this is not set
const ORIGINAL_WEBSOCKET = WebSocket;
ws1 = window.WebSocket = class extends WebSocket {

  constructor(...args) {
    super(...args);


    this.addEventListener('message', event => {
      let ws_sniff_debug_from = new CustomEvent("ws_sniff_debug_from", {
        detail: {
          data: event,
          obj: this
        }
      });
      document.body.dispatchEvent(ws_sniff_debug_from);


      parseSocketData(event, '', this)
      let site

      if (event.origin === 'wss://gs1.wssdata1.com:4703/ws/game') {
        site = "EveryGame Poker"
        parseSocketData(JSON.parse(event), site)
      }

    });

    this.addEventListener('open', event => {
      let ws_sniff_debug_open = new CustomEvent("ws_sniff_debug_open", {
        detail: {
          data: event,
          obj: this
        }
      });
      const date = new Date()
      const socketId = date.getTime()
      this.webSocketId = socketId
      getEmbeddedWindow().then((w) => this.socketWindow = w)



    });


  }
  send(...args) {
    let ws_sniff_debug_to = new CustomEvent("ws_sniff_debug_to", {
      detail: {
        data: args[0],
        obj: this
      }
    });
    document.body.dispatchEvent(ws_sniff_debug_to);

    console.log('ON SEND:')
    console.log(ws_sniff_debug_to.detail.data)
    let msg
    try {
      msg = JSON.parse(ws_sniff_debug_to.detail.data)
      console.log(msg)
    }
    catch (err) {
      console.log('couldnt parse sent')
    }

    if (msg?.payload && msg?.payload?.t === 100 && msg.payload?.p && msg.payload.p[0]) {
      console.log('GOT REDIS PATH')
      this.RedisPath = msg.payload.p[0]
    }
    super.send(...args);

  }
}




highjackWebsocket()





