const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function(){
    window.location.href = "transactions.html"
});
document.getElementById("cash-in-list").addEventListener("click", removeTransaction);
document.getElementById("cash-out-list").addEventListener("click", removeTransaction);

//Lançamentos
document.getElementById("transaction-form").addEventListener("submit", function(e){
    e.preventDefault();
    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    getCashIn();
    getCashOut();
    getTotal();

    alert("Lançamento adicionado com sucesso.");
   
});

checkLogged();

function checkLogged(){
    if(session){
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if(!logged){
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if(dataUser){
        data = JSON.parse(dataUser);
    }

    getCashIn();
    getCashOut();
    getTotal();
}

function logout(){
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function getCashIn(){
    const transactions = data.transactions;

    const cashIn = transactions
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.type === "1");

    if(cashIn.length){
        let cashInHtml = ``;
        const limit = Math.min(cashIn.length, 5);

        for (let index = 0; index < limit; index++) {
            const transaction = cashIn[index];
            cashInHtml += `
                <div class="row mb-4 home-transaction-item">
                    <div class="col-12">
                        <h3 class="home-transaction-value">R$ ${transaction.item.value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${transaction.item.description}</p>
                                </div>
                                <div class="col-12 col-md-4 d-flex justify-content-end align-items-start">
                                    <span>${transaction.item.date}</span>
                                    <button class="btn btn-sm btn-outline-danger ms-2" type="button"
                                        data-transaction-index="${transaction.index}"
                                        aria-label="Remover lançamento: ${transaction.item.description}"
                                        title="Remover lançamento">
                                        <i class="bi bi-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            `
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }else{
        document.getElementById("cash-in-list").innerHTML = "";
    }
}

function getCashOut(){
    const transactions = data.transactions;

    const cashIn = transactions
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.type === "2");

    if(cashIn.length){
        let cashInHtml = ``;
        const limit = Math.min(cashIn.length, 5);

        for (let index = 0; index < limit; index++) {
            const transaction = cashIn[index];
            cashInHtml += `
                <div class="row mb-4 home-transaction-item">
                    <div class="col-12">
                        <h3 class="home-transaction-value">R$ ${transaction.item.value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${transaction.item.description}</p>
                                </div>
                                <div class="col-12 col-md-4 d-flex justify-content-end align-items-start">
                                    <span>${transaction.item.date}</span>
                                    <button class="btn btn-sm btn-outline-danger ms-2" type="button"
                                        data-transaction-index="${transaction.index}"
                                        aria-label="Remover lançamento: ${transaction.item.description}"
                                        title="Remover lançamento">
                                        <i class="bi bi-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            `
        }

        document.getElementById("cash-out-list").innerHTML = cashInHtml;
    }else{
        document.getElementById("cash-out-list").innerHTML = "";
    }
}

function removeTransaction(event){
    const button = event.target.closest("[data-transaction-index]");
    if(!button){
        return;
    }

    const index = Number(button.dataset.transactionIndex);
    data.transactions.splice(index, 1);
    saveData(data);
    getCashIn();
    getCashOut();
    getTotal();
}

function getTotal(){
    const transactions = data.transactions;
    let total = 0;

    transactions.forEach((item) => {
        if(item.type === "1"){
            total += item.value;
        }else{
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML =  `R$ ${total.toFixed(2)}`;
}

function saveData(data){
    localStorage.setItem(data.login, JSON.stringify(data));        
}
