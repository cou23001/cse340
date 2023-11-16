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

  function validatePassword() {
    var passwordInput = document.getElementById("account_password");
    var password = passwordInput.value;
  
    // Password requirements
    var minLength = 12;
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumber = /\d/.test(password);
    var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    var errorMessages = [];
  
    if (password.length < minLength) {
      errorMessages.push("- Minimum length of 12 characters");
    }
  
    if (!hasUpperCase) {
      errorMessages.push("- Contains at least 1 uppercase letter");
    }
  
    if (!hasNumber) {
      errorMessages.push("- Contains at least 1 number");
    }
  
    if (!hasSpecialChar) {
      errorMessages.push("- Contains at least 1 special character");
    }
  
    if (errorMessages.length > 0) {
      var errorMessage = "Password must meet the following requirements:\n" + errorMessages.join("\n");
      alert(errorMessage);
      return false;
    }
  
    return true;
  }