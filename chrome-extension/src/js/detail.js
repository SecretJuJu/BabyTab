
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
    const toggleDisplayDetail = (wrapper) => {
        // toggle detail info 
        const detailInfo = wrapper.querySelector(".detailInfo")
        if (detailInfo.style.display === "none") {
            detailInfo.style.display = "flex"
        } else {
            detailInfo.style.display = "none"
        }
    }
    
    const requestGetStatusList = () => {
        port.postMessage({task: "getStatusList"});
    }
    const requestDeleteAll = () => {
        port.postMessage({task: "deleteAll"});
    }
    

    const makeElement = (tagName,classNames='') => {
        const newElement = document.createElement(tagName)
        newElement.className=classNames
        return newElement
    }

    const displayedStatusList = () => {
        let setListUlElement = document.querySelector('#setList>ul')
        setListUlElement.innerHTML=""
        
        let keys = (Object.keys(statusList)).reverse();
        const getTabCount = (status) => {
            let sum = 0
            for (let i=0;i<status.status.length; i++) {
                sum += status.status.length
            }
            return sum
        }
        
        for ( let i=0;i < keys.length; i++) {
            let status = statusList[keys[i]]
            const li = makeElement('li')
            li.id = keys[i]
            const wrapper = makeElement('div','wrapper')
            const tabCount = getTabCount(status)
            wrapper.innerHTML = `
                <div class="summary">
                    <div class="topSide">
                        <div class="left">
                            <h2 class="name">
                                ${status.name}
                            </h2>
                        </div>
                        <div class="right">
                            <span class="tabCount">
                                tab count : <strong> ${tabCount} </strong>
                            </span>
                            <span class="windows">
                                window count : <strong> ${status.status.length} </strong>
                            </span>
                        </div>
                    </div>
                    <div class="underSide">
                        <span>
                            created at : <strong>${status.createdAt}</strong>
                        </span>
                    </div>
                </div>
                <div class="detailInfo">
                    <div class="left">
                        <div class="infos">
                            <div class="title">
                                <h1>
                                    ${status.name}
                                </h1>
                            </div>
                            <div class="tabCount">
                                Tab count : <strong>${tabCount}</strong>
                            </div>
                            <div class="windowCount">
                                Window count : <strong>${status.status.length}</strong>
                            </div>
                            <div class="createdAt">
                                createdAt <br> <strong>${status.createdAt}</strong>
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
                                
                            </ul>
                        </div>
                    </div>
                </div>
            `
            const summary = wrapper.querySelector('.summary')
            const loadBtn = wrapper.querySelector('.buttons .load button')
            const deleteBtn = wrapper.querySelector('.buttons .delete button')
            summary.onclick = (e) => {
                let wrapper = e.target
                if(wrapper.className !== "wrapper"){
                    do {
                        wrapper = wrapper.parentNode
                    }
                    while (wrapper.className !== "wrapper")
                }
                toggleDisplayDetail(wrapper)
            }
            loadBtn.onclick = () => {
                chrome.windows.getCurrent(function (win) {
                    port.postMessage({task: "setStatus",winId:win.id,target: keys[i]});
                })
            }
            deleteBtn.onclick = () => {
                port.postMessage({task: "delete",target: keys[i]});
            }
            let windowUl = wrapper.querySelector('.right .wrapper .windows')
            
            for (let i=0; i < status.status.length; i++){
                const windowLi = makeElement('li')
                const h2 = makeElement('h2')
                h2.innerText = `window ${i+1}`
                windowLi.appendChild(h2)
                const options = makeElement('div','options')
                options.innerHTML = `
                <strong>height</strong>: ${status.status[i].options.height} <br>
                <strong>incognito</strong>: ${status.status[i].options.incognito} <br>
                <strong>left</strong>: ${status.status[i].options.left} <br>
                <strong>state</strong>: "${status.status[i].options.state}" <br>
                <strong>top</strong>: ${status.status[i].options.top} <br>
                <strong>type</strong>: "${status.status[i].options.type}" <br>
                <strong>width</strong>: ${status.status[i].options.width}
                `
                windowLi.appendChild(options)
                const windowUrlUl = makeElement('ul','tabs')
                windowLi.appendChild(windowUrlUl)
                for(let j=0; j < status.status[i].urls.length; j++) {
                    const windowUrlLi = makeElement('li')
                    const aLink = makeElement('a')
                    aLink.href = status.status[i].urls[j]
                    aLink.innerText = status.status[i].urls[j]
                    windowUrlLi.appendChild(aLink)
                    windowUrlUl.appendChild(windowUrlLi)
                }
                windowUl.appendChild(windowLi)
            }
            li.appendChild(wrapper)
            setListUlElement.appendChild(li)
        }
        // statusListElement.appendChild(newStatus)
    }
    
    
    modal.addEventListener("click", ()=>modalHandler())
    deteletAllBtn.addEventListener("click", ()=> requestDeleteAll())
    loginBtn.addEventListener("click",()=>loginBtnHandler())
    requestGetStatusList()

    port.onMessage.addListener( async (response) => {
        if (response?.task === "getStatusList"){
            statusList = response.data
            displayedStatusList();
        } else if (response?.task === "deleteAll") {
            if (response.result) {
                alert("deleted!")
            } 
        } else if (response?.task === "delete") {
            if (response.result) {
                document.getElementById(response.data.target).remove()
                alert("deleted!")
            } else {
                alert("delete failed")
            }
        }
    });
}