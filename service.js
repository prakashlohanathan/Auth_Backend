import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//ENV configuration
dotenv.config();

//JWT token generating
let generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

//Get Current Date
function getCurrentDate() {
  // Get current date
  let currentDate = new Date();
  // Get day, month, and year from the current date
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Note: January is 0!
  let year = currentDate.getFullYear();
  // Pad day and month with leading zeros if needed
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  // Format the date as dd/mm/yyyy
  let date = day + "/" + month + "/" + year;
  return date;
}

//Decode Jwt Token
const decodeJwtToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error("Error in Jwt Decoding", error);
    return null;
  }
};

export { generateJwtToken, getCurrentDate,decodeJwtToken };