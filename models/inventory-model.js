const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all details of car by car_id
 * ************************** */
async function getDetailByCarId(inv_id) {
  try {
    const row = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
  
    return row
    
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get reviews by car_id
 * ************************** */
async function getReviews(inv_id) {
  try {
    const row = await pool.query(
      `SELECT * FROM public.review 
      WHERE inv_id = $1 ORDER BY review_id DESC`,
      [inv_id]
    );
  
    return row
    
  } catch (error) {
    console.error("getreviewbyid error " + error)
  }
}

async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function registerVehicle(inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *"
    return await pool.query(sql, [inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id])
  } catch (error) {
    console.error('Error in query ->', error.message);
    return error.message
  }
}

async function registerReview(review_rating,review_comments,account_id,inv_id){
  try {
    const sql = "INSERT INTO review (review_rating,review_comments, account_id, inv_id) VALUES ($1,$2,$3,$4) RETURNING *"
    return await pool.query(sql, [review_rating,review_comments,account_id,inv_id])
  } catch (error) {
    console.error('Error in query ->', error.message);
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function deleteInventory(
  inv_id,
) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId,getDetailByCarId,registerClassification,registerVehicle, updateInventory, deleteInventory, registerReview, getReviews};
