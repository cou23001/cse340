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
    const classificationSelect = await utilities.getSelect()
    
    if (res.locals.accountData == null) {
      res.redirect('/account/login')
    }
    else {
      const type = res.locals.accountData.account_type
      if (type == 'Admin' || type == 'Employee') {
        res.render("inventory/mgmt", {
          title: message,
          classificationSelect,
          nav,
        })
      } else {
          res.redirect('/account/login')
      }
    }
    
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
  let nav = await utilities.getNav()
  const { 
    classification_name
  } = req.body
  
  const regResult = await invModel.registerClassification(
    classification_name
  )
  
  if (regResult) {
    req.flash(
        "success",
        `The ${classification_name} classificaton was succesfully added.`
    )
    nav = await utilities.getNav()
    const classificationSelect = await utilities.getSelect()
    res.status(201).render("inventory/mgmt", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
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

  let select = await utilities.getSelect()
  
  if (regResult && regResult.rows && regResult.rows.length > 0) {
    req.flash(
        "success",
        `The ${inv_make} vehicle was succesfully added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("inventory/mgmt", {
        title: "Vehicle Management",
        classificationSelect: select,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  week 5. Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const itemDataRow = await invModel.getDetailByCarId(inv_id)
  itemData = itemDataRow.rows[0]
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.getSelect(req,res,next,itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    select: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

/* ***************************
 *  week 5. Build edit inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const itemDataRow = await invModel.getDetailByCarId(inv_id)
  itemData = itemDataRow.rows[0]
  let nav = await utilities.getNav()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = { invCont, registerClassification, registerVehicle }
