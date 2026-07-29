// =====================================
// Register
// =====================================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // =====================================
    // Password Check
    // =====================================

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;

    }


    // =====================================
    // Send Registration Request
    // =====================================

    try {

        const response = await fetch(`${BASE_URL}/auth/register`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                name,
                email,
                password

            })

        });


        const data = await response.json();


        // =====================================
        // Success
        // =====================================

        if (response.ok) {

            alert("Registration Successful!");

            window.location.href = "login.html";

        }


        // =====================================
        // Error
        // =====================================

        else {

            alert(data.message || "Registration failed.");

        }

    }

    catch (error) {

        console.error("Registration Error:", error);

        alert("Unable to connect to the server.");

    }

});