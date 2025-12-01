
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
const depoEnter = document.getElementById("deposit")
const transEnter = document.getElementById('transaction')

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

//TRANSACTION ELEMENTS
const transSection = document.getElementById("transaction-section");
let transTable = document.getElementById("transaction-table");
const transacExit = document.getElementById('transac-exit');

//EXIT
const exitInter = document.getElementById("exit-inter-btn")

let pins = []
let currentUserInfo
let attempts = 3

const dateArr = Date().split(" ");
const monthtoyear = dateArr.splice(0,4)
const normalDate = monthtoyear.join(' ')

onValue(refer, async(ss)=>{
    try{
        const snapshot = await ss.val()
        pins = Object.entries(snapshot.pins)
    }
    catch(e){
        console.log(e)
    }
})
/**
 * REUSABLE FUNCTIONS
 */
function addTransac(amount, type){
    const currentPin = currentUserInfo[0]
    const transactPath = `accounts/pins/${currentPin}/transaction`
    const pinPath = `accounts/pins/${currentPin}`
    const userBal= currentUserInfo[1].balance
   
    update(ref(getDB, pinPath), {balance : userBal})
    push(ref(getDB, transactPath), {
        type : type, 
        amount : amount,
        time : normalDate 
    })
}

async function takeCurrentAccount(curPin){
     const currAcc = pins.find((e)=>{
        curPin == e[0]
     })
}
/**
 * PIN SECTION
 */
//restrict user to input non numeric pins
pinVal.addEventListener('input', function(){
    let value = this.value;
    this.value = value.replace(/\D/g, '');
})

pinSubmit.addEventListener("click", async function (){
    const pinToCheck = pinVal.value
    const pinExist = pins.find((e) => {
        if(pinToCheck == e[0]){
            currentUserInfo = e
            return true
        }
    })

    if (pinExist){
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
            let seconds = 30
            attempts = 3
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
dateBalance.textContent = normalDate

checkBalEnter.addEventListener("click", async ()=>{
    balanceAmount.innerText = `₱ ${currentUserInfo[1].balance}`

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
    let userBal = currentUserInfo[1].balance
   
    if(withAmount > userBal|| withAmount < 100){
        const situation = withAmount < 100 ? 
        "Withdraw amount should be greater than 100 Pesos":
        'You dont have enough balance to make this transaction'

        withWarning.textContent = situation
        setTimeout(()=>{
            withWarning.textContent = ''
        }, 6000)
    }else{
        currentUserInfo[1].balance = userBal - withAmount
        addTransac(withAmount, 'withdraw')
        infoBal.textContent = `You have a balance of ₱ ${currentUserInfo[1].balance}`
    }
})

withdrawEnter.addEventListener('click', ()=>{
    withField.style.display = 'flex'
    interField.style.display = 'none'
    infoBal.textContent = `You have a balance of ₱ ${currentUserInfo[1].balance}`
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
    if(currentUserInfo[1].balance < 100000){
        currentUserInfo[1].balance += depoAmnt
        addTransac(depoAmnt, "deposit")
    }
})

depositExit.addEventListener('click', ()=>{
    depoField.style.display = 'none'
    interField.style.display = 'flex'
})

depoEnter.addEventListener('click', ()=>{
    depoField.style.display = 'flex'
    interField.style.display = 'none'
})

/**
 * TRANSACTION
 */
transEnter.addEventListener('click', async()=>{
    const pin = currentUserInfo[0]
    console.log(pin)
    let path = `accounts/pins/${pin}/transaction`
    let fetch = await get(ref(getDB, path))
    let data = fetch.val()
    let transacArr = data ? Object.entries(data) : false

    let tableData = ""
    if(transacArr){
        transacArr.forEach((e)=>{
            tableData += `
            <tr>
                <td>${e[1].time}</td>
                <td>${e[1].amount}</td>
                <td>${e[1].type}</td>
            </tr>`
        })
    }
    transTable.innerHTML += tableData
    transSection.style.display = "flex"
    interField.style.display = 'none'
})

transacExit.addEventListener('click', async()=>{
    transTable.innerHTML = `    
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                    </tr>`
    transSection.style.display = "none"
    interField.style.display = 'flex'
})

/**
 * EXIT
 */
exitInter.addEventListener('click', ()=>{
    interField.style.display = "none"
    pinField.style.display = 'flex'
})



