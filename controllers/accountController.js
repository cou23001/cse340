const utilities = require("../utilities/")
const util = require('util');
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
// Week 5. The cookies
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountValidation = require('../utilities/account-validation');
const { validationResult } = require('express-validator');
  
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    res,
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
      res,
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
      res,
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
          "success",
          `Congratulations, you\'re registered ${account_firstname}. Please log in.`
  )
  res.status(201).render("account/login", {
      title: "Login",
      res,
      nav,
      account_email,
      errors: null,
  })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      res,
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
  res.status(201).render("account/login", {
    title: "Login",
    res,
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
    res,
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

  accountType = res.locals.accountData.account_type

  if (accountType === 'Admin' || accountType === 'Employee') {
    // Render the management account page
    res.render('account/', {
      title: 'Account Management',
      nav,
      errors: null,
    });
  } else {
    // Render the client account page
    res.render('account/client', {
      title: 'Client Account',
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Logout
 * *************************************** */
function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const itemData = await accountModel.getDetailByAccountId(account_id)
  
  let nav = await utilities.getNav()
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`
  res.render("account/edit-account", {
    title: "Edit Account " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
    account_password: itemData.account_password,
  })
}

async function updateAccount(req, res, next) {
  const action = req.body.action;
  let nav = await utilities.getNav()

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    const itemName = updateResult.account_firstname
    req.flash("success", `The ${itemName} user was successfully updated.`)
    res.redirect("/account")

  } else {
    const itemName = `${account_firstname}`
    req.flash("notice", "Sorry, the insert failed. " + itemName)
    res.status(501).render("account/edit-account", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
  
}

async function updatePassword(req, res, next) {
  const action = req.body.action;
  let nav = await utilities.getNav()
  
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body
  let hashedPassword = await bcrypt.hashSync(account_password, 10)
  
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )
  
  if (updateResult) {
    const itemName = updateResult.account_firstname
    req.flash("success", `The ${itemName} password was successfully updated.`)
    res.clearCookie("jwt");
    res.redirect("/account/login");
  } else {
    const itemName = `${account_firstname}`
    req.flash("notice", "Sorry, the insert failed. " + itemName)
    res.status(501).render("account/edit-account", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, buildManagement, accountLogout, editAccountView, updateAccount, updatePassword }

