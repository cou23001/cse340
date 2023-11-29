const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message.")
  //console.log(res.locals.loggedin)
  res.render("index", {
    //locals: res.locals.accountData,
    title: "Home", 
    nav,
    res
  })
}

module.exports = baseController