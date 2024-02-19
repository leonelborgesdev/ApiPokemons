import Sequelize from "sequelize";
import { config } from "dotenv";
config();

const { DATABASE_URL, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
export const sequelize = new Sequelize(
  //   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,
  DATABASE_URL,
  {
    // ---------------------------Deploy--------------------------
    // dialectOptions: {
    //   ssl: { require: true, rejectUnauthorized: false },
    // },
    // ------------------------------------------------------------
    // logging: false, // set to console.log to see the raw SQL queries
    // native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
