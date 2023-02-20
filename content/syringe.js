
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

    const jQueryModal = document.createElement('script')
    jQueryModal.src = webBrowser.runtime.getURL('lib/jquery.modal.min.js')
    jQueryModal.id = "injectedJQueryModal"

    const jQueryModalCSS = document.createElement('link')
    jQueryModalCSS.rel="stylesheet"
    jQueryModalCSS.href = webBrowser.runtime.getURL('lib/jquery.modal.min.css')
    jQueryModalCSS.id = "injectedJQueryModalCSS"

    const customCSS = document.createElement('link')
    customCSS.rel="stylesheet"
    customCSS.href = webBrowser.runtime.getURL('lib/modal.css')
    customCSS.id = "customCSS"


    const socketIntercept = document.createElement('script');
    socketIntercept.src = webBrowser.runtime.getURL('lib/socket-sniffer.js');
    socketIntercept.onload = function () {
        this.remove();
    };


    const headOrBody = (document.head||document.documentElement)

    headOrBody.appendChild(jQuery)
    headOrBody.appendChild(jQueryModal)
    headOrBody.appendChild(jQueryModalCSS)
    headOrBody.appendChild(socketIntercept)
    headOrBody.appendChild(customCSS)


    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            postMessage(request)
        }
    );




}

init()






