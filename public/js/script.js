function togglePassword() {
    var passwordInput = document.getElementById("account_password");
    var toggleIcon = document.getElementById("toggle_password");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
      
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
      
    }
}