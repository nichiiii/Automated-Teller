
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
const depoField = document.getElementById('deposit-page')

//INTERACTION BUTTONS
const checkBalEnter = document.getElementById('check-balance')
const withdrawEnter = document.getElementById('withdraw')
const transEnter = document.getElementById("deposit")

//CHECK BALANCE ELEMENTS
const dateBalance = document.getElementById('date-balance')
const exitBalanceBtn = document.getElementById('exit-balance-btn')
const balanceAmount = document.getElementById('balance-amount')

//WITHDRAW ELEMENTS
const withdrawInput = document.getElementById('withdraw-input')
const withdrawBth = document.getElementById('withdraw-button')
const withWarning = document.getElementById("withdraw-warning")
const withExit = document.getElementById('exit-withdraw-btn' )
const infoBal = document.getElementById('inform-bal')

//DEPOSIT ELEMENTS
const desposInput = document.getElementById("deposit-input")
const depositBtn = document.getElementById('deposit-btn')
const depositExit = document.getElementById('exit-deposit-btn')

//EXIT
const exitInter = document.getElementById("exit-inter-btn")

let pins = []
let currentPin = 123456
let attempts = 3
let userBalance = 0

onValue(refer, async(ss)=>{
    try{
        const snapshot = await ss.val()
        pins = Object.keys(snapshot.pins) 
    }
    catch(e){
        console.log(e)
    }
})
/**
 * REUSABLE FUNCTIONS
 */

function updateTransac(amount, type){
    const transactPath = `accounts/pins/${currentPin}/transaction`
    const pinPath = `accounts/pins/${currentPin}`

    update(ref(getDB, pinPath), {balance : userBalance})
    push(ref(getDB, transactPath), {
        type : type, 
        amount : amount,
        time : Date()
    })
}
/**
 * PIN SECTION
 *  This area handles pin verfication from the firebase
 */

//restrict user to input non numeric pins
pinVal.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

pinSubmit.addEventListener("click", async function (){
    const pinToCheck = pinVal.value
    const pinExist = pins.find((e) => {
        return pinToCheck == e
    })
    if (pinExist){
        const fetch = await get(refer)
        const data = fetch.val()
        const pinsData = data.pins
        userBalance = pinsData[pinToCheck].balance

        currentPin = pinToCheck
        pinField.style.display = "none"
        interField.style.display = 'flex'
    }
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
 * CHECK-BALANCE 
 */

const dateArr = Date().split(" ");
const monthtoyear = dateArr.splice(0,4)
const normalDate = monthtoyear.join(' ')

dateBalance.textContent = normalDate

checkBalEnter.addEventListener("click", async ()=>{
    console.log(userBalance)
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
 */

withdrawInput.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

withdrawBth.addEventListener('click', ()=>{
    let withAmount = Number(withdrawInput.value)
   
    if(withAmount > userBalance || withAmount < 100){
        const situation = withAmount < 100 ? 
        "Withdraw amount should be greater than 100 Pesos":
        'You dont have enough balance to make this transaction'

        withWarning.textContent = situation
        setTimeout(()=>{
            withWarning.textContent = ''
        }, 6000)
    }else{
        userBalance = userBalance - withAmount
        updateTransac(withAmount, 'withdraw')
        infoBal.textContent = `You have a balance of ₱ ${userBalance}`
    }
})

withdrawEnter.addEventListener('click', ()=>{
    withField.style.display = 'flex'
    interField.style.display = 'none'
    infoBal.textContent = `You have a balance of ${userBalance}`
})

withExit.addEventListener('click', ()=>{
    withField.style.display = 'none'
    interField.style.display = 'flex'
})

/**
 * DEPOSIT
 */

desposInput.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

depositBtn.addEventListener('click', ()=>{
    let depoAmnt = Number(desposInput.value)
    userBalance = userBalance + depoAmnt
    updateTransac(depoAmnt, "deposit")
})

depositExit.addEventListener('click', ()=>{
    depoField.style.display = 'none'
    interField.style.display = 'flex'
})

transEnter.addEventListener('click', ()=>{
     depoField.style.display = 'flex'
    interField.style.display = 'none'
})

/**
 * TRANSACTION
 */




/**
 * EXIT
 */

exitInter.addEventListener('click', ()=>{
    interField.style.display = "none"
    pinField.style.display = 'flex'
})




