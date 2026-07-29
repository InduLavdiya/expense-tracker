// ==========================================
// Forgot Password
// ==========================================

const forgotPasswordForm =
document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value.trim();

    try {

        const response = await fetch(

            `${BASE_URL}/auth/forgot-password`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Password reset email sent successfully!");

        forgotPasswordForm.reset();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});