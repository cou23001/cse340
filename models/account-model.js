const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* w5. Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getDetailByAccountId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account_id found")
  }
}

/* ***************************
 *  Update Account
 * ************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1 RETURNING *"
    //console.log('sql: ',sql)
      const data = await pool.query(sql, [
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Account
 * ************************** */
async function updatePassword(
  account_id,
  account_password,
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $2 WHERE account_id = $1 RETURNING *"
      const data = await pool.query(sql, [
        account_id,
        account_password,
      ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/**
 * Check user email
 */
async function checkUserEmail(
  account_id
) {
  try {
    const sql = "SELECT account_email FROM public.account WHERE account_id = $1"
    const data = await pool.query(sql, [
      account_id,
    ])
    //console.log('data->',data.rows[0].account_email)
    return data.rows[0].account_email
  } catch (error) {
      console.error("model error: " + error)
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getDetailByAccountId, updateAccount, updatePassword, checkUserEmail }