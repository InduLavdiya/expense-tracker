// ==========================================
// Reset Password
// ==========================================

// Get token from URL
const params = new URLSearchParams(window.location.search);

const resetToken = params.get("token");

const resetPasswordForm =
document.getElementById("resetPasswordForm");

resetPasswordForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(newPassword !== confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    try{

        const response = await fetch(

            `${BASE_URL}/auth/reset-password`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

              body: JSON.stringify({

    token: resetToken,

    newPassword

})

            }

        );

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            return;

        }

        alert("Password Reset Successfully!");

        window.location.href="login.html";

    }

    catch(error){

        console.log(error);

        alert("Something went wrong.");

    }

});