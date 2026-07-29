// =====================================
// Password Show / Hide
// =====================================

const togglePasswords = document.querySelectorAll(".toggle-password");

togglePasswords.forEach((icon) => {

    icon.addEventListener("click", () => {

        const input = icon.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

// =====================================
// Redirect if already logged in
// =====================================

//if (
   // localStorage.getItem("token") &&
   // (
      //  window.location.pathname.includes("login.html") ||
      //  window.location.pathname.includes("register.html")
   // )
//) {

   // window.location.href = "dashboard.html";

//}