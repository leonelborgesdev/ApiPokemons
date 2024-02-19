import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Pokemon = sequelize.define("pokemon", {
  // defino el modelo
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
