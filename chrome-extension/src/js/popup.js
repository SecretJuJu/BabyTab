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

const saveStatusBtn = document.getElementById('saveStatusBtn');
const goToTheDetailBtn = document.getElementById("goToTheDetailBtn")

const saveTabs = () =>{
  console.log("save tabs")
  const saveStatusBtn = document.getElementById('saveStatusBtn');
  disableBtn(saveStatusBtn)
  changeText(saveStatusBtn,"saving..")
  port.postMessage({task: "save"});

}

document.addEventListener('DOMContentLoaded', function () {
  
  goToTheDetailBtn.addEventListener('click', openOptionPage);
  saveStatusBtn.addEventListener('click', saveTabs)
});

port.onMessage.addListener( async (response) => {
  console.log("response : ",response);
  if (response?.task == "saveResponse"){
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

  else if (response?.question == "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});