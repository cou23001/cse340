const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    let nav = await utilities.getNav()

    if (Array.isArray(data) && data.length === 0) {
      // The array is empty
      res.render("./inventory/classification", {
        title: "No vehicles",
        nav,
        grid: null,
      })
    } else {
      // The array is not empty
      const grid = await utilities.buildClassificationGrid(data)
      const className = data[0].classification_name
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })
    }
    
  } catch (error) {
    next({status: 404, message: 'Sorry, that classification is not available in our inventory.'})
  }
}

invCont.buildByCarId = async function (req, res, next) {
  try {
    const inv_id = req.params.carId
    const data = await invModel.getDetailByCarId(inv_id)
    const detail = await utilities.buildDetailAuto(data.rows[0])
    let nav = await utilities.getNav()
    const year = data.rows[0].inv_year
    const make = data.rows[0].inv_make
    const model = data.rows[0].inv_model

    res.render("./inventory/car", {
      title: year + " " + make + " " + model,
      nav,
      detail,
    })
  } catch (error) {
    next({status: 404, message: 'Sorry, that vehicle is not available in our inventory.'})
  }
}

invCont.buildMgmt = async function (req, res, next) {
  try {      
    let nav = await utilities.getNav()
    const message = "Vehicle Management"
    res.render("./inventory/mgmt", {
        title: message,
        nav,
     })
    } catch (error) {
        next({status: 404, message: 'Sorry, management not available.'})
    }
}

invCont.buildClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const message = "Vehicle Management"
    res.render("./inventory/add/classification", {
        title: message,
        nav,
        errors: null,
    })
    } catch (error) {
        next({status: 404, message: 'Sorry, management not available.'})
    }
}

invCont.buildVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()

    const message = "Vehicle Management"
    let select = await utilities.getSelect()

    res.render("./inventory/add/vehicle", {
      title: message,
      nav,
      select,
      errors: null,
    })
  } catch (error) {
      next({status: 404, message: 'Sorry, management not available.'})
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerClassification(req, res) {
  console.log('registerClassification')
  let nav = await utilities.getNav()
  const { 
    classification_name
  } = req.body
  
  const regResult = await invModel.registerClassification(
    classification_name
  )
  
  if (regResult) {
    req.flash(
        "notice",
        `The ${classification_name} classificaton was succesfully added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("inventory/mgmt", {
        title: "Vehicle Management",
        nav,
    })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add/classification", {
          title: "Registration",
          nav,
        })
    }
}

/* ****************************************
*  Vehicle Registration
* *************************************** */
async function registerVehicle(req, res) {
  let nav = await utilities.getNav()
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  
  const regResult = await invModel.registerVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  )
  
  if (regResult && regResult.rows && regResult.rows.length > 0) {
    req.flash(
        "notice",
        `The ${inv_make} vehicle was succesfully added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("inventory/mgmt", {
        title: "Vehicle Management",
        nav,
    })
    } else {
        const { 
          classification_id
        } = req.body
        let select = await utilities.getSelectAlt(classification_id)
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add/vehicle", {
          title: "Vehicle Registration",
          nav,
          select,
          errors: null,
        })
        
    }
}

module.exports = { invCont, registerClassification, registerVehicle }
