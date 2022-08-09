
const OW = window
window.prototype = null
OW.GAME_LIST = {}
OW.SOCKETS_TO_TABLES = {}
OW.SOCKET_WINDOWS = {}
OW.SOCKET_CURRENT_HAND = {}
OW.HAND_DATA = {}
OW.COMPLETED_HANDS = []
OW.GAME_SOCKETS = []
OW.TABLE_CONNECT_DATA = {}
OW.HANDLESS_SEATS = {}
const cardRegex = /(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)\s?(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)/


function output(inp) {
  document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

const ohhActionMap = {
  '11': 'Mucks Cards',
  '9': 'Shows Cards',
  '39': 'Post Ante',
  '18': 'Post SB',
  '19': 'Post BB',
  '4': 'Fold',
  '10': 'Check',
  '7': 'Bet',
  '6': 'Raise',
  '5': 'Call',
  "21": "AllIn"
}

const streetCodes = {
  '0': 'Flop',
  '1': 'Turn',
  '2': 'River',
  '3': 'HoleCards',
}

const dealerChatCodes = {
  '0': 'Flop',
  '1': 'Turn',
  '2': 'River',
  '3': 'HoleCards',
  '4': 'Fold',
  '5': 'Call',
  '6': 'Raise_',
  '7': 'Bet',
  '8': 'ReturnBet',
  '9': 'ShowCards',
  '10': 'Check',
  '11': 'Muck',
  '12': 'BuyIn',
  '13': 'SitOut',
  '14': 'SitIn',
  '15': 'WinPot',
  '16': 'Leave',
  '17': 'Join',
  '18': 'PostSB',
  '19': 'PostBB',
  '20': 'PostDB',
  '21': 'AllIn',
  '22': 'Chat',
  '23': 'AbortHand',
  '24': 'StartGame',
  '25': 'Pause',
  '26': 'Resume',
  '27': 'BreakStart',
  '28': 'BreakEnd',
  '29': 'NewBlindLevel',
  '30': 'WinRound',
  '31': 'WinTournament',
  '32': 'EliminateFromTournament',
  '33': 'StartDET',
  '34': 'StartExtraTime',
  '35': 'MoveBetToPot',
  '36': 'WinHiPot',
  '37': 'WinLoPot',
  '38': 'GetGC',
  '39': 'PostAnte',
  '40': 'ChatSuspended',
  '41': 'WaitButtonPass',
  '42': 'TablePlayerMoved',
  '43': 'HandForHandPause',
  '44': 'BuyInHand',
  '45': 'PauseTournament',
  '46': 'ResumeTournament',
  '47': 'WaitListPosition',
  '48': 'Addon',
  '49': 'Rebuy',
  '50': 'WaitForRebuy',
  '51': 'Bounty',
  '52': 'HandSaveProblem',
  '53': 'CancelTournament',
  '54': 'Table_ChatEnabled',
  '55': 'Table_ChatDisabled',
  '56': 'RebuyCompleted',
  '57': 'RebuyRefunded',
  '58': 'CloseTable',
  '59': 'DisconnectObserver',
  '60': 'HFHChatDisabled',
  '61': 'ThirdStreet',
  '62': 'FourthStreet',
  '63': 'FifthStreet',
  '64': 'Vela',
  '65': 'BringIn',
  '66': 'ClientGenerated',
  '67': 'None',
  '68': 'QueryRematch',
  '69': 'RematchAccepted',
  '70': 'RematchDeclined'
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

class Round {
  constructor(street,cards) {
    this.street = street
    this.cards = cards
    this.actions = []
  }

  addAction = (action) => {
    this.actions.push(action)
  }

  setId = (id) => {
    this.id = id
  }
}

class Action {
  constructor(player_id,player_name,action,amount=null,cards=[]) {

    if(action === 'AllIn') {
      this.is_allin = true
      this.action = 'Bet'
    }
    else {
      this.action = action
    }


    this.player_id = player_id,
    this.player_name = player_name,

    this.cards = cards
    if(amount !== 0 && amount !== null) {
      this.amount = parseFloat(amount)
    }

  }
}


class Player {
  constructor({ id, seat, name, stack, bounty, display }) {
    this.id = id
    this.seat = seat
    this.name = name
    if(display) {
      this.display = display
    }

    this.starting_stack = stack
    if(bounty) {
      this.player_bounty = bounty
    }

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
    this.street = 'PreFlop'
    const tableConnectData = OW.TABLE_CONNECT_DATA[socketId]
    this.pot = 0
    this.board = []
    this.seats = []
    this.playerCards = {}
    this.rake = 0
    this.seatsInitialized = false
    this.showdownOcurred = false

    this.database_model = {
      spec_version: '1.2.2',
      internal_version: '0.2.0',
      game_number: handId,
      network_name: site_name,
      site_name: site_name,
      tournament: this.tournament,
      table_handle: this.tournament ? tableConnectData[0] : tableInfo.TableName.Value,
      start_date_utc: new Date().toISOString(),
      table_name: this.tournament ? OW.SOCKETS_TO_TABLES[socketId] : tableInfo.TableID.Value,
      game_type: pokerapp.PokerGameType.enumGetName(tableInfo.GameTypeID.Value),
      bet_limit: {
        bet_type: this.tournament ? tableConnectData[5] : pokerapp.PokerLimitType.enumGetName(tableInfo.LimitType.Value)
      },
      table_size: tableInfo.MaxSeats.Value,
      currency: tableInfo.Currency.Value,
      dealer_seat: -1,
      players: [],
      total_pot: {
        number: 0,
        amount: 0,
        rake: 0,
        player_wins: []
      }
    }

    if (this.tournament) {
      let toId = tableInfo.TournamentID.Value
      let toName = tableInfo.Description.Value
      let toTaId = tableConnectData[0]

      const tourneyInfo = new TournamentInfo(toId, toName, toTaId)
      this.database_model.tournament_info = { ...tourneyInfo }
    }

    this.handState = 'in progress'
    this.gameEvents = {}

  }

  updatePlayerCards = async (player) => {
    const street = this.street
    const playerName = player.name
    let cards = []
    if(player.cards.match(cardRegex)) {
      cards = player.cards.trim().split(' ')
    }
    // console.log("updatePlayerCards:")

    // console.log(`name: ${playerName}, street: ${street}\n cards: ${JSON.stringify(cards,undefined,4)}`)


    if(this.playerCards[player.name]) {
      console.log(`fn: existing cards for ${player.name}:`)
      console.log(this.playerCards[player.name])


      if(this.playerCards[player.name].length == 0) {
        this.playerCards[player.name] = cards
        console.log(`fn: UPATED cards for ${player.name}:`)
        console.log(cards)
      }
      else {
        console.log("not overriding cards")
      }

    }


    // console.log('updated playerCards:')
    // console.log(JSON.stringify(this.playerCards,undefined,4))

  }

  updateStreet = async (newStreet) => {
    this.street = newStreet
  }

  updateFromTableState = async (args) => {

    let [commCards, dealerPos, tablePots, rakeAmount, currentAction] = args

    this.board = commCards.trim().split(' ')
    this.database_model['dealer_seat'] = parseInt(dealerPos)
    this.pot = tablePots //fix later
    this.rake = rakeAmount
    try {
      this.database_model['total_pot']['amount'] = parseFloat(tablePots)
    }
    catch(err) {
      console.log("tablePots is")
      console.log(tablePots)
      throw err
    }

    this.database_model['total_pot']['rake'] = rakeAmount

  }

  getPlayerSeatByName = async (playerName) => {
    const seats = this.database_model.players
    // const seats1 = this.database_model['players']
    // const seats2 = this.seats
    // console.log("WHAT IS THSI?")
    // console.log(this)
    // console.log("getPlyaerSeatByName, looking for " + playerName)
    // console.log("getPlayerSeatbyName, check seats, seats1, seats2")
    // console.log(JSON.stringify(seats,undefined,4))

    let selectedSeat = null
    seats.forEach((seat) => {
      // console.log("in seat loop")
      // console.log(seat)
      if(seat.name === playerName) {
        // console.log("found " + playerName)
        // console.log(seat)
        selectedSeat = seat
      }
      })

      return selectedSeat

  }

  updateFromDealerChat = async (dealerMessage) => {
    // console.log('dealer message:')
    // console.log(JSON.stringify(dealerMessage,undefined,4))


    if(Object.keys(streetCodes).includes(dealerMessage[0])) {
      //console.log("UPDATE STREET TO " + streetCodes[dealerMessage[0]])
      await this.updateStreet(streetCodes[dealerMessage[0]])
    }

    if(dealerMessage[0] === '15') {
      console.log("player win")
      const [dmc,seatNumber,playerName,win_amount] = dealerMessage
      const actionSeat = await this.getPlayerSeatByName(playerName)
      const player_win = {
        player_id: actionSeat.id,
        player_name: actionSeat.name,
        win_amount: parseFloat(win_amount),

      }
      this.database_model.total_pot.player_wins.push(player_win)
      console.log(this.database_model['total_pot'])
    }



    if(dealerMessage[0] === 36) {
      console.log('win hi pot')
    }


    dealerMessage.forEach(val => {
      if(val.match(cardRegex))  {
        console.log('GOT CARDS IN DEALER MESSAGE')
        console.log(dealerMessage)
      }

    })



      if(!this.gameEvents.hasOwnProperty(this.street)) {
        this.gameEvents[this.street] = new Round(this.street,this.board)
      }


      const[dealerMessageCode,seatNumber,playerName] = dealerMessage

      if(ohhActionMap.hasOwnProperty(dealerMessage[0])) {
        let amount
        const playerAction = ohhActionMap[dealerMessageCode.toString()]

        if(playerAction === 'Shows Cards') {
          if(!this.gameEvents.hasOwnProperty('End') ) {
            this.gameEvents['End'] = new Round(this.street, this.board)
          }

          const [dmc,playerName,rawCards] = dealerMessage
          //this.playerCards[playerName] = rawCards.trim().split(' ')
          await this.setPlayerCards(playerName, rawCards.trim().split(' '))

          const actionSeat = await this.getPlayerSeatByName(playerName)
          console.log("check action seat:")
          console.log(actionSeat)
          const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, rawCards.trim().split(' '))
          this.gameEvents['End'].addAction(action)

        }

        if(playerAction === 'Mucks Cards') {
          if(!this.gameEvents.hasOwnProperty('End') ) {
            this.gameEvents['End'] = new Round(this.street, this.board)
          }
          const [dmc,seat,playerName] = dealerMessage
          const actionSeat = await this.getPlayerSeatByName(playerName)
          const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, this.playerCards[playerName])
          this.gameEvents['End'].addAction(action)

        }

        if(['39','18','19','7','6','5','21','4','10','4','10'].includes(dealerMessageCode.toString())) {


          if(![,'4','10'].includes(dealerMessageCode.toString())) {
            amount = dealerMessage[3]
          }
          else {
            amount = null
          }



          const playerAction = ohhActionMap[dealerMessageCode.toString()]


          const actionSeat = await this.getPlayerSeatByName(playerName)
          // console.log("check actionSeat")
          // console.log(actionSeat)

          if (actionSeat) {
            let cards = []
            cards = this.playerCards?.[playerName] || null
            if(cards === null) {
              console.log('could not get cards for ' + playerName)
              // console.log(this.playerCards)
              cards = []
            }
            else {
              console.log("got cards for " + playerName + ": " + cards)
            }
            const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, cards)
            // console.log('check action')
            // console.log(action)
            this.gameEvents[this.street].addAction(action)
            // console.log('check gameEvents now1')
            // console.log(this.gameEvents[this.street])
            // console.log(this.gameEvents[this.street].actions)
          }

          else {
            console.log("couldn't find action seeat")
            const action = new Action(-1,playerName,playerAction,amount)
            this.gameEvents[this.street].addAction(action)
            // console.log('check gameEvents now2')
            // console.log(this.gameEvents[this.street])
            // console.log(this.gameEvents[this.street].actions)
          }

          if(playerAction === 'Post SB') {
            this.database_model.small_blind_amont = amount
          }

          if(playerAction === 'Post BB') {
            this.database_model.big_blind_amount = amount
          }

          if(playerAction === 'Post Ante') {
            this.database_model.ante_amount = amount
          }



        }



      }


  }

  initSeats = async (arrayOfSeats) => {
    // console.log("initializing seats")
    // console.log(arrayOfSeats.length)
    if (!this.seatsInitialized) {
      arrayOfSeats
      .filter(seatData => !['Unavailable','Empty'].includes(seatData['seat_state']))
      .forEach(async (seatData) => {
        await this.updatePlayerCards(seatData)

          const player = new Player({
            id: parseInt(seatData['id']),
            seat: parseInt(seatData['seat']),
            name: seatData['name'],
            stack: parseFloat(seatData['stack']),
            bounty: seatData['bounty']
          })

        if (seatData['id']) {
          this.database_model.players.push(player)
        }
        this.seats.push(player)
      })

      this.seatsInitialized = true
    }
  }


  setHandState = (val) => {
    this.handState = val
  }

  setPlayerCards = async (playerName, cards) => {
    if(this.playerCards[playerName]) {
      if(this.playerCards[playerName].length == 0) {
        this.playerCards[playerName] = cards
      }
    }

  }

  addDealtActions = async () => {
    Object.keys(this.playerCards).forEach(async (playerName) => {
      const playerCards = this.playerCards[playerName]
      console.log('player cards loop finalize hand')
      console.log(`name: ${playerName} cards: ${playerCards}`)
      if(playerCards.length > 0) {
        const playerSeat = await this.getPlayerSeatByName(playerName)
        const dealtAction = new Action(playerSeat.id, playerSeat.name, 'Dealt Cards',null, playerCards)
        console.log("dealt action: ")
        console.log(dealtAction)
        this.gameEvents['PreFlop'].addAction(dealtAction)

      }
    })


  }

  finalizeHand = async () => {
    console.log('FINALIZE HAND')
    const finalizedRounds = []



    const orderedRounds = [this.gameEvents['PreFlop'], this.gameEvents['HoleCards']]

    if(this.gameEvents?.['Flop']) orderedRounds.push(this.gameEvents['Flop'])
    if(this.gameEvents?.['Turn']) orderedRounds.push(this.gameEvents['Turn'])
    if(this.gameEvents?.['River']) orderedRounds.push(this.gameEvents['River'])

    let roundId = 0
    let actionId = 0

    orderedRounds.forEach(async (round) => {
      let roundStreet = round.street
      if(roundStreet === 'HoleCards') roundStreet = 'PreFlop'
      let finalizedRound = {id: roundId, street: roundStreet, cards: round.cards}
      let finalizedActions = []
      round.actions.forEach(async (action) => {
        let player_id = action.player_id
        if(player_id === -1 || !player_id) {
          const playerSeat = await this.getPlayerSeatByName(action.player_name)
          console.log("check player seat:")
          console.log(playerSeat)
          player_id = playerSeat.id
        }
        const finalizedAction = {
          action_number:actionId,
          player_id: player_id,
          player_name: action.player_name,
          action: action.action,
          amount: action?.amount,
          cards: action?.cards,
          is_allin: action?.is_allin
        }
        finalizedActions.push(finalizedAction)
        actionId++

      })
      finalizedRound['actions'] = finalizedActions
      finalizedRounds.push(finalizedRound)
      roundId++
    })

    let finalRound

    if(this.showdownOcurred) {
      finalizedRounds.push({id: roundId, street: 'Showdown', actions: []})
    }

    const finalActions = this.gameEvents['End'].actions
    finalActions.forEach((action) => {
      const actionToPush = {...action,action_number: actionId}
      finalizedRounds[finalizedRounds.length-1].actions.push(actionToPush)
      actionId++
    })




    this.database_model['rounds'] = finalizedRounds
    console.log("-----------------------------------------------------")
    console.log(this.database_model)
    console.log("-----------------------------------------------------")


  }

}



const parseSocketData = async (message, webSocketId) => {
  // console.log("-----------INCOMING GAME DATA------------")
  // console.log("-----------------------------------------")
  //console.log(JSON.stringify(message, undefined, 4))
  const correlated_table_id = OW.SOCKETS_TO_TABLES[webSocketId]
  const tableInfo = OW.GAME_LIST[correlated_table_id]
  //console.log(OW.GAME_SOCKETS)
  // console.log("sockets to hands:")
  // console.log(OW.SOCKET_CURRENT_HAND)
    // console.log('hand data:')
    // console.log(OW.HAND_DATA)



  // console.log("-----------------------------------------")
  // console.log("HANDLESS SEATS:")
  // console.log(OW.HANDLESS_SEATS[webSocketId]?.length || 0)

  if(message?.payload?.p) {
    const dataMessage = message?.payload?.p
    if(typeof dataMessage === 'object') {
      dataMessage.forEach(msgPart => {
        if(typeof msgPart === 'string') {
          if(msgPart.match(cardRegex)) {
            //console.log("found cards in this message:")
            //console.log(message?.payload?.t)
          }
        }
      })
    }

  }

  if (message?.payload?.t) {
    switch (message.payload.t) {

      case 'TableConnected': {
        const handId = message.payload.p[9]
        OW.SOCKET_CURRENT_HAND[webSocketId] = handId
        OW.TABLE_CONNECT_DATA[webSocketId] = message.payload.p

        break;
      }

      case 'TableStartShowDown': {
        //console.log('TABLE PLAYER SHOW CARDS')
        //console.log(JSON.stringify(message,undefined,4))
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          const seatsInvolved = message?.payload?.p[1].split(',')
          if(seatsInvolved.length > 1) {
            hand.showdownOcurred = true
            console.log('SET SHOWDOWN = TRUE')
          }
          OW.HAND_DATA[handId] = hand
        }

        break;
      }

      case 'TableState': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          await hand.updateFromTableState(message.payload.p)
          OW.HAND_DATA[handId] = hand
        }

        break;
      }

      case 'TableHandMuckedCards': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          //await hand.updateFromTableState(message.payload.p)
          const playerAndCards = message?.payload?.p[0]
          console.log('table muck cards')
          console.log(JSON.stringify(message,undefined,4))
          console.log(playerAndCards)
          const [playerName,rawCards] = playerAndCards.split(' ')
          const card1 = rawCards.substring(0,2)
          const card2 = rawCards.substring(2)
          const playerCards = [card1,card2]
          hand.playerCards[playerName] = playerCards
          console.log("updating player cards: ")
          console.log(`player name: ${playerName} cards: ${playerCards}`)
          await hand.setPlayerCards(playerName,playerCards)

          OW.HAND_DATA[handId] = hand
        }

        break;
      }

      case 'TableDealerChat': {

        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          await hand.updateFromDealerChat(message.payload.p)
          OW.HAND_DATA[handId] = hand
        }

        break;
      }

      case 'TableSeatState': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        // console.log("raw seat data")
        const convertedSeatData = message.payload.p.map(seatArray => seatArray.split('|'))
        const seatUpdateData = convertedSeatData.map((seatArray) => {
          const seatDict = {}
          seatArray.forEach((sa, idx) => {
            seatDict[seatDataMap[idx]] = sa
          })

          return seatDict

        })


        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {

          const numSeats = seatUpdateData.length
          // console.log("seat update data.length")
          // console.log(seatUpdateData.length)

          if (!hand.seatsInitialized && (numSeats === 10 || numSeats >= 2)) {
            await hand.initSeats(seatUpdateData)
          }
          // console.log("TABLE SEAT STATE, CHECK STREET:")
          // console.log(hand.street)
          // console.log("loop through tableseatdata:")
          seatUpdateData.filter(seat => seat.seat_state !== 'Unavailable')
          .forEach(async (seat) => {
            // console.log("loop at street " + hand.street)
            // console.log(JSON.stringify(seat,undefined,4))
            await hand.updatePlayerCards(seat)
          })

          OW.HAND_DATA[handId] = hand
        }
        else {
          // console.log("set handless seats")
          // console.log(seatUpdateData)
          OW.HANDLESS_SEATS[webSocketId] = seatUpdateData
        }

        break;
      }

      case 'TableHandStart': {
        const handId = message.payload.p[0]
        OW.SOCKET_CURRENT_HAND[webSocketId] = handId
        const hand = new PokerHand('everygame.eu', handId, webSocketId, tableInfo)
        if (OW.HANDLESS_SEATS[webSocketId]) {
          const seats = OW.HANDLESS_SEATS[webSocketId]
          const tableSize = hand.database_model['table_size']
          if (seats.length === tableSize && !hand.seatsInitialized) {
            await hand.initSeats(seats)
            delete OW.HANDLESS_SEATS[webSocketId]
          }

        }


        OW.HAND_DATA[handId] = hand
        break;
      }
      case 'TableHandEnd': {
        const handId = message.payload.p[0]
        if (handId !== OW.SOCKET_CURRENT_HAND[webSocketId]) {
          throw ("Hand / Socket ID mismatch")
        }
        const hand = OW.HAND_DATA[handId] || null
        if (hand !== null) {
          hand.setHandState('complete')
          await hand.addDealtActions()
          await hand.finalizeHand()
          OW.HAND_DATA[handId] = hand
          delete OW.SOCKET_CURRENT_HAND[webSocketId]

          console.log('HAND COMPLETE')
          // console.log("HAND database model:")
          // console.log(hand.database_model)

          // console.log("HAND rounds:")
          // console.log(JSON.stringify(hand.gameEvents, undefined, 4))

        }


        break;
      }
      default: {
        //console.log("didn't parse anything for " + message.payload.t)
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
        //console.log("A new game socket has been born with id " + socketId)
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
  // console.log('primary highjack')
  let ws1 = window.WebSocket
  // console.log(ws1)
  ws1.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws1 = WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);


      this.addEventListener('message', async (event) => {
        // console.log("Message from main socket")
        await parseMainSocketData(JSON.parse(event.data))
      });

      this.addEventListener('open', event => {
        // console.log("Main socket opened")
        // console.log(event)
      });
    }

    send(...args) {
      super.send(...args);
    }
  }

}


highjackPrimaryWebsocket()
highjackIFrameWebsocket()



