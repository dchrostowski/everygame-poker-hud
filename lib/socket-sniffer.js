
const ORIGINAL_WINDOW = window
window.prototype = null
ORIGINAL_WINDOW.GAME_LIST = {}
ORIGINAL_WINDOW.HAND_DATA = {}
ORIGINAL_WINDOW.SOCKETS_TO_TABLES = {}
ORIGINAL_WINDOW.SOCKET_WINDOWS = {}
ORIGINAL_WINDOW.SOCKET_CURRENT_HAND = {}
ORIGINAL_WINDOW.HANDS_IN_PROGRESS = {}
ORIGINAL_WINDOW.COMPLETED_HANDS = []
ORIGINAL_WINDOW.GAME_SOCKETS = []
ORIGINAL_WINDOW.TABLE_CONNECT_DATA = {}


function output(inp) {
  document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}


class TournamentInfo {
  constructor(tournNum, tournName, table_id) {
    this.tournament_number = tournNum
    this.tournament_name = tournName
    this.table_id = table_id
  }
}


class PokerHand {
  constructor(site_name, handId, socketId, tableInfo) {
    console.log('creating new poker hand')
    this.handId = handId
    this.pokerapp = ORIGINAL_WINDOW.SOCKET_WINDOWS[socketId].pokerapp
    console.log(tableInfo)
    this.tournament = tableInfo?.TournamentID ? true : false



    this.database_model = {
      spec_version: '1.2.2',
      internal_version: '0.2.0',
      game_number: handId,
      site_name: site_name,
      tournament: this.tournament,
      table_name: this.tournament ? null : tableInfo.TableName.Value,
      table_handle: this.tournament ? null : tableInfo.TableID.Value,
      network_name: site_name,
      game_type: this.pokerapp.PokerGameType.enumGetName(tableInfo.GameTypeID.Value),
      bet_limit: this.pokerapp.PokerLimitType.enumGetName(tableInfo.LimitType.Value), // fix this
    }


    this.handState = 'in progress'
    this.events = []

  }

  setHandState(val) {
    this.handState = val
  }

}


const parseSocketData = async (message, webSocketId) => {
  console.log("-----------INCOMING GAME DATA------------")
  console.log("-----------------------------------------")
  //console.log(JSON.stringify(message, undefined, 4))
  const correlated_table_id = ORIGINAL_WINDOW.SOCKETS_TO_TABLES[webSocketId]
  const tableInfo = ORIGINAL_WINDOW.GAME_LIST[correlated_table_id]
  console.log(ORIGINAL_WINDOW.GAME_SOCKETS)
  console.log("sockets to hands:")
  console.log(ORIGINAL_WINDOW.SOCKET_CURRENT_HAND)
  console.log(`There are ${Object.keys(ORIGINAL_WINDOW.HANDS_IN_PROGRESS).length} hands in progress.`)
  console.log(`There have been ${ORIGINAL_WINDOW.COMPLETED_HANDS.length} hands completed/recorded.`)



  console.log("-----------------------------------------")


  if (message?.payload?.t) {
    switch (message.payload.t) {

      case 'TableConnected': {
        const handId = message.payload.p[9]
        ORIGINAL_WINDOW.SOCKET_CURRENT_HAND[webSocketId] = handId
        ORIGINAL_WINDOW.TABLE_CONNECT_DATA[webSocketId] = message.payload.p

        break;
      }

      case 'TableHandStart': {
        const handId = message.payload.p[0]
        console.log("hand id is " + handId)
        ORIGINAL_WINDOW.SOCKET_CURRENT_HAND[webSocketId] = handId
        const hand = new PokerHand('everygame.eu',handId,webSocketId,tableInfo)
        console.log("check hand")
        console.log(hand)
        ORIGINAL_WINDOW.HANDS_IN_PROGRESS[handId] = hand
        console.log('HAND STARTED')
        console.log("hand id is " + handId)
        console.log(message)
        break;
      }
      case 'TableHandEnd': {
        const handId = message.payload.p[0]
        if(handId !== ORIGINAL_WINDOW.SOCKET_CURRENT_HAND[webSocketId]) {
          throw("Hand / Socket ID mismatch")
        }
        const hand = ORIGINAL_WINDOW.HANDS_IN_PROGRESS[handId] || null
        if(hand !== null) {
          hand.setHandState('complete')
          ORIGINAL_WINDOW.COMPLETED_HANDS.push(handId)
          delete ORIGINAL_WINDOW.HANDS_IN_PROGRESS[handId]
          delete ORIGINAL_WINDOW.SOCKET_CURRENT_HAND[webSocketId]
          console.log('HAND COMPLETE')
          console.log("hand id was " + handId)
        }


        break;
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

      this.addEventListener('message', async (event) => {
        await parseSocketData(JSON.parse(event.data),this.webSocketId)
      });

      this.addEventListener('open', event => {
        const date = new Date()
        const socketId = date.getTime()
        this.webSocketId = socketId.toString()
        console.log("A new game socket has been born with id " + socketId)
        ORIGINAL_WINDOW.GAME_SOCKETS.push(socketId)
      });
    }

    send(...args) {
      let msg
      try{
        msg = JSON.parse(args[0])
        // console.log('------------------------------')
        // console.log('check webSocketId')
        // console.log(this.webSocketId)
        // console.log("check origin")
        // console.log(this.url)
        // console.log("check msg:")
        // console.log(JSON.stringify(msg))
        // console.log('------------------------------')
        if(this.url === 'wss://gs1.wssdata1.com:4703/ws/game' && msg?.['payload'].t === 100 && msg['payload']?.p[0]) {
          this.webSocketId = msg.payload.s
          console.log("updated websocket id to " + this.webSocketId)
          console.log(`correlating ${this.webSocketId} to ${msg['payload'].p[0]}`)
          ORIGINAL_WINDOW.SOCKETS_TO_TABLES[this.webSocketId] = msg['payload'].p[0]
          ORIGINAL_WINDOW.SOCKET_WINDOWS[this.webSocketId] = embeddedWindow
        }

      }
      catch(err) {

      }


      super.send(...args);
    }
  }

}


const parseMainSocketData = async (message) => {

  // console.log("main websocket message:")
  // console.log("----------------------------------------------------")
  // console.log(message)
  // console.log("----------------------------------------------------")

  if (message?.cmd === 'SUB' && message?.name) {
    if (message.name.includes('list') || message.name.includes('List'))
      message?.results.forEach((game) => {
        let tableId = game?.Values?.TableID?.Value || game?.Values?.TournamentID?.Value || null
        if(tableId !== null && typeof tableId === 'number') {
          ORIGINAL_WINDOW.GAME_LIST[tableId.toString()] = game.Values
        }



      })
  }


}

highjackPrimaryWebsocket = async () => {
  console.log('primary highjack')
  let ws1 = window.WebSocket
  console.log(ws1)
  ws1.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws1 =  WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);


      this.addEventListener('message', async (event) => {
        console.log("Message from main socket")
        await parseMainSocketData(JSON.parse(event.data))
      });

      this.addEventListener('open', event => {
        console.log("Main socket opened")
        console.log(event)
      });
    }

    send(...args) {
      super.send(...args);
    }
  }

}


highjackPrimaryWebsocket()
highjackIFrameWebsocket()



