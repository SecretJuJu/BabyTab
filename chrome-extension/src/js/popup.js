var EVENT_DOM_CONTENT_LOADED = 'DOMContentLoaded';

function setEnviroment() {
  console.log("setting enviroment")
}

function fireWhenDOMContentIsLoaded() {
  setEnviroment();
}

document.addEventListener(EVENT_DOM_CONTENT_LOADED, fireWhenDOMContentIsLoaded);