import Thread = require("worker_threads");
import EventEmitter = require('events');
import wss = require('../websockets/websockets')

let events = new Map<string,EventEmitter>()

const postToWorker = async (worker:string, data:sbt.workerData) => {
    return new Promise<sbt.workerData>(resolve =>{
        let emitter = new EventEmitter()
        emitter.once('data', (result)=>{
            events.delete(data.id)
            resolve(result)
        })
        events.set(data.id, emitter)
        if(worker === "update") updateWorker.postMessage(data)
        if(worker === "shop") shopWorker.postMessage(data)
    })
}

const createDefaultThread = (file:string, fn:()=>Thread.Worker) => {
    let thread = new Thread.Worker(`./server-modules/workers/${file}`);
    thread.on("error", (err:Error) => {
        console.error(err);
    });

    thread.on("exit", (exitCode:number) => {
        console.log(exitCode);
        fn()
    })
    return thread
}

function spawnUpdateWorker() {
    let thread = createDefaultThread('updateWorker.js', spawnUpdateWorker);
    thread.on("message", (result:sbt.workerData) => {
        if (result.type === "socket" && result.socket) {
            console.log("worker socket post!")
            wss.sendMessage(result.id, result.msg, result.socket)
            return
        }
        events.get(result.id)?.emit("data", result)
    });
    return thread
}
let updateWorker:Thread.Worker = spawnUpdateWorker()

function spawnShopWorker() {
    let thread = createDefaultThread('shopWorker.js',spawnUpdateWorker);
    thread.on("message", (result:sbt.workerData) => {
        events.get(result.id)?.emit('data', result)
    });
    return thread
}
let shopWorker:Thread.Worker = spawnShopWorker()

export = {postToWorker}
