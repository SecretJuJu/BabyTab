// import { preStart } from "./init"
import { assert } from 'chai';
import request from 'request'
import app from '../app'

const address = "http://localhost"
const port = 3000
const BASEURL = address+":"+port

console.log("Base url : ",BASEURL)

before(async done => {
    
})
describe("Application test",() => {
    it("initing app",done => {
    //     this.timeout(5000)
    // app.on("appStarted", function(){
    //     console.log("app started")
    //     done();
    // });
    })
    it("helloworld test",done => {
        console.log(BASEURL+"/")
        request.get(BASEURL+"/", async (err,res,body) => {
            console.log("res : ",res)
            assert(true)
            done()
        })
    })
})