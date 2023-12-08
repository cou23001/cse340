const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


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
/**
 * 
 * Return the review for the selected vehicle
 */
Util.getReviews = async function (inv_id) {
  
    // method in your Util module to fetch reviews
    let reviewsData = await invModel.getReviews(inv_id)

    let reviewList = "<ul class='review-list'>"
    
    reviewsData.rows.forEach((review) => {
        reviewList += "<li>"
        reviewList += `<p>Rating: ${getStarRating(review.review_rating)}</p>`
        reviewList += `<p>"${review.review_comments}"</p>`
        reviewList += "</li>"
    })

    reviewList += "</ul>"
    return reviewList
}

// Function to generate star icons based on the rating value
function getStarRating(rating) {
  const maxRating = 5;
  let starIcons = '';

  for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
          starIcons += '★'; // Full star
      } else {
          starIcons += '☆'; // Empty star
      }
  }

  return starIcons;
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
        +' on CSE Motors"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr>'
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

/* ************************
 * Constructs the select element of Classification
 ************************** */

Util.getSelect = async function (req, res, next, selectedValue) {
  let data = await invModel.getClassifications()
  let select = "<select id='classification_id' name='classification_id' required><option value=-1>Choose a Classification</option>"
  data.rows.forEach((row) => {
  let selected;

  if (row.classification_id == selectedValue) {
    selected = "selected";
  } else {
    selected = "";
  }
  select += `<option value='${row.classification_id}' ${selected}>${row.classification_name}</option>`;
    
  })
  select += "</select>"
  return select;
}

Util.getSelectAlt = async function (selectedValue) {
  let data = await invModel.getClassifications()
  let select = "<select id='classification_id' name='classification_id' required>"
  data.rows.forEach((row) => {
  let selected;

  if (row.classification_id == selectedValue) {
    selected = "selected";
  } else {
    selected = "";
  }
  select += `<option value='${row.classification_id}' ${selected}>${row.classification_name}</option>`;
    
  })
  select += "</select>"
  return select;
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
      next()
  }
 }

 
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  account = res.locals.accountData.account_type
  if (account == 'Admin' || account == 'Employee') {
    next()
  } else {
    req.flash("notice", "The user is not allowed.")
    return res.redirect("/account/login")
  }
 }

 /**
  * 
  *  Form to review the auto
  */
 Util.buildReviewForm = function(vehicle, review_comments) {
  if (vehicle) {
    let reviewForm = '';

    reviewForm += '<div class="review-container">';
    reviewForm += '  <div class="review-form">';
    reviewForm += '    <form action="/inv/add/review" method="post">';
    
    reviewForm += '      <input type="hidden" name="inv_id" value="' + vehicle + '">';

    reviewForm += '      <label for="review_rating">Rating:</label>';
    reviewForm += '      <select id="review_rating" name="review_rating" required>';
    reviewForm += '        <option value="" disabled selected>Select</option>';
    reviewForm += '        <option value="1">1 Star</option>';
    reviewForm += '        <option value="2">2 Stars</option>';
    reviewForm += '        <option value="3">3 Stars</option>';
    reviewForm += '        <option value="4">4 Stars</option>';
    reviewForm += '        <option value="5">5 Stars</option>';
    reviewForm += '      </select>';

    reviewForm += '      <label for="review_comments">Comments:</label>';
    reviewForm += '      <textarea id="review_comments" name="review_comments" placeholder="Share your experience..." required>';
    
    if (review_comments) {
      reviewForm += review_comments;
    }
    reviewForm += '</textarea>';

    reviewForm += '      <input type="submit" value="Submit Review">';
    reviewForm += '    </form>';
    reviewForm += '  </div>';
    reviewForm += '</div>';

    return reviewForm;
  }
  
}



 

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
