// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


/* *************************************
*  Deliver login view
*  Unit 4. deliver login view activity
*  ***********************************  */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )
/* *************************************
*  Deliver registration view
*  Unit 4. deliver registration view activity
*  ***********************************  */
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* *************************************
*  Deliver registration adding
*  Unit 4. deliver registration view activity
*  ***********************************  */
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

/* *************************************
*  Account Management View
*  Wk 5. 
*  ***********************************  */
//router.get("/", utilities.handleErrors(accountController.buildUser));
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)


module.exports = router;