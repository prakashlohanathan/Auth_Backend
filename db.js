import mongoose from "mongoose";
import dotenv from "dotenv";

//ENV configuration
dotenv.config();

export function dbConnection() {
  let MONGO_URL = process.env.NODE_ENVIRONMENT === 'development'
  ? `mongodb://127.0.0.1:27017/${process.env.DEVELOPMENT_MONGO_DB_NAME}`
  : `mongodb+srv://${process.env.PRODUCTION_MONGO_DB_USER_NAME}:${process.env.PRODUCTION_MONGO_DB_PASSWORD}@auth.wfj70to.mongodb.net/${process.env.PRODUCTION_MONGO_DB_NAME}`;
  
  try {
    mongoose.connect(`${MONGO_URL}`);
    console.log("Database connection Successfully");
  } catch (error) {
    console.log(error.message);
  }
}
