// Needed Resources 
const express = require("express")
const router = new express.Router() 
const mgmtController = require("../controllers/mgmtController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to the management add classification
router.get("/add/classification", mgmtController.buildClassification);

/* *************************************
*  Deliver registration adding
*  Unit 4. deliver registration view activity
*  ***********************************  */
router.post(
    '/add/classification',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(mgmtController.registerClassification)
)


module.exports = router;