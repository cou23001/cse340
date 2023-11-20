const utilities = require("../utilities")
const mgmtModel = require("../models/mgmt-model")


async function buildClassification (req, res, next) {
  try {
    console.log('mmgmtController-buildClasification')
    let nav = await utilities.getNav()
    const message = "Vehicle Management"
    res.render("inventory/add/classification", {
        title: message,
        nav,
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
  
  const regResult = await mgmtModel.registerClassification(
    classification_name
  )
  
  if (regResult) {
    req.flash(
        "notice",
        `Congratulations, you have registered ${classification_name}.`
    )
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



//module.exports = invCont,registerClassification
//module.exports = { invCont, registerClassification }
module.exports = {registerClassification}
module.exports = {registerClassification,buildClassification}
//module.exports = { registerClassification }
