/**check balance
deposit
widthraw 
viewtransaction
Exit */
import {ref, set, push, remove, onValue, getDB, get} from "./fireBaseConfig.js"
const refer = ref(getDB, "accounts")

const pinSubmit= document.getElementById("pin-btn")
const pinVal = document.getElementById("pin-val")
const pinField = document.getElementById("pin-field")
const pinMessage = document.getElementById('message')

let pins = []
let currentPin
let attempts = 3

//fetch the dbValue
onValue(refer, async(ss)=>{
    try{
        const snapshot = await ss.val()
        pins = Object.keys(snapshot.pins)  //set the pins into the pins object literals
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


pinSubmit.addEventListener("click", function (e){
    const pinToCheck = pinVal.value

    //iterate through all the pin value, then check if pinToCheck === anyPins
    const pinExist = pins.find((e) => {
        return pinToCheck == e
    })

    if (pinExist){
        currentPin = pinToCheck
        pinField.style.display = "none"
    }

    //prints the number of attempts if pin goes wrong. if 0, wait for 30 sec
    else{
        if(attempts > 0){
            console.log(attempts)
            pinMessage.textContent = `You only have ${attempts} attempts left`
            attempts = attempts - 1
        }
        else if (attempts == 0){
            this.disabled = true
            let seconds = 3

            let interval = setInterval(()=>{
                pinMessage.textContent = `You dont have any attempts, wait for ${seconds} `
                seconds --
                if( seconds < 0 ){
                    pinMessage.textContent = ""
                    clearInterval(interval)
                    this.disabled = false
                    seconds = 30
                } 
            }, 1000)
        }
    }
})
