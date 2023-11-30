function togglePassword() {
    var passwordInput = document.getElementById("account_password");
    var toggleIcon = document.getElementById("toggle_password");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.src = "/images/fonts/eye-solid.svg";
      
    } else {
      passwordInput.type = "password";
      toggleIcon.src = "/images/fonts/eye-slash-solid.svg";
      
    }
}
