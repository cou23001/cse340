// Needed Resources 
const express = require("express")
const router = new express.Router() 
const { invCont, registerClassification, registerVehicle, registerReview } = require('../controllers/invController');
const utilities = require("../utilities")
const regValidate = require('../utilities/class-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// Route to build inventory by classification view
router.get(
    "/type/:classificationId", 
    utilities.handleErrors(invCont.buildByClassificationId))

// Route to display car
router.get(
    "/detail/:carId", 
    utilities.handleErrors(invCont.buildByCarId))

router.post(
    "/add/review",
    vehicleValidate.reviewRules(),
    vehicleValidate.checkReviewData,
    utilities.handleErrors(registerReview)
)

// Route to the management
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invCont.buildMgmt)
)

// Route to the management add classification
router.get(
    "/add/classification", 
    utilities.handleErrors(invCont.buildClassification)
)

/* *************************************
*  Deliver registration adding
*  Unit 4. deliver registration view activity
*  ***********************************  */

router.post(
    '/add/classification',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(registerClassification)
)

// Route to the management add vehicles
router.get(
    "/add/vehicle", 
    utilities.handleErrors(invCont.buildVehicle)
)

/* *************************************
*  Classification adding
*  Week 4. adding classification
*  ***********************************  */

router.post(
    "/add/vehicle",
    vehicleValidate.registrationRules(),
    vehicleValidate.checkRegData,
    utilities.handleErrors(registerVehicle)
)

/** wk 5 */
router.get(
    "/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invCont.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invCont.editInventoryView)
)

router.post(
    "/update/", 
    utilities.handleErrors(invCont.updateInventory)
)

/*
* Delete inventory item
*/
router.get(
    "/delete/:inv_id",
    utilities.handleErrors(invCont.deleteInventoryView)
)

router.post(
    "/delete/", 
    utilities.handleErrors(invCont.deleteInventory)
)


module.exports = router;