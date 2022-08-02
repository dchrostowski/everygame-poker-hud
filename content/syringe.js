function init() {

    let webBrowser
    if (typeof browser === 'undefined') {
        webBrowser = chrome
    }
    else {
        webBrowser = browser
    }

    document.addEventListener('message', function (e) {
        var data = e.detail;
        console.log('received', data);
    });



    const socketIntercept = document.createElement('script');
    socketIntercept.src = webBrowser.runtime.getURL('lib/socket-sniffer.js');
    socketIntercept.onload = function () {
        this.remove();
    };


    const headOrBody = (document.head || document.body)


    headOrBody.appendChild(socketIntercept)

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            postMessage(request)
        }
    );


}

init()