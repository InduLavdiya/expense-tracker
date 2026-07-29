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
// Modal
// ==========================================

const modal = document.getElementById("transactionModal");

const addTransactionBtn = document.getElementById("addTransactionBtn");

const closeModal = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

addTransactionBtn.addEventListener("click", () => {

    editTransactionId = null;

    document.querySelector(".modal-content h2").textContent =
        "Add Transaction";

    transactionForm.reset();

    document.getElementById("date").valueAsDate = new Date();

    document.querySelector(".modal-content h2").textContent =
    "Edit Transaction";

    modal.classList.add("show");

});

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});

cancelBtn.addEventListener("click", () => {

    modal.classList.remove("show");

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

});

// ==========================================
// Edit Mode
// ==========================================

let editTransactionId = null;

// ==========================================
// Categories
// ==========================================

const incomeCategories = [

    "Salary",
    "Business",
    "Freelance",
    "Investments",
    "Rental Income",
    "Interest",
    "Bonus",
    "Gift",
    "Other"

];

const expenseCategories = [

    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Fuel",
    "Groceries",
    "Rent",
    "Mobile Recharge",
    "Internet",
    "Insurance",
    "EMI",
    "Other"

];

const typeSelect = document.getElementById("type");

const categorySelect = document.getElementById("category");

typeSelect.addEventListener("change", () => {

    categorySelect.innerHTML =
        `<option value="">Select Category</option>`;

    const list =
        typeSelect.value === "Income"
            ? incomeCategories
            : expenseCategories;

    list.forEach(category => {

        categorySelect.innerHTML +=
        `<option value="${category}">
            ${category}
        </option>`;

    });

});


// ==========================================
// Add Transaction
// ==========================================

const transactionForm = document.getElementById("transactionForm");

transactionForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();

    const amount = document.getElementById("amount").value;

    const type = document.getElementById("type").value;

    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    try {

       const url = editTransactionId
    ? `${BASE_URL}/transactions/${editTransactionId}`
    : `${BASE_URL}/transactions`;

const method = editTransactionId
    ? "PUT"
    : "POST";

const response = await fetch(url, {

    method,

    headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    },

    body: JSON.stringify({

        title,
        amount,
        type,
        category,
        date

    })

});

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Transaction Added Successfully!");

        transactionForm.reset();

        editTransactionId = null;

        modal.classList.remove("show");

        loadTransactions();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});

// ==========================================
// Load Transactions
// ==========================================

async function loadTransactions() {

    try {

        const response = await fetch(`${BASE_URL}/transactions`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const transactions = await response.json();

        const table = document.getElementById("transactionTable");

        table.innerHTML = "";

        if (transactions.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="6" style="text-align:center;padding:40px;">

                        No Transactions Found

                    </td>

                </tr>

            `;

            return;

        }

        transactions.forEach(transaction => {

            table.innerHTML += `

                <tr>

                    <td>${transaction.title}</td>

                    <td>${transaction.category}</td>

                    <td style="font-weight:600;color:${
                        transaction.type === "Income"
                        ? "#16A34A"
                        : "#DC2626"
                    }">

                        ${transaction.type === "Income" ? "+" : "-"}₹${transaction.amount}

                    </td>

                    <td>

                        <span class="${
                            transaction.type === "Income"
                            ? "income-badge"
                            : "expense-badge"
                        }">

                            ${transaction.type}

                        </span>

                    </td>

                    <td>

                        ${new Date(transaction.date).toLocaleDateString("en-IN")}

                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            data-id="${transaction._id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            class="delete-btn"
                            data-id="${transaction._id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

loadTransactions();


// ==========================================
// Delete Transaction
// ==========================================

async function deleteTransaction(id) {

    const confirmDelete = confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${BASE_URL}/transactions/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Transaction Deleted Successfully!");

        loadTransactions();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

}

// ==========================================
// Delete Button Click
// ==========================================

document.addEventListener("click", (e) => {

    const deleteBtn = e.target.closest(".delete-btn");

    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;

    deleteTransaction(id);

});


// ==========================================
// Edit Transaction
// ==========================================

document.addEventListener("click", async (e) => {

    const editBtn = e.target.closest(".edit-btn");

    if (!editBtn) return;

    const id = editBtn.dataset.id;

    try {

        const response = await fetch(`${BASE_URL}/transactions`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const transactions = await response.json();

        const transaction = transactions.find(t => t._id === id);

        if (!transaction) return;

        editTransactionId = id;

        document.getElementById("title").value = transaction.title;

        document.getElementById("amount").value = transaction.amount;

        document.getElementById("type").value = transaction.type;

        // Trigger category loading
        typeSelect.dispatchEvent(new Event("change"));

        document.getElementById("category").value = transaction.category;

        document.getElementById("date").value =
            transaction.date.substring(0,10);


            document.querySelector(".modal-content h2").textContent =
    "Edit Transaction";
        modal.classList.add("show");

    }

    catch(error){

        console.log(error);

    }

});


// ==========================================
// Search Transactions
// ==========================================

document.getElementById("searchInput").addEventListener("input", function () {

    const search = this.value.toLowerCase();

    const rows = document.querySelectorAll("#transactionTable tr");

    rows.forEach(row => {

        const title = row.cells[0]?.textContent.toLowerCase();

        if (!title) return;

        if (title.includes(search)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});

// ==========================================
// Type Filter
// ==========================================

document.getElementById("typeFilter").addEventListener("change", function () {

    const value = this.value;

    const rows = document.querySelectorAll("#transactionTable tr");

    rows.forEach(row => {

        const type = row.cells[3]?.textContent.trim();

        if (!type) return;

        if (value === "" || type === value) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});
// ==========================================
// Category Filter
// ==========================================

document.getElementById("categoryFilter").addEventListener("change", function () {

    const value = this.value;

    const rows = document.querySelectorAll("#transactionTable tr");

    rows.forEach(row => {

        const category = row.cells[1]?.textContent.trim();

        if (!category) return;

        if (value === "" || category === value) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});