
import {ref, set, push, remove, onValue, getDB, get, update} from "./fireBaseConfig.js"
const refer = ref(getDB, "accounts")

//PIN ELEMENTS
const pinSubmit= document.getElementById("pin-btn")
const pinVal = document.getElementById("pin-val")
const pinMessage = document.getElementById('message')

//PAGE CONTAINERS
const pinField = document.getElementById("pin-field")
const interField = document.getElementById("user-interactions")
const balanceField = document.getElementById('check-balance-page')
const withField = document.getElementById('withdraw-page');

//INTERACTION BUTTONS
const checkBalEnter = document.getElementById('check-balance')
const withdrawEnter = document.getElementById('withdraw')

//CHECK BALANCE ELEMENTS
const dateBalance = document.getElementById('date-balance')
const exitBalanceBtn = document.getElementById('exit-balance-btn')
const balanceAmount = document.getElementById('balance-amount')

//WITHDRAW ELEMENTS
const withdrawInput = document.getElementById('withdraw-input')
const withdrawBth = document.getElementById('withdraw-button')
const withWarning = document.getElementById("withdraw-warning")
const withExit = document.getElementById('exit-withdraw-btn' )

//EXIT
const exitInter = document.getElementById("exit-inter-btn")

let pins = []
let accounts = {}
let currentPin = 123456
let attempts = 3
let userBalance = 0

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



/**
 * PIN SECTION
 *  This area handles pin verfication from the firebase
 */

//restrict user to enter non numeric pins
pinVal.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

pinSubmit.addEventListener("click", async function (){
    const pinToCheck = pinVal.value

    //iterate through all the pin value, then check if pinToCheck === anyPins
    const pinExist = pins.find((e) => {
        return pinToCheck == e
    })

    if (pinExist){
        const fetch = await get(refer)
        const data = fetch.val()
        const pinsData = data.pins
        userBalance = pinsData[pinToCheck].balance
        accounts = pinsData

        currentPin = pinToCheck
        pinField.style.display = "none"
        interField.style.display = 'flex'
    }

    //prints the number of attempts if pin goes wrong. if 0, wait for 30 sec
    else{
        if(attempts > 0){
            pinMessage.textContent = `You only have ${attempts} attempts left`
            attempts = attempts - 1
        }
        else if (attempts <= 0){
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

/**
 * CHECK-BALANCE SECTION
 *  display balance
 */
const dateArr = Date().split(" ");
const monthtoyear = dateArr.splice(0,4)
const normalDate = monthtoyear.join(' ')

dateBalance.textContent = normalDate
console.log(normalDate)

checkBalEnter.addEventListener("click", async ()=>{

    
    balanceAmount.innerText = `₱ ${userBalance}`

    interField.style.display = "none"
    balanceField.style.display = 'flex'
})

exitBalanceBtn.addEventListener("click", ()=>{
    interField.style.display = "flex"
    balanceField.style.display = 'none'
})

/**
 * WITHDRAW
 *  Handles withdraw activities and save it to database
 */

withdrawInput.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

withdrawBth.addEventListener('click', ()=>{
    let withAmount = withdrawInput.value
    if(withAmount > userBalance){
        console.log("ayaw")
    }else{
        userBalance = userBalance - withAmount
        console.log(userBalance)
        console.log(withAmount)
        update(ref(getDB, `accounts/pins/${currentPin}/balance`), {balance : userBalance})
    }
})

withdrawEnter.addEventListener('click', ()=>{
    console.log(1)
    withField.style.display = 'flex'
    interField.style.display = 'none'
})

withExit.addEventListener('click', ()=>{
    withField.style.display = 'none'
    interField.style.display = 'flex'
})


/**
 * EXIT
 */
exitInter.addEventListener('click', ()=>{
    interField.style.display = "none"
    pinField.style.display = 'flex'
})




