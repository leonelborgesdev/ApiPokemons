import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Type } from "./Type.js";

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
  life: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  defending: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  speed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  height: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sprite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sprite2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Pokemon.belongsToMany(Type, { through: "pokemon_type" });
Type.belongsToMany(Pokemon, { through: "pokemon_type" });
