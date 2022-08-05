
const OW = window
window.prototype = null
OW.GAME_LIST = {}
OW.HAND_DATA = {}
OW.SOCKETS_TO_TABLES = {}
OW.SOCKET_WINDOWS = {}
OW.SOCKET_CURRENT_HAND = {}
OW.HANDS_IN_PROGRESS = {}
OW.COMPLETED_HANDS = []
OW.GAME_SOCKETS = []
OW.TABLE_CONNECT_DATA = {}


function output(inp) {
  document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

const seatDataMap = {
  0: 'seat',
  1: 'seat_state',
  2: 'name',
  3: 'stack',
  4: 'bet',
  5: 'last_action',
  6: 'last_action_amount',
  7: 'cards',
  8: 'id',
  9: 'city',
  10: 'idk',
  11: 'rebuy_addon_state',
  12: 'unknown1',
  13: 'unknown2',
  14: 'hand_strength',
  15: 'bounty'
}


class Player {
  constructor({ id, seat, name, stack, player_bounty, display }) {
    this.id = id
    this.seat = seat
    this.name = name
    this.display = display || null
    this.starting_stack = stack
    this.player_bounty = player_bounty
  }
}


class TournamentInfo {
  constructor(tournNum, tournName, tabId) {
    this.tournament_number = tournNum
    this.tournament_name = tournName
    this.table_id = tabId
  }
}


class PokerHand {
  constructor(site_name, handId, socketId, tableInfo) {
    //console.log('creating new poker hand')
    this.handId = handId
    const pokerapp = OW.SOCKET_WINDOWS[socketId].pokerapp
    //console.log(tableInfo)
    this.tournament = !!tableInfo?.TournamentID
    this.street = 'PREFLOP'
    const tableConnectData = OW.TABLE_CONNECT_DATA[socketId]
    this.pot = 0
    this.board = []
    this.rake = 0
    this.seats_set = false
    this.seatStateUpdateCount = 0
    this.startingSeats = []
    this.table_size = tableInfo.MaxSeats.Value,

    this.database_model = {
      spec_version: '1.2.2',
      internal_version: '0.2.0',
      game_number: handId,
      network_name: site_name,
      site_name: site_name,
      tournament: this.tournament,
      table_name: this.tournament ? tableConnectData[0] : tableInfo.TableName.Value,
      start_date_utc: new Date().toISOString(),
      table_handle: this.tournament ? OW.SOCKETS_TO_TABLES[socketId] : tableInfo.TableID.Value,
      game_type: pokerapp.PokerGameType.enumGetName(tableInfo.GameTypeID.Value),
      bet_limit: this.tournament ? tableConnectData[5] : pokerapp.PokerLimitType.enumGetName(tableInfo.LimitType.Value), // fix this
      table_size: tableInfo.MaxSeats.Value,
      currency: tableInfo.Currency.Value,
      dealer_seat: -1,
    }

    if (this.tournament) {
      let toId = tableInfo.TournamentID.Value
      let toName = tableInfo.Description.Value
      let toTaId = tableConnectData[0]

      const tourneyInfo = new TournamentInfo(toId, toName, toTaId)
      this.database_model.tournament_info = { ...tourneyInfo }
    }

    this.handState = 'in progress'
    this.events = []

  }

  updateFromTableState = (args) => {

    let [commCards, dealerPos, tablePots, rakeAmount, currentAction] = args
    this.board = commCards.split(' ')
    this.database_model['dealer_seat'] = parseInt(dealerPos)
    this.pot = tablePots //fix later
    this.rake = rakeAmount
    this.street = currentAction

  }

  updateFromTableSeatState = (args) => {

    let [commCards, dealerPos, tablePots, rakeAmount, currentAction] = args
    this.board = commCards.split(' ')
    this.database_model['dealer_seat'] = parseInt(dealerPos)
    this.pot = tablePots //fix later
    this.rake = rakeAmount
    this.street = currentAction

  }

  setSeats = (arrayOfSeats) => {

    if (!this.seats_set || true) {
      arrayOfSeats.forEach(seatData => {
        console.log("seatData")
        console.log(seatData)
        const player = new Player({
          id: seatData['id'],
          seat: parseInt(seatData['seat']) + 1,
          name: seatData['name'],
          starting_stack: parseFloat(seatData['stack']),
          bounty: seatData['bounty']
        })
        console.log('PLAYER')
        console.log(player)
        this.startingSeats.push(player)
      })

      this.seats_set = true
    }
  }


  setHandState = (val) => {
    this.handState = val
  }

}



const parseSocketData = async (message, webSocketId) => {
  console.log("-----------INCOMING GAME DATA------------")
  // console.log("-----------------------------------------")
  //console.log(JSON.stringify(message, undefined, 4))
  const correlated_table_id = OW.SOCKETS_TO_TABLES[webSocketId]
  const tableInfo = OW.GAME_LIST[correlated_table_id]
  //console.log(OW.GAME_SOCKETS)
  // console.log("sockets to hands:")
  // console.log(OW.SOCKET_CURRENT_HAND)
  console.log(`There are ${Object.keys(OW.HANDS_IN_PROGRESS).length} hands in progress.`)
  console.log(OW.HANDS_IN_PROGRESS)
  console.log(`There have been ${OW.COMPLETED_HANDS.length} hands completed/recorded.`)
  console.log(OW.COMPLETED_HANDS)



  console.log("-----------------------------------------")


  if (message?.payload?.t) {
    switch (message.payload.t) {

      case 'TableConnected': {
        const handId = message.payload.p[9]
        OW.SOCKET_CURRENT_HAND[webSocketId] = handId
        OW.TABLE_CONNECT_DATA[webSocketId] = message.payload.p

        break;
      }

      case 'TableState': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HANDS_IN_PROGRESS[handId] : null
        if (hand) {
          hand.updateFromTableState(message.payload.p)
          OW.HANDS_IN_PROGRESS[handId] = { ...hand }
        }

        break;
      }

      case 'TableSeatState': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HANDS_IN_PROGRESS[handId] : null
        if (hand) {
          const convertedSeatData = message.payload.p.map(seatArray => seatArray.split('|'))
          const seatUpdateData = convertedSeatData.map((seatArray) => {
            const seatDict = {}
            seatArray.forEach((sa, idx) => {
              seatDict[seatDataMap[idx]] = sa
            })

            return seatDict

          })

          console.log("check here 2")
          console.log(seatUpdateData)




          if (!hand.seats_set && seatUpdateData.length === this.table_size) {
              hand.setSeats(seatUpdateData)
          }
          //hand.updateFromTableSeatState()
          OW.HANDS_IN_PROGRESS[handId] = { ...hand }
        }

        break;
      }

      case 'TableHandStart': {
        const handId = message.payload.p[0]
        OW.SOCKET_CURRENT_HAND[webSocketId] = handId
        const hand = new PokerHand('everygame.eu', handId, webSocketId, tableInfo)
        OW.HANDS_IN_PROGRESS[handId] = { ...hand }
        break;
      }
      case 'TableHandEnd': {
        const handId = message.payload.p[0]
        if (handId !== OW.SOCKET_CURRENT_HAND[webSocketId]) {
          throw ("Hand / Socket ID mismatch")
        }
        const hand = OW.HANDS_IN_PROGRESS[handId] || null
        if (hand !== null) {
          OW.COMPLETED_HANDS.push({ ...hand })
          delete OW.HANDS_IN_PROGRESS[handId]
          delete OW.SOCKET_CURRENT_HAND[webSocketId]
          console.log('HAND COMPLETE')
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
        await parseSocketData(JSON.parse(event.data), this.webSocketId)
      });

      this.addEventListener('open', event => {
        const date = new Date()
        const socketId = date.getTime()
        this.webSocketId = socketId.toString()
        console.log("A new game socket has been born with id " + socketId)
        OW.GAME_SOCKETS.push(socketId)
      });
    }

    send(...args) {
      let msg
      try {
        msg = JSON.parse(args[0])
        // console.log('------------------------------')
        // console.log('check webSocketId')
        // console.log(this.webSocketId)
        // console.log("check origin")
        // console.log(this.url)
        // console.log("check msg:")
        // console.log(JSON.stringify(msg))
        // console.log('------------------------------')
        if (this.url === 'wss://gs1.wssdata1.com:4703/ws/game' && msg?.['payload'].t === 100 && msg['payload']?.p[0]) {
          this.webSocketId = msg.payload.s
          console.log("updated websocket id to " + this.webSocketId)
          console.log(`correlating ${this.webSocketId} to ${msg['payload'].p[0]}`)
          OW.SOCKETS_TO_TABLES[this.webSocketId] = msg['payload'].p[0]
          OW.SOCKET_WINDOWS[this.webSocketId] = embeddedWindow
        }

      }
      catch (err) {

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
        if (tableId !== null && typeof tableId === 'number') {
          OW.GAME_LIST[tableId.toString()] = game.Values
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
  ws1 = WebSocket = class extends WebSocket {
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



