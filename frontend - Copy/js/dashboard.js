// ======================================
// Dashboard JavaScript
// ======================================

// Authentication
if (!token) {
    window.location.href = "login.html";
}

// Logged In User
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("userName").textContent = user.name;
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ======================================
// Currency Format
// ======================================

function formatCurrency(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}

// ======================================
// Load Summary
// ======================================

async function loadSummary() {

    try {

        const response = await fetch(`${BASE_URL}/transactions/summary`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        document.getElementById("balance").textContent =
            formatCurrency(data.balance);

        document.getElementById("income").textContent =
            formatCurrency(data.totalIncome);

        document.getElementById("expense").textContent =
            formatCurrency(data.totalExpense);

// ======================================
// Monthly Spending Limit
// ======================================

const profileResponse = await fetch(

    `${BASE_URL}/auth/profile`,

    {

        headers: {

            Authorization: `Bearer ${token}`

        }

    }

);

const profileData = await profileResponse.json();

const budget = Number(profileData.user.monthlyLimit || 0);

if (budget > 0) {

    const spent = data.totalExpense;

    const remaining = budget - spent;

    const percent = (spent / budget) * 100;

    document.getElementById("budget").textContent =
        formatCurrency(budget);

    document.getElementById("budgetStatus").textContent =
        `Spent ${formatCurrency(spent)} | Remaining ${formatCurrency(remaining)}`;

    document.getElementById("budgetPercentage").textContent =
        `${Math.min(percent, 100).toFixed(0)}%`;

    const fill = document.getElementById("budgetFill");

    fill.style.width = `${Math.min(percent,100)}%`;

    if (percent <= 50) {

        fill.style.background = "#22C55E";

    }

    else if (percent <= 80) {

        fill.style.background = "#F59E0B";

    }

    else {

        fill.style.background = "#EF4444";

    }

}
else {

    document.getElementById("budget").textContent = "Not Set";

    document.getElementById("budgetStatus").textContent =
        "Go to Settings and set a monthly spending limit.";

    document.getElementById("budgetPercentage").textContent = "0%";

    document.getElementById("budgetFill").style.width = "0%";

}
    }

    catch(error){

        console.log(error);

    }

}

// ======================================
// Recent Transactions
// ======================================

async function loadRecentTransactions(){

    try{

        const response=await fetch(
            `${BASE_URL}/transactions/recent`,
            {

                headers:{
                    Authorization:`Bearer ${token}`
                }

            });

        const transactions=await response.json();

        const table=document.getElementById("recentTransactionTable");

        table.innerHTML="";

        if(transactions.length===0){

            table.innerHTML=`

            <tr>

            <td colspan="5"
            style="text-align:center;padding:30px;color:#64748B;">

            No Transactions Found

            </td>

            </tr>

            `;

            return;

        }

        transactions.forEach(transaction=>{

            table.innerHTML+=`

            <tr>

            <td>${transaction.title}</td>

            <td>${transaction.category}</td>

            <td>${formatCurrency(transaction.amount)}</td>

            <td>${transaction.type}</td>

            <td>${new Date(transaction.date).toLocaleDateString()}</td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

// ======================================
// Financial Overview Chart
// ======================================

let financialChart;

async function drawFinancialChart(){

    try{

        const response=await fetch(

            `${BASE_URL}/transactions/financial-overview`,

            {

                headers:{
                    Authorization:`Bearer ${token}`
                }

            }

        );

        const data=await response.json();

        const ctx=document.getElementById("financialChart");

        if(financialChart){

            financialChart.destroy();

        }

        financialChart=new Chart(ctx,{

            type:"bar",

            data:{

                labels:[
                    "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"
                ],

                datasets:[

                    {

                        label:"Income",

                        data:data.income,

                        backgroundColor:"#10B981"

                    },

                    {

                        label:"Expense",

                        data:data.expense,

                        backgroundColor:"#EF4444"

                    }

                ]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"top"

                    }

                }

            }

        });

    }

    catch(error){

        console.log(error);

    }

}

// ======================================
// Load Dashboard
// ======================================

loadSummary();

loadRecentTransactions();

drawFinancialChart();