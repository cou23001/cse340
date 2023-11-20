const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    const alphanumericWithSpaces = /^[A-Za-z0-9 ]+$/;
    return [
      // make is required and must be alphanumeric
      body("inv_make")
        .trim()
        .isAlphanumeric()
        .withMessage("Provide a valid make name."),
  
      // model is required and must be string
      body("inv_model")
        .trim()
        .custom(value => {
          if (!alphanumericWithSpaces.test(value)) {
              throw new Error("Provide a valid model name with alphanumeric characters and spaces");
          }
          return true;
      }),
  
      // description is required 
      body("inv_description")
        .trim()
        .isLength({ min: 3 })
        .withMessage("A valid description is required."),

      // valid image is required 
      body("inv_image")
        .trim()
        .isLength({ min: 3 })
        .withMessage("A valid image path is required."),

      // valid thumbnail is required 
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 3 })
        .withMessage("A valid thumbnail path is required."),

      // valid price is required
      body("inv_price")
      .trim()
      .isCurrency()
      .withMessage("A valid price is required."),
      
      // valid year is required 
      body("inv_year")
        .trim()
        .isInt({ min: 1000,max: 9999 })
        .withMessage("Provide a valid vehicle year."),

      // valid miles is required
      body("inv_miles")
        .trim()
        .isDecimal()
        .withMessage("A valid vehicle's miles (integer) is required."),

        // valid color is required
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("A valid color is needed."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      // Send the previous value to be included in select
      let select = await utilities.getSelect(req, res, next,classification_id)
      res.render("inventory/add/vehicle", {
        errors,
        title: "Registration",
        nav,
        select,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        req
      })
      return
    }
    next()
  }
  
  module.exports = validate