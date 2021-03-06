'ues strict'

const pluck = (arrayOfObject,property) => new Promise(resolve => {
    resolve(
        arrayOfObject.map(function (item) {
            return item[property];
        })
    )
})
class ChromeApis {
    static getWindows = (o) => new Promise(resolve => {
        chrome.windows.getAll(o, async (windows) => {
            resolve(windows)
        })
    })
    static getCurrentWindow = () => new Promise(resolve => {
        chrome.windows.getCurrent((w) => {
            resolve(w.id)
        });
    })
    static getAllFromStorage = () => new Promise(resolve =>{
        chrome.storage.local.get(null, function(items) {
            resolve(items);
        })
    })
    static getFromStorage = (key) => new Promise(resolve =>{
        chrome.storage.local.get([key], function(result) {
            resolve(result);
        });
    })
    static saveToStorage = (key,data) => new Promise ( resolve => {
        try { 
            chrome.storage.local.set({[key]: data}, () => {
                console.log("key",key);
                console.log("data",data);
                resolve(true)
            });
        } catch (err) {
            resolve(false)
        }
    })
    static removeAllLocal = () => new Promise( resolve => {
        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
            resolve(true)
        });
    })
    static removeOneLocal = (target) => new Promise( resolve => {
        chrome.storage.local.remove(target, () => {
            resolve(true)
        })
    })
    static createTab = (options) => {
        chrome.tabs.create(options)
    }
    static createWindow = (options,cb) => {
        chrome.windows.create(options,(win) => {
            cb(win)
        })
    }
    
}
class Save {
    static getUrls = (id) => new Promise( resolve => {
        chrome.tabs.getAllInWindow(id,( async (tabs) => {
            let urls = await pluck(tabs,'url')
            resolve(urls)
        }))
    })
    static getOptions = (id) => new Promise( resolve => {
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
    static getStatus = (ids) => new Promise(resolve => {
        let status = []
        ids.forEach(async (id,index,array) => {
            let urls = await this.getUrls(id)
            let options = await this.getOptions(id)
            status.push({urls,options})
            if ( index === array.length - 1 ) {
                resolve(status)
            }
        })
    })
    static getCurrentStatus = async (windows) => {
        let ids = await pluck(windows,'id')
        let status = await this.getStatus(ids)
        return status
    }
    static getCurrentStatus = async (windows) => {
        let ids = await pluck(windows,'id')
        let status = await this.getStatus(ids)
        return status
    }
    
}

const getCurrentStatus = () => new Promise(resolve => {
    ChromeApis.getWindows({populate:true})
    .then(async windows => {
        const currenStatus = await ChromeApis.getCurrentStatus(windows)
        resolve({currenStatus,result:true})
    })
})

const saveStatus = async (statusName) => {
    const windows = await ChromeApis.getWindows({populate:true})
    const currentStatus = await Save.getCurrentStatus(windows)
    const date = new Date()
    let keyname = "status_" + date.valueOf()
    
    let result = await ChromeApis.saveToStorage(keyname,{
        name:statusName,
        status : currentStatus,
        createdAt: date.toString()
    })
    return result
}

const getAllStatus = async () => {
    const data = await ChromeApis.getAllFromStorage() // list
    console.log(data)
    // console.log("Data : ",data)
    if (data === null) {
        cb(false)
        return
    }
    let keys = Object.keys(data)
    keys.forEach( e => {
        let tmp = e.split('_')
        if (tmp[0] !== "status"){
            delete data[e]
        }
    })
    return data
}

const getRecentSet = async () => {
    const data = await getAllStatus() // list
    if (data === null) {
        cb(false)
        return
    }
    let keys = Object.keys(data)
    let times = []
    keys.forEach( e => {
        let tmp = e.split('_')
        times.push(parseInt(tmp[1]))
    })

    let currentKey = "status_"+Math.max(...times) // ES6
    return data[currentKey]
}

const setRecentStatus = async (winId) => {
    // close windows without current window
    const recentSet = await getRecentSet()
    
    console.log("recent set : " + recentSet)
    if (!recentSet) {
        return false
    }
    setStatus(winId,"",recentSet)
}

const setStatus = async (winId,statusKey,status=undefined) => {
    console.log("win id : " + winId)
    const windows = await ChromeApis.getWindows()
    const ids = await pluck(windows,'id')
    console.log("removing sender's id")
    console.log(ids)
    await ids.slice(winId,1)
    console.log(ids)
    ids.forEach(id => {
        chrome.windows.remove(id);
    })
    if (status === undefined) {
        status = await ChromeApis.getFromStorage(statusKey)
        status = status[statusKey]
    }
    console.log(status)
    status?.status?.forEach(status =>{
        // open first url when the window created
        Object.assign(status.options,{url : status.urls[0]})
        ChromeApis.createWindow(status.option,(win) => {
            for (let i=1; i < status.urls.length; i++) {
                ChromeApis.createTab({url:status.urls[i], windowId:win.id})
            }
        })
    })
    return true
}

const removeOne = async (target) => {
    await ChromeApis.removeOneLocal(target)
    return true
}

const response = (port,result, task, data) => {
    console.log("response")
    port.postMessage({result,task,data})
}

const msgController = async (port) => {
    console.assert(port.name == "messaging");
    port.onMessage.addListener(async (msg) => {
        if (msg.task === "save") {
            const result = await saveStatus(msg.name)
            response(port,result,msg.task)
        }

        if(msg.task === "setRecentStatus") {
            const result = await setRecentStatus(msg.winId)
            response(port,result,msg.task)
        }
        
        if(msg.task === "setStatus") {
            const result = await setStatus(msg.winId,msg.target) // statusKey : status_1231231
            response(port,result,msg.task)
        }

        if(msg.task === "getStatusList") {
            const statusList = await getAllStatus()
            response(port,true,msg.task,statusList)
        }

        if(msg.task === "deleteAll") {
            console.log("delete all")
            const result = await ChromeApis.removeAllLocal()
            response(port,result,msg.task)
        }

        if (msg.task === "delete") {
            const result = removeOne(msg.target)
            response(port,result,msg.task,{target:msg.target})
        }
    })
}

chrome.runtime.onConnect.addListener(msgController)
