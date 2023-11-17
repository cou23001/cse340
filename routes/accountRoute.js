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
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


module.exports = router;