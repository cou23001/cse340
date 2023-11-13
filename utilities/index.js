const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='nav-list'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    //console.log('data inside buildClass: ' + data[0].inv_make)
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + 'details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildDetailAuto = async function(vehicle) {
  let car_detail = '';

  if (vehicle) {
    car_detail += '<div class="inv-card">'; 
    car_detail += '<div class="inv-image">';    
    car_detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">';
    car_detail += '</div>';

    car_detail += '<div class="inv-desc">';
    car_detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>';
    car_detail += '<p><b>Price: </b>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
    car_detail += '<p><b>Description: </b>' + vehicle.inv_description + '</p>';
    car_detail += '<p><b>Color: </b>' + vehicle.inv_color + '</p>';
    car_detail += '<p><b>Miles: </b>' + vehicle.inv_miles.toLocaleString() + '</p>';
    
    car_detail += '</div></div>';
  } else {
    car_detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return car_detail;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
