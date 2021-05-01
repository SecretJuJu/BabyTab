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

const getUrlStatus = (ids) => new Promise(resolve => {
    let urlStatus = []
    ids.forEach(async (id,index,array) => {
        let urls = await getUrls(id)
        urlStatus.push(urls)
        if ( index === array.length - 1 ) {
            resolve(urlStatus)
        }
    })
})

const getCurrentStatus = async (windows) => {
    let ids = await getIds(windows)
    let urlStatus = await getUrlStatus(ids)
    return urlStatus
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
    .then(async urlStatus => { // result: status
        // console.log(urlStatus)
        if (urlStatus.result) {
            // new Date() is a key of current url status
            let keyname = "urlStatus_" + new Date().valueOf()
            let result = await saveToStorage(keyname,{urlStatus : urlStatus.currenStatus})
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
    console.log("key : ",key)
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
        if (tmp[0] === "urlStatus"){
            times.push(parseInt(tmp[1]))
        }
    })

    let currentKey = "urlStatus_"+Math.max(...times) // ES6
    return data[currentKey]
}

const setToRecentSet = async (winId,cb) => {
    // close windows without current window
    const recentSet = await getRecentSet()
    const windows = await getWindows()
    const ids = await getIds(windows)
    ids.slice(winId,1)
    ids.forEach(id => {
        console.log("have to remove : ",id)
        chrome.windows.remove(id);
    })
    
    recentSet?.urlStatus?.forEach(urls =>{
        
        chrome.windows.create((win) => {
            urls.forEach(url => {
                chrome.tabs.create({
                    url: url,
                    windowId : win.id
                });
            })
        })
    })
    cb(true)
}

const response = (port,result, task, data) => {
    port.postMessage({result,task,data,port})
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
