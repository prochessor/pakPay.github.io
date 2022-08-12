"use strict"
//variables
let currentDate = document.querySelector(".date");
let inputUsername = document.querySelector(".username");
let inputPassword = document.querySelector(".password");
let loginBtn = document.querySelector("button");
let invalidMsg = document.createElement("p");
let loginInputs = document.querySelectorAll(".login-contents input");
let loginForm = document.querySelector(".login-form");
let app = document.querySelector(".application");
let signUpBtn = document.querySelector(".sign-up");
let movementsContainer = document.querySelector(".movements")
let accountUsername = document.querySelector(".account-username");
let accountBalance = document.querySelector(".current-balance");
let currentAccount;
let accounts = [];
let transactionType = "Deposit";
let totalProfit = document.querySelector(".totalProfit");
let totalLoss = document.querySelector(".totalLoss");
let totalLoan = document.querySelector(".totalLoan");
let timer = document.querySelector(".logout-timer span")
//functions
function getAccountStrict(username, password) {
    return accounts.find((account) => {
        if (account.username === username && account.password == password)
            return account;
    })
}

function getAccount(username) {
    return accounts.find(account => {
        if (account.username === username) {
            return account;
        }
    });

}

function validateLogin() {
    inputPassword.value = inputPassword.value.trim();
    inputPassword.password = inputUsername.value.trim();
    for (let i = 0; i < inputUsername.value.length; ++i) {
        if (Number(inputUsername.value[i])) {
            invalidMsg.textContent = "Username cannot include number!⛔"
            return false;
        }
    }
    if (inputUsername.value == "" || inputPassword.value == "") {
        invalidMsg.textContent = "Invalid username or password!⛔"
        return false;
    }
}

function formatDate(date) {
    return new Intl.DateTimeFormat(navigator.language, {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).format(date)
}

function formatNumber(number) {
    return new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currency: "USD"
    }).format(number);
}

function displayMovements(account) {
    displayAccountDetails(account);
    movementsContainer.innerHTML = "";
    account.movements.forEach(mov => {
        let type = (mov.amount > 0) ? "deposit" : "withdraw";
        let html = `<div class="movement-row ${type}">
                        <div class="icon-movement">${type}</div>
                        <div class="date-movement">${formatDate(mov.date)}</div>
                        <div class = "movement-amount" > ${formatNumber(Math.abs(mov.amount))} </div>
                    </div>`;
        movementsContainer.insertAdjacentHTML("afterbegin", html)
    });
}

function displayAccountDetails(account) {
    let deposits = account.movements.reduce((acc, value) => {
        if (value.amount > 0) {
            return acc + value.amount;
        }
        return acc;

    }, 0)
    let withdraws = account.movements.reduce((acc, value) => {
        if (value.amount < 0) {
            return acc - value.amount;
        }
        return acc;
    }, 0)
    totalProfit.textContent = formatNumber(deposits);
    totalLoss.textContent = formatNumber(Math.abs(withdraws));
    totalLoan.textContent = formatNumber(account.loan);
}

function startTimer() {
    let formatTime = (int) => new Intl.NumberFormat(navigator.language, {
        minimumIntegerDigits: "2"
    }).format(int)

    let min = 3;
    let sec = 0;
    let time = setInterval(() => {
        if (sec == 0) {
            sec = 60;
            min--;
        } else
            sec--;
        if (min < 0) {
            clearInterval(time);
            controlLogOut();
        }
        timer.textContent = `${formatTime(min)}:${formatTime(sec)}`

    }, 10000)
}

function displayAccount(account) {
    //format date and time 
    startTimer();
    setTimeout(() => {
        if (account.requests != "none") {
            alert(account.requests);
            account.requests = "none";
        }
    }, 1000)

    currentDate.textContent = new Intl.DateTimeFormat(navigator.language, {
        weekday: "long",
        hour: "2-digit",
        minute: "numeric",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    accountUsername.textContent = account.username;
    accountBalance.textContent = formatNumber(account.totalBalance);
    displayMovements(account);
}

function controlLogOut() {
    app.style.transform = "translate(-4000px)"
    loginForm.style.transform = "translate(0px) translate(-50%,-50%)"

}

//Event handlers
loginBtn.addEventListener("click", function () {
    //guard
    if (validateLogin() == false) {
        loginForm.insertAdjacentElement("afterbegin", invalidMsg);
        inputPassword.value = inputUsername.value = '';
        return;
    }
    //if the user exists
    let account = getAccountStrict(inputUsername.value, inputPassword.value);
    if (account) {
        //make the account page visible
        loginForm.style.transform = "translate(-4000px)"
        app.style.transform = "translate(0px) "
        currentAccount = account;
        console.log(currentAccount);
        displayAccount(account);


    } else {
        invalidMsg.textContent = "Invalid username or password!⛔";
        loginForm.insertAdjacentElement("afterbegin", invalidMsg);

    }
    inputPassword.value = inputUsername.value = '';

})
loginInputs.forEach((inp) => {
    inp.addEventListener("click", function () {
        let childs = [...loginForm.children];
        let bool = childs.some((child) => {
            return child === invalidMsg;
        })
        if (bool)
            loginForm.removeChild(invalidMsg);
    })

})
signUpBtn.addEventListener("click", function () {
    if (validateLogin() == false) {
        loginForm.insertAdjacentElement("afterbegin", invalidMsg);
        inputPassword.value = inputUsername.value = '';
        return;
    }
    let account = getAccount(inputUsername.value);
    if (account) {
        invalidMsg.textContent = "Username taken try another one!⛔"
        loginForm.insertAdjacentElement("afterbegin", invalidMsg);
    } else {
        accounts.push({
            username: inputUsername.value,
            password: inputPassword.value,
            totalBalance: 100,
            loan: 0,
            movements: [{
                amount: 100,
                date: new Date()
            }],
            requests: "none"
        });
        loginForm.style.transform = "translate(-4000px)"
        app.style.transform = "translate(0px)"
        currentAccount = accounts.at(-1);

        displayAccount(accounts.at(-1));
    }
    inputPassword.value = inputUsername.value = '';
    // inputPassword.value = inputUsername.value = '';
    // loginForm.style.transform = "translate(-4000px)"
    // app.style.transform = "translate(0px)"
})
document.querySelector(".transfer-btn").addEventListener("click", function () {
    let transferUsername = document.querySelector(".transfer-user");
    let transferAmount = document.querySelector(".transfer-amount");
    transferUsername.value = transferUsername.value.trim()
    if (transferAmount.value > 0) {
        let transferAccount = getAccount(transferUsername.value)
        if (transferAccount && (transferAccount != currentAccount)) {
            if (transferAmount.value <= currentAccount.totalBalance) {
                transferAccount.totalBalance += Number(transferAmount.value);
                alert("Succeed Transaction!");
                transferAccount.movements.push({
                    amount: +transferAmount.value,
                    date: new Date()
                })
                transferAccount.loan += +transferAmount.value;
                currentAccount.totalBalance -= Number(transferAmount.value);
                currentAccount.movements.push({
                    amount: -(transferAmount.value),
                    date: new Date()
                });
                displayAccount(currentAccount);
            } else {
                alert("You are sending more money than you have 💀")
            }
        } else {
            alert("Invalid username OR no accout exists of such username")
        }
    } else
        alert("You cannot send negative amount!😐")
    transferUsername.value = transferAmount.value = "";
})
document.querySelector(".logout").addEventListener("click", controlLogOut)
document.querySelector("select").addEventListener("change", function () {
    transactionType = document.querySelector("select").value;
})
document.querySelector(".transact-btn").addEventListener("click", function () {
    let transactAmount = Number(document.querySelector(".transact-amount").value);
    if (transactionType == "Deposit" && transactAmount < 10000) {
        currentAccount.movements.push({
            amount: transactAmount,
            date: new Date()
        })
        currentAccount.totalBalance += transactAmount;
    } else if (transactionType == "Withdraw" && transactAmount <= currentAccount.totalBalance) {
        currentAccount.movements.push({
            amount: -transactAmount,
            date: new Date()
        })
        currentAccount.totalBalance -= transactAmount;

    } else {
        alert("Something went wrong sorry")
    }
    displayAccount(currentAccount);
    document.querySelector(".transact-amount").value = '';

})
document.querySelector(".request-btn").addEventListener("click", function () {
    let reqUsername = document.querySelector(".request-user").value;
    let reqAmount = Number(document.querySelector(".request-amount").value);
    let reqAccount = getAccount(reqUsername)
    if (reqAccount && reqAmount < 10000 && reqAmount > 0) {
        reqAccount.requests = `${currentAccount.username}: Assalam u alikum fellow I wanted a loan of  ${formatNumber(reqAmount)} dollar with no interest! 💖. `;
        alert("Request Sent successfully!")
    } else {
        alert("Sorry no account exists of this username!")
    }
    document.querySelector(".request-user").value = document.querySelector(".request-amount").value = "";
})
document.querySelector(".close-btn").addEventListener("click", function () {
    let closeUser = document.querySelector(".close-user").value;
    let closePass = document.querySelector(".close-pass").value;
    let accountClose = getAccountStrict(closeUser, closePass);
    if (accountClose) {
        let indexOfCloseAccount = accounts.indexOf(accountClose);
        accounts.splice(indexOfCloseAccount, 1);
        alert("All the Money in your account is transfered to your bank safely and your Account is closed!")
    } else {
        alert("Invalid username or password cannot close the account, the account will get logged out for safety reasons");

    }
    controlLogOut();
    document.querySelector(".close-user").value = document.querySelector(".close-pass").value = "";
})
//code
invalidMsg.classList.add("err");