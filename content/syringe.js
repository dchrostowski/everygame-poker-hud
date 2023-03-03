
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

    const jQuery = document.createElement('script')
    jQuery.src = webBrowser.runtime.getURL('lib/jquery.min.js')
    jQuery.id = "injectedJQuery"

    const jQueryUI = document.createElement('script')
    jQueryUI.src = webBrowser.runtime.getURL('lib/jquery-ui.min.js')
    jQueryUI.id = "injectedJQueryUI"

    const jQueryUICSS = document.createElement('link')
    jQueryUICSS.rel = "stylesheet"
    jQueryUICSS.href = webBrowser.runtime.getURL('lib/jquery-ui.min.css')
    jQueryUICSS.id = "injectedJQueryUICSS"

    const customCSS = document.createElement('link')
    customCSS.rel = "stylesheet"
    customCSS.href = webBrowser.runtime.getURL('lib/styles.css')
    customCSS.id = "customCSS"


    const socketIntercept = document.createElement('script');
    socketIntercept.src = webBrowser.runtime.getURL('lib/socket-sniffer.js');
    socketIntercept.onload = function () {
        this.remove();
    };


    const headOrBody = (document.head || document.documentElement)

    headOrBody.appendChild(jQuery)
    headOrBody.appendChild(jQueryUI)
    headOrBody.appendChild(jQueryUICSS)
    headOrBody.appendChild(socketIntercept)
    headOrBody.appendChild(customCSS)


    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            postMessage(request)
        }
    );




}

init()






