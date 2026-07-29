// =====================================
// Login
// =====================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${BASE_URL}/auth/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});