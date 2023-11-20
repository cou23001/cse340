// Needed Resources 
const express = require("express")
const router = new express.Router() 
const mgmtController = require("../controllers/mgmtController")
const { invCont, registerClassification, registerVehicle } = require('../controllers/invController');

const utilities = require("../utilities")
const regValidate = require('../utilities/class-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);

// Route to display car
router.get("/detail/:carId", invCont.buildByCarId);

// Route to the management
router.get("/", invCont.buildMgmt);

// Route to the management add classification
router.get("/add/classification", utilities.handleErrors(invCont.buildClassification));

//router.post('/add/classification',registerClassification)

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
router.get("/add/vehicle", utilities.handleErrors(invCont.buildVehicle));

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


module.exports = router;