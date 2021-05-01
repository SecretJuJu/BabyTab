const pluck = (arrayOfObject, property) => new Promise(resolve => {
    resolve(
        arrayOfObject.map(function (item) {
            return item[property];
        })
    )
})

async function getIds (windows) {
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

const resolveCurrentStatus = (o) => new Promise(resolve => {
    chrome.windows.getAll(o, async (windows) => {
        const currenStatus = await getCurrentStatus(windows)
        resolve({currenStatus,result:true})
    })    
})

const urlSave = async (cb) => {
    resolveCurrentStatus({populate:true})
    .then(async urlStatus => { // result: status
        // console.log(urlStatus)
        if (urlStatus.result) {
            // new Date() is a key of current url status
            let keyname = "urlStatus_" + new Date().valueOf()
            let result = await saveToStorage(keyname,{urlStatus : urlStatus.currenStatus})
            console.log("result : ",result)
            cb(result)
        }
    })
}

const getAllKeysFromStorage = () => {
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        return allKeys
    });
}

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

const response = (port,result, task, data) => {
    port.postMessage({result,task,data})
}

const msgController = async (port) => {
    console.assert(port.name == "messaging");
    port.onMessage.addListener(async (msg) => {
        if (msg.task === "save") {
            urlSave((result) => {
                response(port,result,msg.task)
            })
        }

        if(msg.task === "getRecentSet") {
            getRecentSet(data => {
                response(port,true,msg.task,data)
            })
        }
    })
}

chrome.runtime.onConnect.addListener(msgController);
