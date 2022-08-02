
async function parseSocketData(eventMessage, site) {
  console.log(eventMessage)
  console.log('trying post request')
  if (eventMessage.origin === 'wss://gs1.wssdata1.com:4703') {
    // var xhr = new XMLHttpRequest();
    // console.log("message data type")
    // console.log(typeof eventMessage.data)
    // xhr.open("POST", 'https://api.cornblaster.com/post/test', true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(eventMessage.data)
    // console.log('did request')

  }
  else {
    console.log("origin was incorrect: " + eventMessage.origin)
  }
}

const ORIGINAL_WEBSOCKET1 = WebSocket

const getEmbeddedWebsocket = async () => {

  return new Promise((resolve, reject) => {
    const check = () => {

      if (document?.getElementById('gameFrame')?.contentWindow) {
        return resolve(document.getElementById('gameFrame').contentWindow.WebSocket)
      }
      setTimeout(check, 50)
    }
    check()
  })

}

const getPokerApp = async () => {

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
  WebSocket = await getEmbeddedWebsocket()
  embeddedWindow = await getPokerApp()

  console.log("websocket acquired?")
  WebSocket.prototype = null; // extending WebSocket will throw an error if this is not set
  const ORIGINAL_WEBSOCKET = WebSocket;
  const ORIGINAL_WINDOW = embeddedWindow
  var WebSocket = window.WebSocket = class extends WebSocket {
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

        let site



        parseSocketData(JSON.parse(event), site)

        if (event.origin === 'wss://gs1.wssdata1.com:4703/ws/game') {
          site = "EveryGame Poker"

        }

      });

      this.addEventListener('open', event => {
        let ws_sniff_debug_open = new CustomEvent("ws_sniff_debug_open", {
          detail: {
            data: JSON.parse(event.data),
            obj: this
          }
        });

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


      parseSocketData(event)
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
    super.send(...args);
  }
}




highjackWebsocket()



