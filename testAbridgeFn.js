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
    const [card1, card2] = cardArray
    const card1Value = cardValueMap[card1.substring(0,1)]
    const card1Suit = card1.substring(1)
    const card2Value = cardValueMap[card2.substring(0,1)]
    const card2Suit = card2.substring(1)
    const sortedCardValues = [card1Value,card2Value].sort((a,b) => b-a)
    const cardCombo = sortedCardValues.map(cardValue => valueCardMap[cardValue]).join('')
    let suitedDescriptor = 'o'
    if(card1Suit === card2Suit) suitedDescriptor = 's'
    if(card1Value === card2Value) suitedDescriptor = ''
    return `${cardCombo}${suitedDescriptor}`
  }

  console.log("expecting T4o")
  console.log(abridgeHand(['Ts','4h']))

  console.log("expecting ATo")
  console.log(abridgeHand(['Ts','Ah']))

  console.log("expecting 54s")
  console.log(abridgeHand(['4h','5h']))