let EVENT_DOM_CONTENT_LOADED = 'DOMContentLoaded';

function fireWhenDOMContentIsLoaded() {
  document.getElementById("goToTheDetail").onclick = () =>{
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }
  
  document.getElementById("saveStatusBtn").onclick = () => {
    port.postMessage("Hi BackGround");
  }
}


let port = chrome.extension.connect({
  name: "Sample Communication"
});

port.onMessage.addListener(function(msg) {
  console.log("message recieved" + msg);
});




document.addEventListener(EVENT_DOM_CONTENT_LOADED, fireWhenDOMContentIsLoaded);