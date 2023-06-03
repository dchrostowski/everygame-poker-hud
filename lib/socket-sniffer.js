
const OW = window
window.prototype = null
OW.GAME_LIST = {}
OW.SOCKETS_TO_TABLES = {}
OW.SOCKET_WINDOWS = {}
OW.TABLES_TO_DOCUMENTS = {}
OW.TABLES_TO_WINDOWS = {}
OW.SOCKET_CURRENT_HAND = {}
OW.HAND_DATA = {}
OW.COMPLETED_HANDS = []
OW.GAME_SOCKETS = []
OW.TABLE_CONNECT_DATA = {}
OW.HANDLESS_SEATS = {}
OW.LAST_TABLE_STATE = {}
OW.LAST_USER_POSITION = {}
OW.LAST_NUM_SEATS = {}
OW.EMBEDDED_DOCUMENT = null
OW.GAME_CC = null
OW.MAIN_DOCUMENT = null
OW.IFRAME = null
OW.GAME_CANVAS = null
OW.USER_NAME = ''
OW.TABLE_IDS = []
OW.RANGE_DATA = {}

const cardRegex = /(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)\s?(?:[2-9]|A|K|Q|J|T)(?:d|s|c|h)/
const POST_URL = 'https://api.cornblaster.com/pokerdata/hand-history'

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
  "21": "AllIn",
  '8': 'Return Bet'
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

const unicodeCards = {
  'As': '🂡',
  'Ah': '🂱',
  'Ad': '🃁',
  'Ac': '🃑',
  '2s': '🂢',
  '2h': '🂲',
  '2d': '🃂',
  '2c': '🃒',
  '3s': '🂣',
  '3h': '🂳',
  '3d': '🃃',
  '3c': '🃓',
  '4s': '🂤',
  '4h': '🂴',
  '4d': '🃄',
  '4c': '🃔',
  '5s': '🂥',
  '5h': '🂵',
  '5d': '🃅',
  '5c': '🃕',
  '6s': '🂦',
  '6h': '🂶',
  '6d': '🃆',
  '6c': '🃖',
  '7s': '🂧',
  '7h': '🂷',
  '7d': '🃇',
  '7c': '🃗',
  '8s': '🂨',
  '8h': '🂸',
  '8d': '🃈',
  '8c': '🃘',
  '9s': '🂩',
  '9h': '🂹',
  '9d': '🃉',
  '9c': '🃙',
  'Ts': '🂪',
  'Th': '🂺',
  'Td': '🃊',
  'Tc': '🃚',
  'Js': '🂫',
  'Jh': '🂻',
  'Jd': '🃋',
  'Jc': '🃛',
  'Qs': '🂭',
  'Qh': '🂽',
  'Qd': '🃍',
  'Qc': '🃝',
  'Ks': '🂮',
  'Kh': '🂾',
  'Kd': '🃎',
  'Kc': '🃞'
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
  2: ['BTN', 'BB'],
  3: ['BTN', 'SB', 'BB'],
  4: ['BTN', 'SB', 'BB', 'UTG'],
  5: ['BTN', 'SB', 'BB', 'UTG', 'CO'],
  6: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'],
  7: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'CO'],
  8: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'MP', 'CO'],
  9: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'MP', 'MP', 'MP', 'CO'],
}



const cardValueMap = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14
}

const valueCardMap = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: 'T',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
}

const abridgeHand = (cardArray) => {
  if (typeof cardArray !== 'object' || cardArray.length !== 2) return ''
  const [card1, card2] = cardArray
  const card1Value = cardValueMap[card1.substring(0, 1)]
  const card1Suit = card1.substring(1)
  const card2Value = cardValueMap[card2.substring(0, 1)]
  const card2Suit = card2.substring(1)
  const sortedCardValues = [card1Value, card2Value].sort((a, b) => b - a)
  const cardCombo = sortedCardValues.map(cardValue => valueCardMap[cardValue]).join('')
  let suitedDescriptor = 'o'
  if (card1Suit === card2Suit) suitedDescriptor = 's'
  if (card1Value === card2Value) suitedDescriptor = ''
  return `${cardCombo}${suitedDescriptor}`
}

const preFlopStrategyMatrix = {
  'Unopened': {
    'UTG': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "AJo", "KJo", "QJo", "JJ", "JTs", "ATo", "TT", "T9s", "99", "88", "77"],
      'Call': [],
      'Fold': ["K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
    },
    'MP': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "ATo", "KTo", "QTo", "TT", "T9s", "A9o", "99", "88", "77", "66"],
      'Call': [],
      'Fold': ["K4s", "K3s", "K2s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
    },
    'CO': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "A9o", "K9o", "99", "98s", "A8o", "88", "77", "66", "55", "44", "33", "22"],
      'Call': [],
      'Fold': ["K2s", "Q4s", "Q3s", "Q2s", "J6s", "J5s", "J4s", "J3s", "J2s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
    'BTN': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "A8o", "K8o", "88", "87s", "86s", "A7o", "77", "76s", "75s", "A6o", "66", "65s", "A5o", "55", "54s", "A4o", "44", "A3o", "33", "22"],
      'Call': [],
      'Fold': ["J3s", "J2s", "T5s", "T4s", "T3s", "T2s", "95s", "94s", "93s", "92s", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "53s", "52s", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
    'SB': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "A8o", "K8o", "88", "87s", "86s", "A7o", "77", "76s", "75s", "A6o", "66", "65s", "A5o", "55", "54s", "A4o", "44", "A3o", "33", "22"],
      'Call': [],
      "Fold": ["J3s", "J2s", "T5s", "T4s", "T3s", "T2s", "95s", "94s", "93s", "92s", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "53s", "52s", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
  },
  'Open': {
    'UTG': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "AJo", "KJo", "QJo", "JJ", "JTs", "ATo", "TT", "T9s", "99", "88", "77"],
      'Call': [],
      'Fold': ["K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
    },
    'MP': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "ATo", "KTo", "QTo", "TT", "T9s", "A9o", "99", "88", "77", "66"],
      'Call': [],
      'Fold': ["K4s", "K3s", "K2s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
    },
    'CO': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "A9o", "K9o", "99", "98s", "A8o", "88", "77", "66", "55", "44", "33", "22"],
      'Call': [],
      'Fold': ["K2s", "Q4s", "Q3s", "Q2s", "J6s", "J5s", "J4s", "J3s", "J2s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
    'BTN': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "A8o", "K8o", "88", "87s", "86s", "A7o", "77", "76s", "75s", "A6o", "66", "65s", "A5o", "55", "54s", "A4o", "44", "A3o", "33", "22"],
      'Call': [],
      'Fold': ["J3s", "J2s", "T5s", "T4s", "T3s", "T2s", "95s", "94s", "93s", "92s", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "53s", "52s", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
    'SB': {
      'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "A8o", "K8o", "88", "87s", "86s", "A7o", "77", "76s", "75s", "A6o", "66", "65s", "A5o", "55", "54s", "A4o", "44", "A3o", "33", "22"],
      'Call': [],
      "Fold": ["J3s", "J2s", "T5s", "T4s", "T3s", "T2s", "95s", "94s", "93s", "92s", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "53s", "52s", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
    },
  },
  '2BET': {
    'MP': {
      'UTG': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "JJ"],
        'Call': [],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      }
    },
    'CO': {
      'UTG': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "JJ", "TT"],
        'Call': [],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "AJo", "JJ", "TT"],
        'Call': [],
        'Fold': ["A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    },
    'BTN': {
      'UTG': {
        'Raise': ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'AKo', 'KK', 'KQs', 'KJs', 'KTs', 'AQo', 'KQo', 'QQ', 'QJs', 'JJ', 'TT'],
        'Call': ['99', '98S', '88', '87s', '77', '76s', '66', '65s', '55', '54s', '44'],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "AJo", "JJ", "TT"],
        'Call': ["99", "98s", "88", "87s", "77", "76s", "66", "55"],
        'Fold': ["A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'CO': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "AQo", "KQo", "QQ", "QJs", "QTs", "AJo", "KJo", "QJo", "JJ", "JTs", "ATo", "TT"],
        'Call': ["99", "98s", "88", "87s", "77", "76s"],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      }
    },
    'SB': {
      'UTG': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "QQ", "QJs", "JJ", "TT"],
        'Call': [],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'MP': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "AJo", "JJ", "TT"],
        'Call': [],
        'Fold': ["A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'CO': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "A3s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "KQo", "QQ", "QJs", "QTs", "AJo", "KJo", "JJ", "JTs", "TT", "99"],
        'Call': [],
        'Fold': ["A8s", "A7s", "A6s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BTN': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "AJo", "KJo", "JJ", "JTs", "ATo", "TT", "T9s", "99", "88", "77"],
        'Call': [],
        'Fold': ["A2s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      }
    },
    'BB': {
      'UTG': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KQo", "QQ"],
        'Call': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "AQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "AJo", "JJ", "JTs", "J9s", "J8s", "ATo", "TT", "T9s", "T8s", "T7s", "99", "98s", "97s", "96s", "88", "87s", "86s", "77", "76s", "75s", "66", "65s", "64s", "55", "54s", "53s", "44", "43s", "33", "22"],
        'Fold': ["K2s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "AQs", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QQ", "JJ"],
        'Call': ["AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "AQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "ATo", "TT", "T9s", "T8s", "T7s", "99", "98s", "97s", "96s", "88", "87s", "86s", "85s", "77", "76s", "75s", "66", "65s", "64s", "55", "54s", "53s", "44", "43s", "33", "22"],
        'Fold': ["Q5s", "Q4s", "Q3s", "Q2s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
      },
      'CO': {
        'Raise': ["AA", "AKs", "AQs", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "KK", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "AJo", "JJ"],
        'Call': ["AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "A9o", "99", "98s", "97s", "96s", "88", "87s", "86s", "77", "76s", "75s", "66", "65s", "64s", "55", "54s", "53s", "44", "43s", "33", "22"],
        'Fold': ["Q4s", "Q3s", "Q2s", "J5s", "J4s", "J3s", "J2s", "T6s", "T5s", "T4s", "T3s", "T2s", "K9o", "Q9o", "J9o", "T9o", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"]
      },
      'BTN': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "AJo", "KJo", "JJ", "JTs", "J9s", "J8s", "ATo", "TT", "T9s", "T8s", "99", "98s"],
        'Call': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "QJo", "J7s", "J6s", "J5s", "J4s", "KTo", "QTo", "JTo", "T7s", "T6s", "A9o", "K9o", "J9o", "T9o", "97s", "96s", "A8o", "88", "87s", "86s", "85s", "A7o", "77", "76s", "75s", "74s", "A6o", "66", "65s", "64s", "A5o", "55", "54s", "53s", "44", "43s", "33", "22"],
        'Fold': ["J3s", "J2s", "T5s", "T4s", "T3s", "T2s", "Q9o", "95s", "94s", "93s", "92s", "K8o", "Q8o", "J8o", "T8o", "98o", "84s", "83s", "82s", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "73s", "72s", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "63s", "62s", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"],
      },
      'SB': {
        'Raise': ["AA", "AKs", "AQs", "AJs", "ATs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "QQ", "QJs", "JJ", "TT", "T5s", "T4s", "T3s", "T2s", "Q8o", "A7o", "K7o", "A6o", "K6o", "A5o", "K5o", "A4o", "A3o", "A2o"],
        'Call': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "A8o", "K8o", "T8o", "88", "87s", "86s", "85s", "84s", "77", "76s", "75s", "74s", "66", "65s", "64s", "63s", "55", "54s", "53s", "52s", "44", "43s", "42s", "33", "32s", "22"],
        'Fold': ["94s", "93s", "92s", "J8o", "98o", "83s", "82s", "Q7o", "J7o", "T7o", "97o", "87o", "73s", "72s", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "62s", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o"]
      }
    },
  },
  '3BET': {
    'UTG': {
      'MP': {
        'Raise': ["AA", "AKs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'CO': {
        'Raise': ["AA", "AKs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BTN': {
        'Raise': ["AA", "AKs", "A5s", "A4s", "AKo", "KK", "KQs", "KJs", "KTs", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'SB': {
        'Raise': ["AA", "AKs", "A5s", "A4s", "AKo", "KK", "KQs"],
        'Call': ["AQs", "AJs", "ATs", "QQ", "JJ", "TT", "99", "88"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BB': {
        'Raise': ["AA", "AKs", "A5s", "A4s", "AKo", "KK"],
        'Call': ["AQs", "AJs", "ATs", "KQs", "KJs", "QQ", "QJs", "JJ", "TT", "99"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },
    'MP': {
      'CO': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BTN': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'SB': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "KQs", "KJs", "KTs", "AQo", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "TT", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BB': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "AQo"],
        'Call': ["AQs", "AJs", "ATs", "KQs", "QQ", "JJ", "TT", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },
    'CO': {
      'BTN': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "AQo", "QQ", "AJo", "JJ", "JTs", "ATo"],
        'Call': ["AQs", "AJs", "ATs", "KQs", "KJs", "KTs", "TT", "T9s", "99", "98s", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'SB': {
        'Raise': ["AA", "AKs", "ATs", "A5s", "AKo", "KK", "KTs", "AQo", "QQ", "JJ", "TT"],
        'Call': ["AQs", "AJs", "KQs", "KJs", "JTs", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BB': {
        'Raise': ["AA", "AKs", "ATs", "A5s", "AKo", "KK", "AQo", "QQ", "JJ"],
        'Call': ["AQs", "AJs", "ATs", "A9s", "KQs", "KJs", "KTs", "QJs", "JTs", "TT", "99", "88", "77"],
        'Fold': ["A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },
    'BTN': {
      'SB': {
        'Raise': ["AA", "AKs", "AQs", "A9s", "A8s", "A5s", "AKo", "KK", "AQo", "QQ", "JJ", "TT"],
        'Call': ["AJs", "ATs", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs", "T9s", "99", "98s", "88", "77"],
        'Fold': ["A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BB': {
        'Raise': ["AA", "AKs", "AQs", "A5s", "AKo", "KK", "AQo", "QQ", "JJ", "TT"],
        'Call': ["AJs", "ATs", "A9s", "A8s", "KQs", "KJs", "KTs", "K9s", "QJs", "QTs", "JTs", "T9s", "99", "98s", "88", "87s", "77", "76s", "66", "65s", "55"],
        'Fold': ["A7s", "A6s", "A4s", "A3s", "A2s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },

    'SB': {
      'BB': {
        'Raise': ["AA", "AKs", "AQs", "A7s", "A6s", "A5s", "A4s", "AKo", "KK", "AQo", "QQ", "AJo", "JJ", "ATo", "TT"],
        'Call': ["AJs", "ATs", "KQs", "KJs", "KTs", "K9s", "QJs", "QTs", "Q9s", "JTs", "J9s", "T9s", "99", "88", "77"],
        'Fold': ["A9s", "A8s", "A3s", "A2s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "KJo", "QJo", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "KTo", "QTo", "JTo", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    }
  },

  '4BET': {
    'MP': {
      'UTG': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "AJs", "KQs", "QQ", "JJ"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    },
    'CO': {
      'UTG': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "AJs", "KQs", "QQ", "JJ"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "AJs", "KQs", "KJs", "QQ", "JJ", "TT"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    },
    'BTN': {
      'UTG': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "AJs", "KQs", "QQ", "JJ"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],

      },
      'MP': {
        'Raise': ["AA", "AKs", "AKo", "KK", "QQ"],
        'Call': ["AQs", "AJs", "KQs", "KJs", "JJ", "TT"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'CO': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "QQ", "JJ"],
        'Call': ["AA", "AQs", "AJs", "ATs", "KQs", "KJs", "KTs", "TT"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },

    'SB': {
      'UTG': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "AJs", "KQs", "QQ", "JJ"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "QQ"],
        'Call': ["AQs", "AJs", "KQs", "KJs", "JJ", "TT"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'CO': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "QQ", "JJ", "TT"],
        'Call': ["AQs", "AJs", "KQs", "99"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BTN': {
        'Raise': ["AA", "AKs", "AQs", "A5s", "AKo", "KK", "AQo", "QQ", "JJ", "TT"],
        'Call': ["AJs", "ATs", "KQs", "99", "88"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    },
    'BB': {
      'UTG': {
        'Raise': ["AA", "AKs", "AKo", "KK"],
        'Call': ["AQs", "QQ"],
        'Fold': ["AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'MP': {
        'Raise': ["AA", "AKs", "AKo", "KK", "QQ"],
        'Call': ["AQs", "JJ", "TT"],
        'Fold': ["AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'CO': {
        'Raise': ["AA", "AKs", "A5s", "AKo", "KK", "QQ", "JJ", "TT"],
        'Call': ["AQs", "KQs"],
        'Fold': ["AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BTN': {
        'Raise': ["AA", "AKs", "AQs", "A5s", "A4s", "AKo", "KK", "QQ", "JJ", "TT"],
        'Call': ["AJs", "KQs", "AQo", "99"],
        'Fold': ["ATs", "A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'SB': {
        'Raise': ["AKs", "A5s", "A4s", "AKo", "KK", "AQo", "QQ", "JJ", "TT"],
        'Call': ["AA", "AQs", "AJs", "ATs", "KQs", "KJs", "KTs", "QJs"],
        'Fold': ["A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "KQo", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    }
  },

  '5BET': {
    'UTG': {
      'MP': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'CO': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BTN': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'SB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },
    'MP': {
      'CO': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BTN': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'SB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
      'BB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
      },
    },
    'CO': {
      'BTN': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ", "JJ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'SB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ", "JJ", "TT"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ", "JJ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },

    },
    'BTN': {
      'SB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AQs", "AKo", "KK", "QQ", "JJ"],
        'Fold': ["AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
      'BB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AKo", "KK", "QQ", "JJ"],
        'Fold': ["AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"],
      },
    },

    'SB': {
      'BB': {
        'Raise': [],
        'Call': ["AA", "AKs", "AQs", "AKo", "KK", "QQ", "JJ", "TT"],
        'Fold': ["AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "AQo", "KQo", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "AJo", "KJo", "QJo", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "ATo", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s", "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s", "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s", "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s", "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s", "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s", "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s", "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s", "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"]
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
    if ((action === 'PostSB' || action === 'PostBB') && this.betCount === 0) {
      this.betCount += 1
    }
    if (action === 'Bet' || action == 'Raise') {
      this.betCount += 1
    }

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
  constructor({ id, seat, name, stack, bounty, display, seatState }) {
    this.id = id
    this.seat = seat
    this.name = name
    this.seatState = seatState
    if (display) {
      this.display = display
    }

    this.starting_stack = stack
    if (bounty) {
      this.player_bounty = parseFloat(bounty)
    }

  }

  to_db() {
    const data = {
      'id': this.id,
      'seat': this.seat,
      'name': this.name,
      'starting_stack': this.starting_stack,
    }

    if (this.player_bounty) {
      data['player_bounty'] = this.player_bounty
    }

    return data
  }
}



class BetSituation {

  constructor(betCount) {
    this.betCount = betCount
    this.value = null

    this.BET_COUNT_MAP_FINAL = {
      0: 'Unopened',
      1: 'Open',
      2: '2BET',
      3: '3BET',
      4: '4BET'
    }

    if (betCount > 4) {
      this.value = '5BET'
    }

    else {
      this.value = this.BET_COUNT_MAP_FINAL[this.betCount]
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
    this.bet_situation = new BetSituation(this.betCount)
    this.userName = OW.USER_NAME
    this.userCards = []
    this.villainAction = 'Unopened'
    this.villainPosition = null
    this.userPreFlopAction = 'decide yourself'

    this.currentRound = null


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
    const table_id = this.database_model.table_name
    console.log('UPDATE STREET, before: ' + this.street)
    
    
    console.log('INCLUDES: ' + ['Flop','Turn','River'].includes(newStreet))
    if(this.street !== newStreet && ['Flop','Turn','River'].includes(newStreet)) {
      this.betCount = 0
      this.bet_situation = new BetSituation(0).value
      this.villainPosition = null
      $(`#hud_advice_${table_id}`).html('')
      
    }

    this.street = newStreet
    console.log('UPDATE STREET, after: ' + this.street)  

    console.log("street is " + newStreet)
    if (newStreet !== 'PreFlop' && newStreet !== 'HoleCards') {
      $(`#hud_advice_${table_id}`).hide()
      const tableWidth = $(`table#hud_stats_table_${table_id}`).width()
      if (tableWidth > 0)
        $(`#hud_${table_id}`).css({ width: tableWidth })
    }
    else {
      $(`#hud_advice_${table_id}`).show()
    }
  }

  getUserPosition = async () => {
    let userPosition = this.positions?.[this.userName] || null
    return userPosition

  }

  getUserCards = async () => {
    return this.playerCards[this.userName]
  }

  assignPositionsToSeats = async (seats, dealerPos) => {
    if (!seats || seats.length < 2) return

    console.log(seats)

    seats = seats.filter(seatData => ('Sat' !== seatData['seat_state'] || seatData['seat'] == dealerPos))

    OW.LAST_NUM_SEATS[this.database_model.table_name] = seats.length
    const seatOrder = SEAT_ORDER?.[seats.length] || null

    if (seatOrder === null) return
    if (Object.keys(this.positions).length > 0) return

    let dealerIdx

    seats.forEach((seat, idx) => {
      if (seat.seat === dealerPos) dealerIdx = idx
    })

    const dealerSeat = seats[dealerIdx]
    if (dealerSeat?.name === this.userName) {
      //console.log(`Table ${this.database_model.table_name}: You are BTN`)
      OW.LAST_USER_POSITION[this.database_model.table_name] = 'BTN'
    }

    this.positions[dealerSeat?.name] = 'BTN'


    for (let i = 1; i < seatOrder.length; i++) {
      const positionName = seatOrder[i]
      const curSeatIdx = (dealerIdx + i) % seats.length
      const curSeat = seats[curSeatIdx]
      if (curSeat?.name === this.userName) {
        OW.LAST_USER_POSITION[this.database_model.table_name] = positionName
        //console.log(`Table ${this.database_model.table_name}: You are ${positionName}`)
      }

      this.positions[curSeat?.name] = positionName

    }

    console.log("Positions:")
    console.log(this.positions)

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
    let selectedSeat = null
    seats.forEach((seat) => {
      if (seat.name === playerName) {
        selectedSeat = seat
      }
    })

    return selectedSeat

  }

  getUserActionPreflop = async () => {
    if (Object.keys(this.positions).length === 0) {
      await this.updateFromTableState(OW.LAST_TABLE_STATE[this.database_model.table_name])
    }
    if (this.street !== 'PreFlop' && this.street !== 'HoleCards') return
    const userName = this.userName
    let userPosition = await this.getUserPosition()

    
    const userCards = await this.getUserCards() || []
    const abridgedUserCards = abridgeHand(userCards)
    

    const villainPosition = this.villainPosition
    


    

    let userPreFlopAction = null

    //console.log(`preFlopStrategyMatrix[${this.bet_situation}][${userPosition}][${villainPosition}]`)


    let actionMatrix = {}
    actionMatrix = preFlopStrategyMatrix?.[this.bet_situation]?.[userPosition] || {}

    if (Object.keys(actionMatrix).length > 0 && Object.keys(actionMatrix).indexOf('Raise') === -1) {
      actionMatrix = actionMatrix?.[villainPosition] || {}


    }
    if (Object.keys(actionMatrix).indexOf('Raise') === -1) return

    const { Raise, Call, Fold } = actionMatrix
    try {
      if (Raise.indexOf(abridgedUserCards) !== -1) userPreFlopAction = 'Raise'
      else if (Call.indexOf(abridgedUserCards) !== -1) userPreFlopAction = 'Call'
      else if (Fold.indexOf(abridgedUserCards) !== -1) userPreFlopAction = 'Fold'
      else userPreFlopAction = 'Check/Fold'
    }
    catch (err) {
      console.log("error occurred, check matrix and user cards")
      console.log(actionMatrix)
      console.log(abridgedUserCards)
    }

    this.userPreFlopAction = userPreFlopAction

    if (userCards.length == 2) {
      console.log('Table ' + this.database_model.table_name + ": " + this.userPreFlopAction + ' your ' + userCards.join(' '))
      const table_id = this.database_model.table_name

      $(`#hud_advice_${table_id}`).html(`<span class="hud-pre-flop-advice">Advice: ${this.userPreFlopAction} your  <span class="unicode-cards">${userCards.join(' ')}</span></span>`)


      if (this.userPreFlopAction === 'Fold' && $(`input#autoFold_${table_id}`).is(':checked')) {
        await autoCheckFold(table_id)
      }
    }


  }

  processAction = async (action) => {
    if (Object.keys(this.positions).length === 0) {
      await this.updateFromTableState(OW.LAST_TABLE_STATE[this.database_model.table_name])

    }

    
    const playerName = action.player_name
    const playerPosition = this.positions?.[playerName] || '???'
    let actionString = action.action
    const actionAmount = action?.amount || ''
    console.log(`=============================\nBEFORE PROCESS ACTION:\npn:${playerName} as: ${actionString} bc: ${this.betCount} bs: ${this.bet_situation}`)


    const betCountMap = {
      0: 'Unopened',
      1: 'Open',
      2: '2BET',
      3: '3BET',
      4: '4BET'
    }

    if ((actionString === 'Post SB' || actionString === 'Post BB') && this.betCount === 0) {
      this.betCount += 1
    }


    if (actionString === 'Bet' || actionString === 'Raise') {
      this.betCount += 1
      this.villainPosition = playerPosition
    }

    this.bet_situation = new BetSituation(this.betCount).value

    console.log(`=============================\nAFTER PROCESS ACTION:\npn:${playerName} as: ${actionString} bc: ${this.betCount} bs: ${this.bet_situation}`)

    await this.getUserActionPreflop()
  }

  updateFromDealerChat = async (dealerMessage) => {

    if (Object.keys(streetCodes).includes(dealerMessage[0])) {
      await this.updateStreet(streetCodes[dealerMessage[0]])
    }

    if (dealerMessage[0] === '15') {
      const [dmc, seatNumber, playerName, win_amount] = dealerMessage
      const actionSeat = await this.getPlayerSeatByName(playerName)
      const player_win = {
        player_id: actionSeat.id,
        player_name: actionSeat.name,
        win_amount: parseFloat(win_amount),

      }
      this.database_model.total_pot.player_wins.push(player_win)
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

        const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, rawCards.trim().split(' '))
        await this.processAction(action)
        this.gameEvents['End'].addAction(action)

      }

      if (playerAction === 'Mucks Cards') {
        if (!this.gameEvents.hasOwnProperty('End')) {
          this.gameEvents['End'] = new Round(this.street, this.board)
        }
        const [dmc, seat, playerName] = dealerMessage
        const actionSeat = await this.getPlayerSeatByName(playerName)
        const action = new Action(actionSeat?.id, actionSeat?.name, playerAction, amount, this.playerCards[playerName], playerPosition)
        await this.processAction(action)
        this.gameEvents['End'].addAction(action)
      }

      if (['39', '18', '19', '7', '6', '5', '21', '4', '10', '4', '10', '8'].includes(dealerMessageCode.toString())) {

        if (![, '4', '10'].includes(dealerMessageCode.toString())) {
          amount = dealerMessage[3]
        }
        else {
          amount = null
        }



        const playerAction = ohhActionMap[dealerMessageCode.toString()]


        const actionSeat = await this.getPlayerSeatByName(playerName)

        if (actionSeat) {
          let cards = []
          cards = this.playerCards?.[playerName] || null
          if (cards === null) {
            cards = []
          }

          if (playerAction === 'Fold') {
            const tableId = this.database_model.table_name
            $(`tr#tr_${tableId}_${playerName.replace(/(\W+)/g, '')}`).addClass('folded')
            if (!$(`input#showFolded_${tableId}`).is(':checked')) {
              $(`table#hud_stats_table_${tableId}`).find('tr.folded').hide()
            }
            else {
              $(`table#hud_stats_table_${tableId}`).find('tr.folded').show()
            }

          }

          const action = new Action(actionSeat.id, actionSeat.name, playerAction, amount, cards, playerPosition)
          await this.processAction(action)

          this.gameEvents[this.street].addAction(action)

        }

        else {

          const action = new Action(-1, playerName, playerAction, amount)
          await this.processAction(action)
          this.gameEvents[this.street].addAction(action)

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
      const tableId = this.database_model.table_name

      const divId = `#hud_stats_${tableId}`



      const playerNames = arrayOfSeats.map(seatData => seatData['name'])

      playerNames.forEach((name) => {
        if (Object.keys(OW.RANGE_DATA).indexOf(name) === -1) {
          const rangeDataEndpoint = `https://api.cornblaster.com/pokerdata/everygame.eu/ranges/${name}`
          $.get(rangeDataEndpoint, (response) => {
            OW.RANGE_DATA[name] = response
          })
        }
      })

      const playerNameString = playerNames.join(',')
      const apiEndpoint = `https://api.cornblaster.com/pokerdata/everygame.eu/hud_stats/${playerNameString}`
      $.get(apiEndpoint, (response) => {
        $(divId).html(`<table class="hud hud-stats-table" id="hud_stats_table_${tableId}">
                        <tr>
                          <th>Player</th>
                          <th>Hands</th>
                          <th>VPIP</th>
                          <th>PFR</th>
                          <th>3BET</th>
                          <th>WWSF</th>
                          <th>WTSD</th>
                          <th>WSD</th>
                          <th>AG</th>
                        </tr>
                        <tbody>
                        </tbody>
                      </table>`
        )
        $(`table#hud_stats_table_${tableId}`).show()


        console.log(response)
        let i = 1

        response.hud_data.forEach((dataRow) => {
          const player = dataRow['player_name']
          let name = player
          if (name.length > 8) {
            name = player.substring(0, 7) + '..'
          }
          const hands = dataRow['total_hands']
          const vpip = Math.round(dataRow['VPIP'])
          const pfr = Math.round(dataRow['PFR'])
          const threeBet = Math.round(dataRow['3BET'])
          const wwsf = Math.round(dataRow['WWSF'])
          const wtsd = Math.round(dataRow['WTSD'])
          const wsd = Math.round(dataRow['WSD'])
          const ag = dataRow['AG']
          const trClass = 'player-row'
          let tdHandClass = 'player-hands'

          if (hands < 200) {
            tdHandClass += ' low-sample-size'
          }
          else if (hands >= 200 && hands < 1000) {
            tdHandClass += ' medium-sample-size'
          }
          else if (hands >= 1000) {
            tdHandClass += ' high-sample-size'
          }

          const htmlRow = `<tr class="${trClass}" id="tr_${tableId}_${player.replace(/(\W+)/g, '')}"><td>${name}</td><td class="${tdHandClass}">${hands}</td><td>${vpip}</td><td>${pfr}</td><td>${threeBet}</td><td>${wwsf}</td><td>${wtsd}</td><td>${wsd}</td><td>${ag}</td></tr>`
          $(`table#hud_stats_table_${tableId}`).append(htmlRow)
          i++
        })
        const tableWidth = $(`table#hud_stats_table_${tableId}`).width()
        if (tableWidth) {
          $(`#hud_${tableId}`).css({ width: tableWidth })
        } else {

        }
      })

      //$(`table#hud_stats_table_${tableId}`).find('tr').show()


      arrayOfSeats
        .filter(seatData => !['Unavailable', 'Empty'].includes(seatData['seat_state']))
        .forEach(async (seatData) => {
          await this.updatePlayerCards(seatData)

          const player = new Player({
            id: parseInt(seatData['id']),
            seat: parseInt(seatData['seat']),
            name: seatData['name'],
            stack: parseFloat(seatData['stack']),
            bounty: seatData['bounty'],
            seatState: seatData['seat_state']
          })

          if ($(`#hud_${tableId}`).attr('moved') === 'false' && player.name === this.userName && player.seat > 4) {
            let style = $(`#hud_${tableId}`).attr('style')
            let replaceStyle = style.replace(/left/g, ' right')
            $(`#hud_${tableId}`).attr('style', replaceStyle)
            $(`#hud_${tableId}`).attr('moved', true)

          }





          if (seatData['id']) {
            this.database_model.players.push(player.to_db())
          }

          this.seats.push(player)
        })

      this.seatsInitialized = true
      if (this.seats.length > 1) {
        OW.LAST_NUM_SEATS[this.database_model.table_name] = this.seats.length
      }

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
      if (playerCards.length > 0) {
        const playerSeat = await this.getPlayerSeatByName(playerName)
        const dealtAction = new Action(playerSeat?.id, playerSeat?.name, 'Dealt Cards', null, playerCards)
        await this.processAction(dealtAction)
        this.gameEvents['PreFlop'].addAction(dealtAction)

      }
    })


  }

  finalizeHand = async () => {

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
          player_id = playerSeat?.id
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
  }

}



const parseSocketData = async (message, webSocketId) => {
  const ew = await getEmbeddedWindow()
  const pokerapp = ew.pokerapp


  const activeTableId = pokerapp.UIAppViewManager.getInstance().getActiveView().getPokerGame().getGameHeader().tableId

  const views = pokerapp.UIAppViewManager.getInstance().getViews()

  $(`#hud_${activeTableId}`).show()

  const inactiveTableIds = views.reduce((inactive, view) => {
    if (view instanceof pokerapp.UIPokerGameView) {
      const tableId = view.getPokerGame().getGameHeader().tableId
      if (tableId !== activeTableId)
        inactive.push(tableId)

    }
    return inactive


  }, [])

  inactiveTableIds.forEach((tableId) => {
    $(`#hud_${tableId}`).hide()

  })


  const correlated_table_id = OW.SOCKETS_TO_TABLES[webSocketId]
  const tableInfo = OW.GAME_LIST[correlated_table_id]

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
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          const seatsInvolved = message?.payload?.p[1].split(',')
          if (seatsInvolved.length > 1) {
            hand.showdownOcurred = true
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
          await hand.getUserActionPreflop()
          OW.HAND_DATA[handId] = hand
        }
        OW.LAST_TABLE_STATE[correlated_table_id] = message.payload.p

        break;
      }

      case 'TablePLayerTurn': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          await hand.getUserActionPreflop()
          OW.HAND_DATA[handId] = hand
        }

        break;
      }

      case 'TableHandMuckedCards': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
        const hand = handId !== null ? OW.HAND_DATA[handId] : null
        if (hand) {
          const playerAndCards = message?.payload?.p[0]
          const [playerName, rawCards] = playerAndCards.split(' ')
          const card1 = rawCards.substring(0, 2)
          const card2 = rawCards.substring(2)
          const playerCards = [card1, card2]
          hand.playerCards[playerName] = playerCards
          console.log(`MUCK: Table ${hand.database_model.table_name}: [${hand.board || 'PreFlop'}] - ${playerName} had ${playerCards}`)
          const table_id = hand.database_model.table_name

          const muckedUnicodeCards = playerCards.map((card) => unicodeCards?.[card] || card)
          // this is a little feature I left in for myself.  
          //everygame.eu sends the muck cards at the end of every hand in a socket message.
          // obviously an oversight on their part, and arguably cheating
          if (OW.USER_NAME === 'cornbl4ster') {
            const unicodeBoard = hand.board.map((card => unicodeCards?.[card] || card))

            $(`div#hud_muck_${table_id}`).html(`<span class="hud-muck-advice">${playerName} mucked <span class="unicode-cards">${playerCards.join(' ')}</span> with <span class="unicode-cards">[${hand.board.join(' ')}]</span> on the board.</span>`)
          }

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
          await hand.getUserActionPreflop()
          OW.HAND_DATA[handId] = hand
        }

        break;
      }


      case 'TableSeatState': {
        const handId = OW.SOCKET_CURRENT_HAND[webSocketId] || null
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

          if (!hand.seatsInitialized && (numSeats === 10 || numSeats >= 2)) {
            await hand.initSeats(seatUpdateData)
          }

          seatUpdateData.filter(seat => seat.seat_state !== 'Unavailable' && seat.seat_state === 'Sat')
            .forEach(async (seat) => {
              await hand.updatePlayerCards(seat)
            })

          OW.HAND_DATA[handId] = hand
        }
        else {
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

          await hand.sendHandData(POST_URL)
          delete OW.SOCKET_CURRENT_HAND[webSocketId]
          delete OW.HAND_DATA[handId]

        }


        break;
      }
      default: {
        return
      }

    }
  }

}

const autoCheckFold = async (tableId) => {
  const embeddedWindow = await getEmbeddedWindow()
  const pokerapp = embeddedWindow.pokerapp
  const pg = pokerapp.GameManagerService.getInstance()
  const game = pg.findGameByTableId(tableId)
  if (!game?._game) return

  return new Promise((resolve, reject) => {
    const check = () => {
      if (!$(`input#autoFold_${tableId}`).is(':checked')) {
        return resolve()
      }

      if (game._game._tableModel.isMyTurn() && $(`input#autoFold_${tableId}`).is(':checked')) {

        if (game._game.isValidPreAction(pokerapp.PokerPlayerPreActions.Check)) {
          return resolve(game._game.actionPlayerCheck())
        }
        else {
          return resolve(game._game.actionPlayerFold())

        }
      }
      else {
        setTimeout(check, 100)
      }

    }
    check()
  })
}



const getEmbeddedWindow = async () => {
  return new Promise((resolve, reject) => {
    const check = () => {
      if (document?.getElementById('gameFrame')?.contentWindow) {
        return resolve(document.getElementById('gameFrame').contentWindow)
      }
      setTimeout(check, 25)
    }
    check()
  })
}

const getGameCanvas = async () => {
  const embeddedWindow = await getEmbeddedWindow()
  return new Promise((resolve, reject) => {
    const check = () => {
      if (embeddedWindow.document?.getElementById('gameCanvas')) {
        return resolve(embeddedWindow.document.getElementById('gameCanvas'))
      }
      setTimeout(check, 50)
    }
    check()
  })
}


highjackIFrameWebsocket = async () => {
  const embeddedWindow = await getEmbeddedWindow()

  OW.GAME_CC = embeddedWindow.cc
  console.log("embedded window:")
  console.log($(embeddedWindow.document))

  const gameCanvas = await getGameCanvas()

  OW.EMBEDDED_DOCUMENT = embeddedWindow.document
  WebSocket = embeddedWindow.WebSocket
  let ws2 = WebSocket
  ws2.prototype = null; // extending WebSocket will throw an error if this is not set

  let embeddedWindow2 = embeddedWindow
  embeddedWindow2.prototype = null



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

        OW.GAME_SOCKETS.push(socketId)

      });

    }

    send(...args) {
      let msg
      try {
        msg = JSON.parse(args[0])
        if (this.url === 'wss://gs1.wssdata1.com:4703/ws/game' && msg?.['payload'].t === 100 && msg['payload']?.p[0]) {
          this.webSocketId = msg.payload.s
          console.log("updated websocket id to " + this.webSocketId)
          console.log(`correlating ${this.webSocketId} to ${msg['payload'].p[0]}`)

          OW.SOCKETS_TO_TABLES[this.webSocketId] = msg['payload'].p[0]
          OW.SOCKET_WINDOWS[this.webSocketId] = embeddedWindow2
          const table_id = msg['payload'].p[0]

          const hudContainer = `
          <div class="hud hud-main" id="hud_${table_id}">
            <div class="hud hud-header">
              <div class="hud hud-header-left" id="hud_header_left_${table_id}">
              <a class="minimize-hud" id="minMax_${table_id}">[-]</a>
              </div>
              <div class="hud hud-header-center" id="hud_header_center_${table_id}">
                <span class="hud hud-title">HUD - Table ${table_id}</span>
              </div>
              <div class="hud hud-header-right">
                <a class="close-hud" id="showHide_${table_id}"><</a>
              </div>
            </div>
            <div class="hud-container" id="hud_container_${table_id}">
              <div class="hud hud-preflop-advice" id="hud_advice_${table_id}">
                <span class="hud-preflop-advice"></span>
              </div>
              <div class="hud hud-muck-advice" id="hud_muck_${table_id}">
                <span class="hud-muck-advice"></span>
              </div>
              <div class="hud hud-stats" id="hud_stats_${table_id}">
              </div>

            </div>
            <div class="hud hud-footer" id="hud_stats_footer_${table_id}">
              <label for="showFolded" class="hud hud-footer-options-left">
                <input type="checkbox" id="showFolded_${table_id}"/>
                Show Folded
              </label>
              <label for="autoFold" class="hud hud-footer-options-center">
                <input type="checkbox" id="autoFold_${table_id}"/>
              Auto-Fold Bad Hands Preflop
                </label>
                <div class="hud hud-footer-options-right" id="hud_opacity_${table_id}"/>
            </div>
          </div>`





          OW.TABLE_IDS.push(table_id)
          $(hudContainer).attr('moved', false).css({
            position: "absolute",
            marginLeft: '1em', marginTop: 50,
            marginRight: '1em',
            top: 0, left: 0,
            backgroundColor: 'white',
            opacity: 0.7
          }).appendTo(document.body);



          $(`div#hud_header_center_${table_id}, div#hud_header_left_${table_id} `).click(() => {
            if ($(`div#hud_container_${table_id} `).is(':visible')) {
              $(`div#hud_container_${table_id} `).hide()
              $(`#hud_stats_footer_${table_id} `).hide()
              $(`a#minMax_${table_id} `).text('[+]')
            }
            else {
              $(`div#hud_container_${table_id} `).show()
              $(`#hud_stats_footer_${table_id} `).show()
              $(`a#minMax_${table_id} `).text('[-]')
            }
          })

          $(`a#showHide_${table_id} `).click(() => {
            if ($(`div#hud_header_center_${table_id} `).is(":visible")) {

              $(`div#hud_container_${table_id} `).hide()
              $(`a#minMax_${table_id} `).text('[+]')
              $(`div#hud_header_left_${table_id} `).hide()
              $(`div#hud_header_center_${table_id} `).hide()
              $(`#hud_stats_footer_${table_id} `).hide()
              $(`a#showHide_${table_id} `).text('>')
              $(`div#hud_${table_id} `).css({ 'width': '1em' })
            }
            else {
              $(`div#hud_header_left_${table_id} `).show()
              $(`div#hud_header_center_${table_id} `).show()
              $(`div#hud_container_${table_id} `).show()
              $(`#hud_stats_footer_${table_id} `).show()
              $(`a#showHide_${table_id} `).text('<')
              try {
                const tableWidth = $(`table#hud_stats_table_${table_id} `).width()
                $(`div#hud_${table_id} `).css({ 'width': tableWidth })
              }
              catch (err) {
                $(`div#hud_${table_id} `).css({ 'width': $(gameCanvas).width() * 0.25 })
              }

            }

          })

          $(`input#showFolded_${table_id}`).change(() => {
            console.log("showFolded change")
            if ($(`input#showFolded_${table_id}`).is(':checked')) {
              console.log('is checked')
              $(`table#hud_stats_table_${table_id}`).find('tr.folded').show()

              console.log("check folded rows")
              console.log($(`table#hud_stats_table_${table_id}`).find('tr.folded'))
            }
            else {
              console.log('is not checked')
              $(`table#hud_stats_table_${table_id}`).find('tr.folded').hide()
            }

          })
          $(`#hud_${table_id} `).draggable()
          $(`#hud_opacity_${table_id}`).slider({
            min: 20,
            max: 100,
            value: 75,
            change: (evt, ui) => {
              $(`div#hud_${table_id}`).css({ 'opacity': ui.value / 100 })
            }
          })

          const modalHTML = `< div id = "modal_${table_id}" class="modal advice" > \
          <h4>Table ${table_id}</h4> \
          <div id="muckinfo_${table_id}"><p></p></div> \
          <div id="advice_${table_id}"><p></p></div> \
                              </div > `

          const linkToModal = `< a id = "${table_id}_openModal" href = "#modal_${table_id}" rel = "modal:open" > Open Modal</a > `
          const root_div = $(document).xpathEvaluate('//div[@id="root"]')

          root_div.append(modalHTML)
          $(document).xpathEvaluate('//div[@id="root"]').append(linkToModal)

        }

      }
      catch (err) {

      }


      super.send(...args);
    }
  }

}


const parseMainSocketData = async (message) => {
  if (message?.cmd === 'LOGIN') {
    OW.USER_NAME = message?.nickName
  }

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
  let ws1 = window.WebSocket
  ws1.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  ws1 = WebSocket = class extends WebSocket {
    constructor(...args) {
      super(...args);


      this.addEventListener('message', async (event) => {
        await parseMainSocketData(JSON.parse(event.data))
      });

      this.addEventListener('open', event => {
      });
    }

    send(...args) {
      super.send(...args);
    }
  }

}

$.fn.xpathEvaluate = function (xpathExpression) {
  // NOTE: vars not declared local for debug purposes
  $this = this.first(); // Don't make me deal with multiples before coffee

  // Evaluate xpath and retrieve matching nodes
  xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

  result = [];
  while (elem = xpathResult.iterateNext()) {
    result.push(elem);
  }

  $result = jQuery([]).pushStack(result);
  return $result;
}


appendDiv = () => {
  const findDiv = () => {

    const documentNode = $(document)
    OW.MAIN_DOCUMENT = document
    const className = $(document).xpathEvaluate('//div[contains(text(),"Balance")]')[0]?.classList?.value

    const bannerDiv = $(document).xpathEvaluate('//div[@id="root"]/div/div/div/div/div/img/parent::div')
    bannerDiv.append(`< div class="${className}" > HUD Extension Loaded</div > `)

  }

  setTimeout(findDiv, 5000)

}



appendDiv()
highjackPrimaryWebsocket()
highjackIFrameWebsocket()


// cc.actionManager
// pg = pokerapp.GameManagerService.getInstance()
// game = pg.findGameByTableId(21976)
// game._game.actionPlayerFold()
// game._game.doAction(pokerapp.PokerPlayerPreActions.Fold)
// game._game._tableModel.isMyTurn()