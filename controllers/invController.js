const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  console.log('inside invController classification_id: ',classification_id)
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByCarId = async function (req, res, next) {
  const inv_id = req.params.carId
  console.log('inside invController inv_id',inv_id)
  const data = await invModel.getDetailByCarId(inv_id)
  const grid = await utilities.buildDetailAuto(data.rows[0])
  let nav = await utilities.getNav()
  const year = data.rows[0].inv_year
  const make = data.rows[0].inv_make
  const model = data.rows[0].inv_model
  res.render("./inventory/car", {
    title: year + " " + make + " " + model,
    nav,
    grid,
  })
  
}

module.exports = invCont