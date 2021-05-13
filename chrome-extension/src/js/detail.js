
window.onload = function(){
    
    let port = chrome.runtime.connect({name: "messaging"});
    let statusList
    let modal = document.querySelector(".modal")
    let loginForm = document.querySelector(".login")
    let loginBtn = document.querySelector("#loginBtn")
    let deteletAllBtn = document.getElementById("deteletAllBtn")
    const modalHandler = () => {
        modal.style.display = "none"
        loginForm.style.display = "none"
    }
    const loginBtnHandler = () => {
        modal.style.display = "flex"
        loginForm.style.display = "flex"
    }
    const toggleShowStatus = () => {
        // get infomations from chromeAPI in background.js
    }
    
    const requestGetStatusList = () => {
        port.postMessage({task: "getStatusList"});
    }
    const requestDeleteAll = () => {
        port.postMessage({task: "deleteAll"});

    }
    const getStatus = (id) => {

    }

    const displayedStatusList = () => {
        let setList = document.getElementById("setList")
        for ( let status in statusList ) {
            let newStatus = document.createElement('li');
            newStatus.innerHTML = newStatus.innerHTML + `
            <div class="wrapper">
                        <div class="summary">
                            <div class="topSide">
                                <div class="left">
                                    <h2 class="name">
                                        example
                                    </h2>
                                </div>
                                <div class="right">
                                    <span class="tabCount">
                                        tab count : <strong> 22 </strong>
                                    </span>
                                    <span class="windows">
                                        window count : <strong> 3 </strong>
                                    </span>
                                </div>
                            </div>
                            <div class="underSide">
                                <span>
                                    created at : <strong>2021-4-4</strong>
                                </span>
                            </div>
                        </div>
                        <div class="detailInfo">
                            <div class="left">
                                <div class="infos">
                                    <div class="title">
                                        <h1>
                                            example
                                        </h1>
                                    </div>
                                    <div class="tabCount">
                                        Tab count : <strong>22</strong>
                                    </div>
                                    <div class="windowCount">
                                        Window count : <strong>10</strong>
                                    </div>
                                    <div class="createdAt">
                                        createdAt <br> <strong>2020-04-04</strong>
                                    </div>
                                </div>
                                <div class="buttons">
                                    <div class="load">
                                        <button>Load</button>
                                    </div>
                                    <div class="delete">
                                        <button>Delete</button>
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="wrapper">
                                    <ul class="windows">
                                        <li>
                                            <h2>
                                                window1
                                            </h2>
                                            <p class="options">
                                                <strong>height</strong>: 1025 <br>
                                                <strong>incognito</strong>: false <br>
                                                <strong>left</strong>: 0 <br>
                                                <strong>state</strong>: "normal" <br>
                                                <strong>top</strong>: 25 <br>
                                                <strong>type</strong>: "normal" <br>
                                                <strong>width</strong>: 1680
                                            </p>
                                            <ul class="tabs">
                                                <li>
                                                    <a href="https://naver.com">
                                                    https://naver.com?biusghfiuedfouhawoiudfasijwiojfioawehjfiohieofhwoihfiowhefiohweiofhwoifhw=adasd
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
            
            `
            console.log(status)
        }
    }
    
    
    modal.addEventListener("click", ()=>modalHandler())
    deteletAllBtn.addEventListener("click", ()=> requestDeleteAll())
    loginBtn.addEventListener("click",()=>loginBtnHandler())
    requestGetStatusList()
    port.onMessage.addListener( async (response) => {
        console.log("response : ",response);
        if (response?.task === "getStatusList"){
            statusList = response.data
            displayedStatusList();
        } else if (response?.task === "deleteAll"){
            if (response.result) {
                alert("deleted!")
            } 
        }
    });
}