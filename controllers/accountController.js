const utilities = require("../utilities/")
const util = require('util');
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
// Week 5. The cookies
const jwt = require("jsonwebtoken")
require("dotenv").config()

  
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
      account_firstname: '',
      account_lastname: '',
      account_email: '',
      account_password: '',
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password 
      } = req.body
    
  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  
  if (regResult) {
      req.flash(
          "notice",
          `Congratulations, you\'re registered ${account_firstname}. Please log in.`
  )
  res.status(201).render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
  })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  flag = 'good'
  console.log('good')
  res.status(201).render("account/login", {
    title: "Login",
    nav,
    account_email:'',
    errors: null
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  let validUser = false
  // Check if the user has valid credentials
  if (await bcrypt.compare(account_password, accountData.account_password))
    validUser = true
  //if (!accountData) {
  // change accountData to validUser to check credentials
  if (!validUser) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
  }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/*
w5. Account Management View
*/
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("account/", {
    title: "Account Management",
    locals: res.locals.accountData,
    nav,
    errors: null,
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, buildManagement }
