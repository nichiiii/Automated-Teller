/**check balance
deposit
widthraw 
viewtransaction
Exit */
import {ref, set, push, remove, onValue, getDB, get} from "./fireBaseConfig.js"
const refer = ref(getDB, "accounts")

const pinSubmit= document.getElementById("pin-btn")
const pinVal = document.getElementById("pin-val")
let pins = []

//fetch the dbValue
onValue(refer, async(ss)=>{
    try{
        const snapshot = await ss.val()
        //set the pins into the pins object literals
        pins = Object.keys(snapshot.pins)
        console.log(pins)
    }
    catch(e){
        console.log(e)
    }
})

//restrict user to enter non numeric pins
pinVal.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})


pinSubmit.addEventListener("click", ()=>{
    const pinToCheck = pinVal.value
    const pinExist = pins.find((e) => {
        return pinToCheck == e
    })

    if (pinExist){
        console.log("exists")
    }else{
        console.log("not found")
    }
})
