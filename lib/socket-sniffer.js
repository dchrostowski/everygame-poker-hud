
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
OW.LAST_TABLE_STATE = {}
const cardRegex = /(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)\s?(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)/
const POST_URL = 'https://api.cornblaster.com/pokerdata/hand-history'


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

const SEAT_ORDER = {
  2: ['BTN', 'SB'],
  3: ['BTN', 'SB', 'BB'],
  4: ['BTN', 'SB', 'BB', 'UTG'],
  5: ['BTN', 'SB', 'BB', 'UTG', 'CO'],
  6: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'],
  7: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'CO'],
  8: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'MP', 'CO'],
  9: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'MP', 'MP', 'CO'],
}

const strategyMatrix = {
  'unopened': {
    'UTG': {
      'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","AQo","KQo","QQ","QJs","QTs","Q9s","AJo","KJo","QJo","JJ","JTs","ATo","TT","T9s","99","88","77"],
      'Call': [],
      'Fold': ["K4s","K3s","K2s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","KTo","QTo","JTo","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22"]
    },
    'MP': {
      'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","AQo","KQo","QQ","QJs","QTs","Q9s","Q8s","AJo","KJo","QJo","JJ","JTs","J9s","ATo","KTo","QTo","TT","T9s","A9o","99","88","77","66"],
      'Call': [],
      'Fold': ["K4s","K3s","K2s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","JTo","T8s","T7s","T6s","T5s","T4s","T3s","T2s","K9o","Q9o","J9o","T9o","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22"],
    },
    'CO': {
      'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","AQo","KQo","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","AJo","KJo","QJo","JJ","JTs","J9s","J8s","J7s","ATo","KTo","QTo","JTo","TT","T9s","T8s","A9o","K9o","99","98s","A8o","88","77","66","55","44","33","22"],
      'Call': [],
      'Fold': ["K2s","Q4s","Q3s","Q2s","J6s","J5s","J4s","J3s","J2s","T7s","T6s","T5s","T4s","T3s","T2s","Q9o","J9o","T9o","97s","96s","95s","94s","93s","92s","K8o","Q8o","J8o","T8o","98o","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
    },
    'BTN': {
      'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","AQo","KQo","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JJ","JTs","J9s","J8s","J7s","J6s","J5s","J4s","ATo","KTo","QTo","JTo","TT","T9s","T8s","T7s","T6s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","A8o","K8o","88","87s","86s","A7o","77","76s","75s","A6o","66","65s","A5o","55","54s","A4o","44","A3o","33","22"],
      'Call': [],
      'Fold': ["J3s","J2s","T5s","T4s","T3s","T2s","95s","94s","93s","92s","Q8o","J8o","T8o","98o","85s","84s","83s","82s","K7o","Q7o","J7o","T7o","97o","87o","74s","73s","72s","K6o","Q6o","J6o","T6o","96o","86o","76o","64s","63s","62s","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","53s","52s","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","43s","42s","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
    },
    'SB': {
      'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","AQo","KQo","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JJ","JTs","J9s","J8s","J7s","J6s","J5s","J4s","ATo","KTo","QTo","JTo","TT","T9s","T8s","T7s","T6s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","A8o","K8o","88","87s","86s","A7o","77","76s","75s","A6o","66","65s","A5o","55","54s","A4o","44","A3o","33","22"],
      'Call': [],
      "Fold": ["J3s","J2s","T5s","T4s","T3s","T2s","95s","94s","93s","92s","Q8o","J8o","T8o","98o","85s","84s","83s","82s","K7o","Q7o","J7o","T7o","97o","87o","74s","73s","72s","K6o","Q6o","J6o","T6o","96o","86o","76o","64s","63s","62s","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","53s","52s","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","43s","42s","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
    },
  },

  'Raise': {
    'MP': {
      'UTG': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","JJ"],
        'Call': [],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","TT","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      }
    },
    'CO': {
      'UTG': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","JJ","TT"],
        'Call': [],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'MP': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","AJo","JJ","TT"],
        'Call': [],
        'Fold': ["A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
    },
    'BTN': {
      'UTG': {
        'Raise': ['AA','AKs','AQs','AJs','ATs','A9s','A5s','A4s','AKo','KK','KQs','KJs','KTs','AQo','KQo','QQ','QJs','JJ','TT'],
        'Call': ['99','98S','88','87s','77','76s','66','65s','55','54s','44'],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'MP': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","AJo","JJ","TT"],
        'Call': ["99","98s","88","87s","77","76s","66","55"],
        'Fold': ["A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'CO': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","AKo","KK","KQs","KJs","KTs","K9s","AQo","KQo","QQ","QJs","QTs","AJo","KJo","QJo","JJ","JTs","ATo","TT"],
        'Call': ["99","98s","88","87s","77","76s"],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      }
    },
    'SB': {
      'UTG': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","QQ","QJs","JJ","TT"],
        'Call': [],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","KQo","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"]
      },
      'MP': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","AJo","JJ","TT"],
        'Call': [],
        'Fold': ["A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'CO': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A9s","A5s","A4s","A3s","AKo","KK","KQs","KJs","KTs","AQo","KQo","QQ","QJs","QTs","AJo","KJo","JJ","JTs","TT","99"],
        'Call': [],
        'Fold': ["A8s","A7s","A6s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","QJo","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'BTN': {
        'Raise':["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","AKo","KK","KQs","KJs","KTs","K9s","AQo","KQo","QQ","QJs","QTs","Q9s","AJo","KJo","JJ","JTs","ATo","TT","T9s","99","88","77"],
        'Call': [],
        'Fold': ["A2s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","QJo","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","KTo","QTo","JTo","T8s","T7s","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","98s","97s","96s","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","87s","86s","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","76s","75s","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      }
    },
    'BB': {
      'UTG': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A5s","A4s","AKo","KK","KQs","KJs","KQo","QQ"],
        'Call': ["A9s","A8s","A7s","A6s","A3s","A2s","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","AQo","QJs","QTs","Q9s","Q8s","Q7s","AJo","JJ","JTs","J9s","J8s","ATo","TT","T9s","T8s","T7s","99","98s","97s","96s","88","87s","86s","77","76s","75s","66","65s","64s","55","54s","53s","44","43s","33","22"],
        'Fold': ["K2s","Q6s","Q5s","Q4s","Q3s","Q2s","KJo","QJo","J7s","J6s","J5s","J4s","J3s","J2s","KTo","QTo","JTo","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'MP': {
        'Raise': ["AA","AKs","AQs","A6s","A5s","A4s","A3s","A2s","AKo","KK","K6s","K5s","K4s","K3s","K2s","KQo","QQ","JJ"],
        'Call': ["AJs","ATs","A9s","A8s","A7s","KQs","KJs","KTs","K9s","K8s","K7s","AQo","QJs","QTs","Q9s","Q8s","Q7s","Q6s","AJo","KJo","QJo","JTs","J9s","J8s","ATo","TT","T9s","T8s","T7s","99","98s","97s","96s","88","87s","86s","85s","77","76s","75s","66","65s","64s","55","54s","53s","44","43s","33","22"],
        'Fold': ["Q5s","Q4s","Q3s","Q2s","J7s","J6s","J5s","J4s","J3s","J2s","KTo","QTo","JTo","T6s","T5s","T4s","T3s","T2s","A9o","K9o","Q9o","J9o","T9o","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'CO': {
        'Raise': ["AA","AKs","AQs","A6s","A5s","A4s","A3s","A2s","AKo","KK","K6s","K5s","K4s","K3s","K2s","AQo","KQo","QQ","AJo","JJ"],
        'Call': ["AJs","ATs","A9s","A8s","A7s","KQs","KJs","KTs","K9s","K8s","K7s","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","KJo","QJo","JTs","J9s","J8s","J7s","J6s","ATo","KTo","QTo","JTo","TT","T9s","T8s","T7s","A9o","99","98s","97s","96s","88","87s","86s","77","76s","75s","66","65s","64s","55","54s","53s","44","43s","33","22"],
        'Fold': ["Q4s","Q3s","Q2s","J5s","J4s","J3s","J2s","T6s","T5s","T4s","T3s","T2s","K9o","Q9o","J9o","T9o","95s","94s","93s","92s","A8o","K8o","Q8o","J8o","T8o","98o","85s","84s","83s","82s","A7o","K7o","Q7o","J7o","T7o","97o","87o","74s","73s","72s","A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","63s","62s","A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"]
      },
      'BTN': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A5s","A4s","AKo","KK","KQs","KJs","KTs","K9s","AQo","KQo","QQ","QJs","QTs","Q9s","AJo","KJo","JJ","JTs","J9s","J8s","ATo","TT","T9s","T8s","99","98s"],
        'Call': ["A9s","A8s","A7s","A6s","A3s","A2s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","QJo","J7s","J6s","J5s","J4s","KTo","QTo","JTo","T7s","T6s","A9o","K9o","J9o","T9o","97s","96s","A8o","88","87s","86s","85s","A7o","77","76s","75s","74s","A6o","66","65s","64s","A5o","55","54s","53s","44","43s","33","22"],
        'Fold': ["J3s","J2s","T5s","T4s","T3s","T2s","Q9o","95s","94s","93s","92s","K8o","Q8o","J8o","T8o","98o","84s","83s","82s","K7o","Q7o","J7o","T7o","97o","87o","73s","72s","K6o","Q6o","J6o","T6o","96o","86o","76o","63s","62s","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","52s","A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","42s","A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","32s","A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"],
      },
      'SB': {
        'Raise': ["AA","AKs","AQs","AJs","ATs","A5s","A4s","AKo","KK","KQs","KJs","KTs","AQo","QQ","QJs","JJ","TT","T5s","T4s","T3s","T2s","Q8o","A7o","K7o","A6o","K6o","A5o","K5o","A4o","A3o","A2o"],
        'Call': ["A9s","A8s","A7s","A6s","A3s","A2s","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","KQo","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","AJo","KJo","QJo","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","ATo","KTo","QTo","JTo","T9s","T8s","T7s","T6s","A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","A8o","K8o","T8o","88","87s","86s","85s","84s","77","76s","75s","74s","66","65s","64s","63s","55","54s","53s","52s","44","43s","42s","33","32s","22"],
        'Fold': ["94s","93s","92s","J8o","98o","83s","82s","Q7o","J7o","T7o","97o","87o","73s","72s","Q6o","J6o","T6o","96o","86o","76o","62s","Q5o","J5o","T5o","95o","85o","75o","65o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","Unopened pot","Facing a raise","Facing a 3-bet","Facing a 4-bet","Facing all-in 5-bet"]
      }
    },
  },
  '3-BET': {
    'UTG': {
      'MP': {
        'Raise': [],
        'Call': []
      },
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'MP': {
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'CO': {
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },

    },
    'BTN': {
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },

    'SB': {
      'BB': {
        'Raise': [],
        'Call': []
      },
    }
  },

  '4-BET': {
    'UTG': {
      'MP': {
        'Raise': [],
        'Call': []
      },
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'MP': {
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'CO': {
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },

    },
    'BTN': {
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },

    'SB': {
      'BB': {
        'Raise': [],
        'Call': []
      },
    }
  },

  '5-BET_ALL_IN': {
    'UTG': {
      'MP': {
        'Raise': [],
        'Call': []
      },
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'MP': {
      'CO': {
        'Raise': [],
        'Call': []
      },
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },
    'CO': {
      'BTN': {
        'Raise': [],
        'Call': []
      },
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },

    },
    'BTN': {
      'SB': {
        'Raise': [],
        'Call': []
      },
      'BB': {
        'Raise': [],
        'Call': []
      },
    },

    'SB': {
      'BB': {
        'Raise': [],
        'Call': []
      },
    }
  },
}



class Round {
  constructor(street, cards) {
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
  constructor(player_id, player_name, action, amount = null, cards = []) {

    if (action === 'AllIn') {
      this.is_allin = true
      this.action = 'Bet'
    }
    else {
      this.action = action
    }


    this.player_id = player_id,
      this.player_name = player_name,

      this.cards = cards
    if (amount !== 0 && amount !== null) {
      this.amount = parseFloat(amount)
    }

  }
}


class Player {
  constructor({ id, seat, name, stack, bounty, display }) {
    this.id = id
    this.seat = seat
    this.name = name
    if (display) {
      this.display = display
    }

    this.starting_stack = stack
    if (bounty) {
      this.player_bounty = parseFloat(bounty)
    }

  }
}


class TournamentInfo {
  constructor(tournNum, tournName, tabId) {
    this.tournament_number = tournNum.toString()
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
    this.positions = {}
    this.seats_linked_list = {}
    this.playerCards = {}
    this.rake = 0
    this.seatsInitialized = false
    this.showdownOcurred = false
    this.betCount = 0


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
      small_blind_amount: 0,
      big_blind_amount: 0,
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
    if (player.cards.match(cardRegex)) {
      cards = player.cards.trim().split(' ')
    }
    // console.log("updatePlayerCards:")

    // console.log(`name: ${playerName}, street: ${street}\n cards: ${JSON.stringify(cards,undefined,4)}`)


    if (this.playerCards[player.name]) {
      //console.log(`fn: existing cards for ${player.name}:`)
      //console.log(this.playerCards[player.name])


      if (this.playerCards[player.name].length == 0) {
        this.playerCards[player.name] = cards
        // console.log(`fn: UPATED cards for ${player.name}:`)
        // console.log(cards)
      }
      else {
        //console.log("not overriding cards")
      }

    }
    else {
      this.playerCards[player.name] = cards

    }


    // console.log('updated playerCards:')
    // console.log(JSON.stringify(this.playerCards,undefined,4))

  }

  sendHandData = async (url) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    //xhr.onload = () => console.log(xhr.responseText);

    const data = JSON.stringify(this.database_model)

    xhr.send(data);

  }

  updateStreet = async (newStreet) => {
    this.street = newStreet
  }

  assignPositionsToSeats = async (seats, dealerPos) => {
    if (!seats || seats.length < 2) return
    const seatOrder = SEAT_ORDER?.[seats.length] || null

    if (seatOrder === null) return
    if (Object.keys(this.positions).length > 0) return

    let dealerIdx

    seats.forEach((seat, idx) => {
      if (seat.seat === dealerPos) dealerIdx = idx
    })

    const dealerSeat = seats[dealerIdx]
    if (dealerSeat.name === 'cornbl4ster') {
      console.log(`You are BTN`)
    }

    this.positions[dealerSeat.name] = 'BTN'


    for (let i = 1; i < seatOrder.length; i++) {
      const positionName = seatOrder[i]
      const curSeatIdx = (dealerIdx + i) % seats.length
      const curSeat = seats[curSeatIdx]
      if (curSeat.name === 'cornbl4ster') {
        console.log(`You are ${positionName}`)
      }

      this.positions[curSeat.name] = positionName

    }

  }

  updateFromTableState = async (args) => {

    let [commCards, dealerPos, tablePots, rakeAmount, currentAction] = args
    let parsedCards = []


    if (commCards) {
      parsedCards = commCards.trim().split(' ')
      this.board = parsedCards
    }

    this.database_model['dealer_seat'] = parseInt(dealerPos)
    await this.assignPositionsToSeats(this.seats, parseInt(dealerPos))


    this.pot = tablePots //fix later
    this.rake = parseFloat(rakeAmount)
    try {
      this.database_model['total_pot']['amount'] = parseFloat(tablePots)
    }
    catch (err) {
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
      if (seat.name === playerName) {
        // console.log("found " + playerName)
        // console.log(seat)
        selectedSeat = seat
      }
    })

    return selectedSeat

  }

  logAction = async (action) => {
    if (Object.keys(this.positions).length === 0) {
      await this.updateFromTableState(OW.LAST_TABLE_STATE)
    }
    const playerName = action.player_name
    const playerPosition = this.positions?.[playerName] || '???'
    let actionString = action.action
    const actionAmount = action?.amount || ''

    const betCountMap = {
      0: actionString,
      1: 'Raise',
      2: '3-Bet',
      3: '4-Bet',
    }

    if (actionString === 'Bet' || actionString === 'Raise') {
      this.betCount += 1
    }

    if ((this.street === 'PreFlop' || this.street === 'HoleCards') && (actionString === 'Bet' || actionString === 'Raise')) {
      if (this.betCount < 4) {
        actionString = betCountMap[parseInt(this.betCount)]
      }
      else {
        actionString = '5-bet+'
      }

      if (action?.is_allin) {
        actionString = actionString + ' - AllIn'
      }

    }
    if ((this.street === 'PreFlop' || this.street === 'HoleCards') && (action.action === 'Bet' || action.action === 'Raise')) {
      if (action.player_name !== 'cornbl4ster')
        console.log(`facing a ${actionString} from ${playerPosition}`)
      //console.log(`${playerName} (${playerPosition}): ${actionString} ${actionAmount}`)
    }

  }

  updateFromDealerChat = async (dealerMessage) => {
    // console.log('dealer message:')
    // console.log(JSON.stringify(dealerMessage,undefined,4))


    if (Object.keys(streetCodes).includes(dealerMessage[0])) {
      //console.log("UPDATE STREET TO " + streetCodes[dealerMessage[0]])
      await this.updateStreet(streetCodes[dealerMessage[0]])
    }

    if (dealerMessage[0] === '15') {
      //console.log("player win")
      const [dmc, seatNumber, playerName, win_amount] = dealerMessage
      const actionSeat = await this.getPlayerSeatByName(playerName)
      const player_win = {
        player_id: actionSeat.id,
        player_name: actionSeat.name,
        win_amount: parseFloat(win_amount),

      }
      this.database_model.total_pot.player_wins.push(player_win)
      //console.log(this.database_model['total_pot'])
    }



    if (dealerMessage[0] === 36) {
      console.log('win hi pot')
    }



    if (!this.gameEvents.hasOwnProperty(this.street)) {
      this.gameEvents[this.street] = new Round(this.street, this.board)
    }


    const [dealerMessageCode, seatNumber, playerName] = dealerMessage
    const playerPosition = this.positions?.[playerName] || '???'

    if (ohhActionMap.hasOwnProperty(dealerMessage[0])) {
      let amount
      const playerAction = ohhActionMap[dealerMessageCode.toString()]


      if (playerAction === 'Shows Cards') {
        if (!this.gameEvents.hasOwnProperty('End')) {
          this.gameEvents['End'] = new Round(this.street, this.board)
        }

        const [dmc, playerName, rawCards] = dealerMessage

        await this.setPlayerCards(playerName, rawCards.trim().split(' '))

        const actionSeat = await this.getPlayerSeatByName(playerName)

        // console.log("check action seat:")
        // console.log(actionSeat)

        const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, rawCards.trim().split(' '))
        this.logAction(action)
        this.gameEvents['End'].addAction(action)

      }

      if (playerAction === 'Mucks Cards') {
        if (!this.gameEvents.hasOwnProperty('End')) {
          this.gameEvents['End'] = new Round(this.street, this.board)
        }
        const [dmc, seat, playerName] = dealerMessage
        const actionSeat = await this.getPlayerSeatByName(playerName)
        const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, this.playerCards[playerName], playerPosition)
        this.logAction(action)
        this.gameEvents['End'].addAction(action)

      }

      if (['39', '18', '19', '7', '6', '5', '21', '4', '10', '4', '10'].includes(dealerMessageCode.toString())) {


        if (![, '4', '10'].includes(dealerMessageCode.toString())) {
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
          if (cards === null) {
            // console.log('could not get cards for ' + playerName)
            // console.log(this.playerCards)
            cards = []
          }
          else {
            // console.log("got cards for " + playerName + ": " + cards)
          }
          const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, cards, playerPosition)
          this.logAction(action)
          // console.log('check action')
          // console.log(action)
          this.gameEvents[this.street].addAction(action)
          // console.log('check gameEvents now1')
          // console.log(this.gameEvents[this.street])
          // console.log(this.gameEvents[this.street].actions)
        }

        else {
          // console.log("couldn't find action seeat")
          const action = new Action(-1, playerName, playerAction, amount)
          this.logAction(action)
          this.gameEvents[this.street].addAction(action)
          // console.log('check gameEvents now2')
          // console.log(this.gameEvents[this.street])
          // console.log(this.gameEvents[this.street].actions)
        }

        if (playerAction === 'Post SB') {
          this.database_model.small_blind_amount = parseFloat(amount)
        }

        if (playerAction === 'Post BB') {
          this.database_model.big_blind_amount = parseFloat(amount)
        }

        if (playerAction === 'Post Ante') {
          this.database_model.ante_amount = parseFloat(amount)
        }



      }



    }


  }

  initSeats = async (arrayOfSeats) => {
    // console.log("initializing seats")
    // console.log(arrayOfSeats.length)
    if (!this.seatsInitialized) {
      arrayOfSeats
        .filter(seatData => !['Unavailable', 'Empty'].includes(seatData['seat_state']))
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
    if (this.playerCards[playerName]) {
      if (this.playerCards[playerName].length == 0) {
        this.playerCards[playerName] = cards
      }
    }

  }

  addDealtActions = async () => {
    Object.keys(this.playerCards).forEach(async (playerName) => {
      const playerCards = this.playerCards[playerName]
      // console.log('player cards loop finalize hand')
      // console.log(`name: ${playerName} cards: ${playerCards}`)
      if (playerCards.length > 0) {
        const playerSeat = await this.getPlayerSeatByName(playerName)
        const playerPosition = this.positions[playerName]
        const dealtAction = new Action(playerSeat.id, playerSeat.name, 'Dealt Cards', null, playerCards)
        this.logAction(dealtAction)
        // console.log("dealt action: ")
        // console.log(dealtAction)
        this.gameEvents['PreFlop'].addAction(dealtAction)

      }
    })


  }

  finalizeHand = async () => {
    // console.log('FINALIZE HAND')
    const finalizedRounds = []



    const orderedRounds = [this.gameEvents['PreFlop']]
    orderedRounds.push(this.gameEvents['HoleCards'])

    if (this.gameEvents?.['Flop']) orderedRounds.push(this.gameEvents['Flop'])
    if (this.gameEvents?.['Turn']) orderedRounds.push(this.gameEvents['Turn'])
    if (this.gameEvents?.['River']) orderedRounds.push(this.gameEvents['River'])

    let roundId = 0
    let actionId = 0

    orderedRounds.forEach(async (round) => {
      let roundStreet = round.street
      if (roundStreet === 'HoleCards') roundStreet = 'PreFlop'
      let finalizedRound = { id: roundId, street: roundStreet, cards: round.cards }
      let finalizedActions = []
      round.actions.forEach(async (action) => {
        let player_id = action.player_id
        if (player_id === -1 || !player_id) {
          const playerSeat = await this.getPlayerSeatByName(action.player_name)
          // console.log("check player seat:")
          // console.log(playerSeat)
          player_id = playerSeat.id
        }
        const finalizedAction = {
          action_number: actionId,
          player_id: player_id,
          player_name: action.player_name,
          action: action.action,
          amount: action?.amount,
          cards: this.playerCards[action.player_name],
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

    if (this.showdownOcurred) {
      finalizedRounds.push({ id: roundId, street: 'Showdown', actions: [] })
    }

    const finalActions = this.gameEvents['End'].actions
    finalActions.forEach((action) => {
      const actionToPush = { ...action, action_number: actionId }
      finalizedRounds[finalizedRounds.length - 1].actions.push(actionToPush)
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

  if (message?.payload?.p) {
    const dataMessage = message?.payload?.p
    if (typeof dataMessage === 'object') {
      dataMessage.forEach(msgPart => {
        if (typeof msgPart === 'string') {
          if (msgPart.match(cardRegex)) {
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
          if (seatsInvolved.length > 1) {
            hand.showdownOcurred = true
            //console.log('SET SHOWDOWN = TRUE')
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
        OW.LAST_TABLE_STATE = message.payload.p

        break;
      }

      case 'TableHandMuckedCards': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          //await hand.updateFromTableState(message.payload.p)
          const playerAndCards = message?.payload?.p[0]
          // console.log(JSON.stringify(message,undefined,4))
          // console.log(playerAndCards)
          const [playerName, rawCards] = playerAndCards.split(' ')
          const card1 = rawCards.substring(0, 2)
          const card2 = rawCards.substring(2)
          const playerCards = [card1, card2]
          hand.playerCards[playerName] = playerCards
          // console.log("updating player cards: ")
          console.log(`MUCK CARDS: ${hand.board}: ${playerName} had ${playerCards}`)
          await hand.setPlayerCards(playerName, playerCards)

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
          seatUpdateData.filter(seat => seat.seat_state !== 'Unavailable' && seat.seat_state === 'Sat')
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



          console.log('HAND COMPLETE')
          await hand.sendHandData(POST_URL)
          delete OW.SOCKET_CURRENT_HAND[webSocketId]
          delete OW.HAND_DATA[handId]
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



