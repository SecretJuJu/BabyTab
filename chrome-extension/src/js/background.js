const pluck = (arrayOfObject, property) => {
    return arrayOfObject.map(function (item) {
      return item[property];
    });
};

async function getIds (windows) {
    return pluck(windows,'id')
}

const getUrlStatus = async(ids) => {
    let urlStatus = []
    ids.forEach((id,index,array) => {
        chrome.tabs.getAllInWindow(id,(tabs => {
            urlStatus.push(pluck(tabs,'url'))
        }))
    })
    return urlStatus 
}


const getCurrentStatus = async (windows)=>{
    let ids = await getIds(windows)
    let urlStatus = await getUrlStatus(ids)
    return urlStatus
}

const resolveCurrentStatus = (o) => new Promise(resolve => {
    chrome.windows.getAll(o, async (windows) => {
        const currenStatus = await getCurrentStatus(windows)
        resolve(currenStatus)
    })    
})

// const getAllWindows = async () => {
//     chrome.windows.getAll({populate: true},(data) => {return data})
// }

const save = () => new Promise(resolve => {
    resolveCurrentStatus({populate:true})
    .then(result => { // result: status
        resolve(result)
    })
})

const msgController = async (port) => {
    console.assert(port.name == "messaging");
    port.onMessage.addListener(async (msg) => {
        if (msg.task === "save") {
            save().then(urlStatus => {
                console.log("urlStatus ",urlStatus)
                // getting url status

                port.postMessage({result:true,task:"saveResponse"});
            }).catch(err => {
                port.postMessage({result:false});
            })
            
        }
    })
}

chrome.runtime.onConnect.addListener(msgController);
