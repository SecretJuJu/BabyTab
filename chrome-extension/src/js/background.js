'ues strict'

const pluck = (arrayOfObject, property) => new Promise(resolve => {
    resolve(
        arrayOfObject.map(function (item) {
            return item[property];
        })
    )
})

const getIds = async (windows) => {
    let ids = await pluck(windows,'id')
    return ids
}

const getUrls = (id) => new Promise( resolve => {
    chrome.tabs.getAllInWindow(id,( async (tabs) => {
        let urls = await pluck(tabs,'url')
        resolve(urls)
    }))
})

const getOptions = (id) => new Promise( resolve => {
    chrome.windows.get(id,(win)=>{
        let options = {
            height : win.height,
            incognito : win.incognito,
            left : win.left,
            state : win.state,
            top : win.top,
            type : win.type,
            width : win.width
        }
        resolve(options)
    })
})


const getStatus = (ids) => new Promise(resolve => {
    let status = []
    ids.forEach(async (id,index,array) => {
        let urls = await getUrls(id)
        let options = await getOptions(id)
        status.push({urls,options})
        if ( index === array.length - 1 ) {
            resolve(status)
        }
    })
})

const getCurrentStatus = async (windows) => {
    let ids = await getIds(windows)
    let status = await getStatus(ids)
    return status
}

const getWindows = (o) => new Promise(resolve => {
    chrome.windows.getAll(o, async (windows) => {
        resolve(windows)
    })
})

const getCurrentWindow = () => new Promise(resolve => {
    chrome.windows.getCurrent(function(w) {
        resolve(w.id)
    });
})

const resolveCurrentStatus = () => new Promise(resolve => {
    getWindows({populate:true})
    .then(async windows => {
        const currenStatus = await getCurrentStatus(windows)
        resolve({currenStatus,result:true})
    })
})

const saveUrl = async (cb) => {
    resolveCurrentStatus()
    .then(async status => { // result: status
        // console.log(urlStatus)
        if (status.result) {
            // new Date() is a key of current url status
            let keyname = "status_" + new Date().valueOf()
            let result = await saveToStorage(keyname,{status : status.currenStatus})
            cb(result)
        }
    })
}

const getAllFromStorage = () => new Promise(resolve =>{
    chrome.storage.local.get(null, function(items) {
        resolve(items);
    })
})

const getFromStorage = (key) => {
    chrome.storage.local.get([key], function(result) {
        console.log(result);
    });
}

const saveToStorage = (key,data) => new Promise ( resolve => {
    try { 
        chrome.storage.local.set({[key]: data}, () => {
            resolve(true)
        });
    } catch (err) {
        resolve(false)
    }
})

const getRecentSet = async () => {
    const data = await getAllFromStorage() // list
    if (data === null) {
        cb(false)
        return
    }
    let keys = Object.keys(data)
    let times = []
    keys.forEach( e => {
        let tmp = e.split('_')
        if (tmp[0] === "status"){
            times.push(parseInt(tmp[1]))
        }
    })

    let currentKey = "status_"+Math.max(...times) // ES6
    return data[currentKey]
}
const createTab = (options) => {
    chrome.tabs.create(options)
}
const setToRecentSet = async (winId,cb) => {
    // close windows without current window
    const recentSet = await getRecentSet()
    const windows = await getWindows()
    const ids = await getIds(windows)
    ids.slice(winId,1)
    
    ids.forEach(id => {
        chrome.windows.remove(id);
    })
    

    recentSet?.status?.forEach(status =>{
        // open first url when the window created
        Object.assign(status.options,{url : status.urls[0]})
        chrome.windows.create(status.options,(win) => {
            for (let i=1; i < status.urls.length; i++) {
                createTab({url:status.urls[i], windowId:win.id})
            }
        })
    })
    cb(true)
}

const response = (port,result, task, data) => {
    port.postMessage({result,task,data})
}

const msgController = async (port) => {
    console.assert(port.name == "messaging");
    port.onMessage.addListener(async (msg) => {
        if (msg.task === "save") {
            saveUrl((result) => {
                response(port,result,msg.task)
            })
        }

        if(msg.task === "getRecentSet") {
            setToRecentSet(msg.winId,data => {
                response(port,true,msg.task,data)
            })
        }
    })
}

chrome.runtime.onConnect.addListener(msgController);
