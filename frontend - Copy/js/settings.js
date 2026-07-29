// ==========================================
// Authentication
// ==========================================

if (!token) {

    window.location.href = "login.html";

}

// ==========================================
// Logout
// ==========================================

document.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Load User Details
// ==========================================

const user = JSON.parse(localStorage.getItem("user"));

if (user) {

    document.getElementById("name").value = user.name;

    document.getElementById("email").value = user.email;

    document.getElementById("spendingLimit").value =
        user.monthlyLimit || "";

}

// ==========================================
// Update Profile
// ==========================================

const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    try {

        const response = await fetch(`${BASE_URL}/auth/profile`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                name

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Profile Updated Successfully!");

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});


// ==========================================
// Change Password
// ==========================================

document
.getElementById("changePassword")
.addEventListener("click", async () => {

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {

        alert("Please fill all password fields.");

        return;

    }

    if (newPassword !== confirmPassword) {

        alert("New Password and Confirm Password do not match.");

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/auth/change-password`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                currentPassword,
                newPassword

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Password Changed Successfully!");

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});


// ==========================================
// Save Monthly Spending Limit
// ==========================================

document
.getElementById("saveLimit")
.addEventListener("click", async () => {

    const monthlyLimit = document
        .getElementById("spendingLimit")
        .value;

    if (!monthlyLimit || monthlyLimit <= 0) {

        alert("Please enter a valid monthly spending limit.");

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/auth/monthly-limit`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                monthlyLimit

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        // Update localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        user.monthlyLimit = data.monthlyLimit;

        localStorage.setItem("user", JSON.stringify(user));

        alert("Monthly Spending Limit Saved Successfully!");

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});