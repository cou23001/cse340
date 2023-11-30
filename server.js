/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const accountRoute = require('./routes/accountRoute')
const inventoryRoute = require("./routes/inventoryRoute")
const mgmtRoute = require("./routes/mgmtRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const accountModel = require("./models/account-model")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Week 5 cookie Parser
app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


const updateAccountDataLocals = async (req, res, next) => {
  try {
    if (res.locals.loggedin == 1) {
      const accountData = res.locals.accountData
      account_id = accountData.account_id
    
      const itemData = await accountModel.getDetailByAccountId(account_id)
      res.locals.accountData = {
        account_id: itemData.account_id,
        account_firstname: itemData.account_firstname,
        account_lastname: itemData.account_lastname,
        account_email: itemData.account_email,
        account_type: itemData.account_type,
      }
    }
      
    next();
  } catch (error) {
    next(error);
  }
};

// Update account data in locals middleware
app.use(updateAccountDataLocals);

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

// Index route
app.get(
  "/", 
  utilities.handleErrors(baseController.buildHome)
)

// Inventory routes
app.use("/inv", inventoryRoute)

// Mgmt vehicles and classification
app.use("/mgmt", mgmtRoute)

// Account routes - Unit 4. activity
app.use(
  "/account", 
  utilities.handleErrors(accountRoute)
)

// Middleware to simulate a 500 error
app.use('/simulate-500', (req, res, next) => {
  next({status: 500, message: 'Simulated 500 Internal Server Error.'})
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404)
    { 
      message = err.message
      imageUrl = '/images/site/error404.png'
    } 
  else 
    {
      message = 'Oh no! There was a crash. Maybe try a different route?'
      imageUrl = '/images/site/error500.jpeg'
    }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})