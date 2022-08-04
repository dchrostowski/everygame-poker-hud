
const ORIGINAL_WINDOW = window
ORIGINAL_WINDOW.GAME_LIST = {}
ORIGINAL_WINDOW.HAND_DATA = {}
ORIGINAL_WINDOW.SOCKETS_TO_TABLES = {}


class TournamentInfo {
  constructor(tournNum, tournName, table_id) {
    this.tournament_number = tournNum
    this.tournament_name = tournName
    this.table_id = table_id
  }
}


class PokerHand {
  constructor(site_name, game_number, table_name, table_id) {
    this.site_name = site_name
    this.game_number = game_number
    this.table_name = table_name
    this.table_id = table_id
    this.start_date_utc = new Date().toUTCString()

    this.handState = 'in progress'

  }

  setHandState(val) {
    this.handState = val
  }

}


const parseSocketData = async (message, webSocketId) => {
  console.log("-----------------------------------------")
  console.log(JSON.stringify(message))
  console.log("-----------------------------------------")


  if (message?.payload?.t) {
    switch (message.payload.t) {
      case 'TableConnected': {
        ORIGINAL_WINDOW.SOCKETS_TO_TABLES[webSocketId] = message.payload.p[9]
        break;
      }
      case 'TableHandStart': {
        console.log("all the game data:")
        console.log(ORIGINAL_WINDOW.GAME_LIST)
        let tableId = ORIGINAL_WINDOW.SOCKETS_TO_TABLES[webSocketId]
        let handId = String(message.payload.p[0])
        console.log(`table di: ${tableId} handId: ${handId}`)
        //const table_name = ORIGINAL_WINDOW.GAME_LIST
        // const tabId = socket?.RedisPath || socket?.tableId
        // const tournInfo = ORIGINAL_WINDOW.tournamentInfo?.[game_number] || null
        // const ti = ORIGINAL_WINDOW.tableInfo[game_number]

        //ORIGINAL_WINDOW.handData[game_number] = new PokerHand('everygame.eu', game_number, table_name)
        break;
      }
      case 'TableHandEnd': {
        let handId = message.payload.p[0]
        // if (ORIGINAL_WINDOW.handData.hasOwnProperty(game_number)) {
        //   hand = ORIGINAL_WINDOW.handData[Number(game_number)]
        //   hand.setHandState('completed')
        //   ORIGINAL_WINDOW.handData[Number(game_number)] = hand
        //   socket.game_number = null
        // }

        // break;
      }
      default: {
        console.log("didn't parse anything for " + message.payload.t)
        return
      }

    }
  }

}

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


highjackIFrameWebsocket = async () => {
  const embeddedWindow = await getEmbeddedWindow()
  WebSocket = embeddedWindow.WebSocket
  let ws2 = WebSocket
  ws2.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws2 = embeddedWindow.WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);
      this.socketWindow = embeddedWindow

      this.addEventListener('message', async (event) => {
        await parseSocketData(JSON.parse(event.data),this.webSocketId)
      });

      this.addEventListener('open', event => {
        console.log("socket opened, see event")
        console.log(event)
        const date = new Date()
        const socketId = date.getTime()
        this.webSocketId = socketId
      });
    }

    send(...args) {
      let msg
      try {
        msg = JSON.parse(args[0])
        if(msg?.['payload'].t === 100 && msg['payload']?.p[0]) {
          console.logg("send this basically")
          console.log(msg)
          console.log("----------------------------")
          console.log(`map the table id ${msg['payload'].p[0]} to the socket id ${this.webSocketId}`)
          ORIGINAL_WINDOW.SOCKETS_TO_TABLES[this.webSocketId] = msg['payload'].p[0]
        }
      }
      catch(err) {
        console.log('error: ' + err)
      }
      super.send(...args);
    }
  }

return

}


const parseMainSocketData = async (message) => {

  console.log("main websocket message:")
  console.log("----------------------------------------------------")
  console.log(message)
  console.log("----------------------------------------------------")

  if (message?.cmd === 'SUB' && message?.name) {
    if (message.name.includes('list') || message.name.includes('List'))
      message?.results.forEach((game) => {
        ORIGINAL_WINDOW.GAME_LIST[game.RedisPath] = game
      })
  }


}

highjackPrimaryWebsocket = async () => {
  console.log('primary highjack')
  let ws1 = WebSocket
  console.log(ws1)
  ws1.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws1 =  WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);
      this.socketWindow = embeddedWindow

      this.addEventListener('message', async (event) => {
        console.log("Message from main socket")
        parseMainSocketData(JSON.parse(event.data))
      });

      this.addEventListener('open', event => {
        console.log("Main socket opened")
        console.log(event)
      });
    }

    send(...args) {
      console.log('stuck on send?')
      super.send(...args);
    }
  }

}


//highjackPrimaryWebsocket()
highjackIFrameWebsocket()



