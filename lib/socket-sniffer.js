
const ORIGINAL_WINDOW = window

class TournamentInfo {
  constructor(tournNum, tournName, table_id) {
    this.tournament_number = tournNum
    this.tournament_name = tournName
    this.table_id = table_id
  }
}


class PokerHand {
  constructor( site_name, game_number, table_name, table_id,tournamentInfo,tableInfo) {
    this.site_name = site_name
    this.game_number = game_number
    this.table_name = table_name
    this.table_id = table_id
    this.start_date_utc = new Date().toUTCString()






    console.log("tourn info:")
    console.log(tournamentInfo)

    if(tournamentInfo !== null) {
      this.tournament = true
      const tid = tournamentInfo[game_number].TournamentID
      const tname = tournamentInfo[game_number].TournamentName.Value
      const tab_id = tournamentInfo[game_nubmerisPath].TableID.Value
      this.tournament_info = new TournamentInfo(tid,tname,tab_id)
    }
    else {
      this.tournament = false
    }


    this.game_type = tableInfo[String(game_number)][7]
    this.bet_limit = tableInfo[String(game_number)][5]


    //this.game_type = pa.PokerGameType.enumGetName(ORIGINAL_WINDOW.GAME_LIST[redisPath].GameTypeID.Value)
    //this.bet_limit = pa.PokerPotType.enumGetName(ORIGINAL_WINDOW.GAME_LIST[redisPath].GameTypeID.Value)


    console.log('tableinfo:')
    console.log(tableInfo)






    this.handState = 'in progress'

  }

  setHandState(val) {
    this.handState = val
  }

}



const getTableName = (socket) => {

  if (socket?.RedisPath) {

    try {
      return `${ORIGINAL_WINDOW.tournamentInfo[socket.RedisPath].Description.Value} - Table #${ORIGINAL_WINDOW.tournamentInfo[socket.RedisPath].TableID.Value}`
    }
    catch(err) {
      return ORIGINAL_WINDOW.tableInfo[String(socket.tableId)][0]

    }
  }
  else if (socket?.tableId) {

    return ORIGINAL_WINDOW.tableInfo[String(socket.tableId)][0]

  }

  return 'unknown'
}
// pokerapp.TableSeatStateData = cc.Class.extend({
//   _seatPosition: null,
//   _seatState: null,
//   _playerName: null,
//   _playerStack: null,
//   _playerBet: null,
//   _lastAction: null,
//   _lastActionAmount: null,
//   _playerCards: null,
//   _playerId: null,
//   _playerCity: null,
//   _avatarId: null,
//   _rebuyAddonState: null,
//   _handStrength: "",
//   _bounty: null,
//   ctor: function () {
//       this._seatPosition = -1;
//       this._seatState = pokerapp.SeatState.Empty;
//       this._playerName = "";
//       this._playerBet = this._playerStack = 0;
//       this._lastAction = "";
//       this._lastActionAmount = 0;
//       this._playerCards = [];
//       this._handStrength =
//           this._rebuyAddonState = this._avatarId = this._playerCity = this._playerId = "";
//       this._bounty = 0
//   },
//   getSeatPosition: function () {
//       return this._seatPosition
//   },
//   getSeatState: function () {
//       return this._seatState
//   },
//   getPlayerName: function () {
//       return this._playerName
//   },
//   getPlayerStack: function () {
//       return this._playerStack
//   },
//   getPlayerBet: function () {
//       return this._playerBet
//   },
//   getLastAction: function () {
//       return this._lastAction
//   },
//   getLastActionAmount: function () {
//       return this._lastActionAmount
//   },
//   getPlayerCards: function () {
//       return this._playerCards
//   },
//   getPlayerId: function () {
//       return this._playerId
//   },
//   getPlayerCity: function () {
//       return this._playerCity
//   },
//   getAvatarId: function () {
//       return this._avatarId
//   },
//   getRebuyAddonState: function () {
//       return this._rebuyAddonState
//   },
//   getHandStrength: function () {
//       return this._handStrength
//   },
//   getBounty: function () {
//       return this._bounty
//   },
//   updateFromValues: function (a) {
//       this._seatPosition = pokerapp.ConvertUtil.toInt(jcore.util.safeIndex(a, 0), -1);
//       this._seatState = pokerapp.ConvertUtil.toSeatState(jcore.util.safeIndex(a, 1), pokerapp.SeatState.Empty);
//       this._playerName = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 2), "");
//       this._playerStack = pokerapp.ConvertUtil.toDecimal(jcore.util.safeIndex(a, 3), 0);
//       this._playerBet = pokerapp.ConvertUtil.toDecimal(jcore.util.safeIndex(a, 4), 0);
//       this._lastAction = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 5), "");
//       this._lastActionAmount = pokerapp.ConvertUtil.toDecimal(jcore.util.safeIndex(a, 6), 0);
//       this._playerCards = pokerapp.ConvertUtil.toCards(jcore.util.safeIndex(a, 7), []);
//       this._playerId = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a,
//           8), "");
//       this._playerCity = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 9), "");
//       var b = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 10), ""); - 1 < b.indexOf(":") ? this._avatarId = b.substring(b.indexOf(":") + 1) : this._avatarId = pokerapp.ConvertUtil.toInt(b, -1);
//       this._rebuyAddonState = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 11), "");
//       this._handStrength = pokerapp.ConvertUtil.toString(jcore.util.safeIndex(a, 14), "");
//       this._bounty = pokerapp.ConvertUtil.toDecimal(jcore.util.safeIndex(a, 15), 0)
//   }
// });

async function processMessage(eventMessage, site, socket, ORIGINAL_WINDOW) {


  const message = JSON.parse(eventMessage.data)
  console.log("-----------------------------------------")
  console.log(message)
  console.log("-----------------------------------------")
  let game_number = ''
  if (message?.cmd === 'GCT' && message?.name === 'CTN' && message?.results) {

    message.results.forEach((result) => {

      ORIGINAL_WINDOW.tournamentInfo[result.RedisPath] = result.Values
    })

  }

  if(message?.cmd === 'SUB' && message?.name) {
    console.log('got sub message')
    if(message.name.includes('list') || message.name.includes('List'))
    message?.results.forEach((game) => {
      ORIGINAL_WINDOW.GAME_LIST[game.RedisPath] = game

    })
  }


  if (message?.payload?.t) {
    switch (message.payload.t) {
      case 'TableConnected': {
        const tableSessionId = message.payload?.p[9]
        ORIGINAL_WINDOW.tableInfo[tableSessionId] = message.payload.p
        socket.tableId = tableSessionId
        socket.game_number = game_number
        break;
      }
      case 'TableHandStart': {
        const game_number = String(message.payload.p[0])
        const table_name = ORIGINAL_WINDOW.GAME_LIST()
        const tabId = socket?.RedisPath || socket?.tableId
        const tournInfo = ORIGINAL_WINDOW.tournamentInfo?.[game_number] || null
        const ti = ORIGINAL_WINDOW.tableInfo[game_number]

        ORIGINAL_WINDOW.handData[game_number] = new PokerHand('everygame.eu', game_number, table_name, tournInfo, , ti)
        break;
      }
      case 'TableHandEnd': {
        game_number = message.payload.p[0]
        if (ORIGINAL_WINDOW.handData.hasOwnProperty(game_number)) {
          hand = ORIGINAL_WINDOW.handData[Number(game_number)]
          hand.setHandState('completed')
          ORIGINAL_WINDOW.handData[Number(game_number)] = hand
          socket.game_number = null
        }

        break;
      }
    }
  }
  console.log('HAND DATA:')
  console.log(ORIGINAL_WINDOW.handData)

  console.log('Tournament Info:')
  console.log(ORIGINAL_WINDOW.tournamentInfo)

  console.log('Table info:')
  console.log(ORIGINAL_WINDOW.tableInfo)


}





async function parseSocketData(eventMessage, site, socket,ORIGINAL_WINDOW) {


  // console.log("-----------------------------")
  // console.log(eventMessage.data)
  // console.log(eventMessage)
  // console.log("-----------------------------")
  // site = site || "poker.everygame.eu"
  // console.log('hhheeerrreeee')
  // console.log(socket)

  await processMessage(eventMessage, site, socket, ORIGINAL_WINDOW)


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




ORIGINAL_WINDOW.handData = {}
ORIGINAL_WINDOW.tournamentInfo = {}
ORIGINAL_WINDOW.tableInfo = {}
ORIGINAL_WINDOW.GAME_LIST = {}


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
        this.socketWindow = embeddedWindow

        let site



        parseSocketData(event, site, this, ORIGINAL_WINDOW)

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


      parseSocketData(event, '', this, ORIGINAL_WINDOW)
      let site

      if (event.origin === 'wss://gs1.wssdata1.com:4703/ws/game') {
        site = "EveryGame Poker"
        parseSocketData(JSON.parse(event), site, WebSocket, ORIGINAL_WINDOW)
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





