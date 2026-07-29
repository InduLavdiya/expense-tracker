// ==========================================
// Authentication
// ==========================================

if (!token) {
    window.location.href = "login.html";
}

// ==========================================
// Logout
// ==========================================

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Chart Variables
// ==========================================

let incomeExpenseChart = null;
let categoryChart = null;

// ==========================================
// Load Report
// ==========================================

async function loadReport() {

    const month = document.getElementById("month").value;

    const year = document.getElementById("year").value;

    try {

        // =========================================
        // Monthly Summary
        // =========================================

        const summaryResponse = await fetch(

            `${BASE_URL}/transactions/monthly-stats?month=${month}&year=${year}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const summary = await summaryResponse.json();

        document.getElementById("reportIncome").textContent =
            `₹${summary.totalIncome}`;

        document.getElementById("reportExpense").textContent =
            `₹${summary.totalExpense}`;

        document.getElementById("reportBalance").textContent =
            `₹${summary.balance}`;

        document.getElementById("reportTransactions").textContent =
            summary.transactions;

        // =========================================
        // Income vs Expense Chart
        // =========================================

        const chartResponse = await fetch(

            `${BASE_URL}/transactions/financial-overview`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const chartData = await chartResponse.json();

        if (incomeExpenseChart) {

            incomeExpenseChart.destroy();

        }

        const ctx = document
            .getElementById("incomeExpenseChart")
            .getContext("2d");

        incomeExpenseChart = new Chart(ctx, {

            type: "line",

            data: {

                labels: [

                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"

                ],

                datasets: [

                    {

                        label: "Income",

                        data: chartData.income,

                        borderColor: "#22C55E",

                        backgroundColor: "#22C55E22",

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false

                    },

                    {

                        label: "Expense",

                        data: chartData.expense,

                        borderColor: "#EF4444",

                        backgroundColor: "#EF444422",

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "top"

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

            // =========================================
        // Expense By Category Chart
        // =========================================

        const transactionResponse = await fetch(

            `${BASE_URL}/transactions`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const transactions = await transactionResponse.json();

        const categoryTotals = {};

        transactions.forEach((transaction) => {

            if (transaction.type === "Expense") {

                if (!categoryTotals[transaction.category]) {

                    categoryTotals[transaction.category] = 0;

                }

                categoryTotals[transaction.category] += transaction.amount;

            }

        });

        const labels = Object.keys(categoryTotals);

        const values = Object.values(categoryTotals);

        if (categoryChart) {

            categoryChart.destroy();

        }

        const ctx2 = document
            .getElementById("categoryChart")
            .getContext("2d");

        categoryChart = new Chart(ctx2, {

            type: "pie",

            data: {

                labels: labels,

                datasets: [

                    {

                        data: values,

                        backgroundColor: [

                            "#4F46E5",
                            "#22C55E",
                            "#EF4444",
                            "#F59E0B",
                            "#06B6D4",
                            "#8B5CF6",
                            "#EC4899",
                            "#14B8A6",
                            "#F97316",
                            "#64748B"

                        ],

                        borderColor: "#ffffff",

                        borderWidth: 2,

                        radius: "85%"

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "right",

                        labels: {

                            padding: 20,

                            boxWidth: 18,

                            font: {

                                size: 14

                            }

                        }

                    }

                }

            }

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Generate Report Button
// ==========================================

document.getElementById("generateReport")
.addEventListener("click", () => {

    loadReport();

});

// ==========================================
// Default Month & Year
// ==========================================

const today = new Date();

document.getElementById("month").value = today.getMonth() + 1;

document.getElementById("year").value = today.getFullYear();

// ==========================================
// Load Report Initially
// ==========================================

loadReport();