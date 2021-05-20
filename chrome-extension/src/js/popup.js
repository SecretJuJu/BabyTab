const openOptionPage = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

const toggleBtn = (element) => {
  element.disabled = !element.disabled
}

const disableBtn = (element) => {
  element.disabled = true
}

const changeText = (element,text) => {
  element.innerText = text
}

let port = chrome.runtime.connect({name: "messaging"});
const setToRecentSetBtn = document.getElementById('setToRecentSetBtn')
const saveStatusBtn = document.getElementById('saveStatusBtn');
const goToTheDetailBtn = document.getElementById("goToTheDetailBtn")
const testBtn = document.getElementById('testBtn');

// const getInput = document.getELement('getInput');

const getInput = (msg,defaultValue) => {
  let output = prompt(msg,defaultValue)
  return output
}

const saveStatus = async () =>{
  statusName = new Date()
  const saveStatusBtn = document.getElementById('saveStatusBtn');
  disableBtn(saveStatusBtn)
  changeText(saveStatusBtn,"saving..")
  sendSaveRequest(statusName)
}

const sendSaveRequest = (statusName) => {
  port.postMessage({task: "save",name:statusName});
}

const setToRecentSet = () => {
  disableBtn(setToRecentSetBtn)
  chrome.windows.getCurrent(function (win) {
    port.postMessage({task: "setToRecentSet",winId:win.id});
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setToRecentSetBtn.addEventListener('click', setToRecentSet);
  goToTheDetailBtn.addEventListener('click', openOptionPage);
  saveStatusBtn.addEventListener('click', saveStatus)
  testBtn.addEventListener('click', () => {
    console.log('asada')
  })
});

port.onMessage.addListener( async (response) => {
  console.log("response : ",response);
  if (response?.task === "save"){
    if (response.result) {
      changeText(saveStatusBtn,"complete!")
    } else {
      changeText(saveStatusBtn,"failed..")
    }
    setTimeout(() => {
      changeText(saveStatusBtn,"Save status")
      toggleBtn(saveStatusBtn)
    },1000)
  }

  else if (response?.task == "setToRecentSet"){
    console.log(response)
    setTimeout(() => {
      toggleBtn(setToRecentSetBtn)
    },1000)
  }
});

