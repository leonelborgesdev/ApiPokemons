import { Type } from "../models/Type.js";
import { Op } from "sequelize";
import { cargar_types } from "../services/typeService.js";

export const getAllTypes = async (req, res) => {
  const { name } = req.query;
  try {
    let AllTypes = [];
    const Lineas = await Type.count();
    if (Lineas === 0) {
      AllTypes = await cargar_types("https://pokeapi.co/api/v2/type");
      await Type.bulkCreate(AllTypes);
    }
    if (name) {
      const typeNombre = await Type.findAll({
        attributes: ["id", "name"],
        where: {
          name: { [Op.iLike]: `%${name}%` },
        },
      });
      return res.status(200).json({ ok: true, types: typeNombre });
    }
    if (AllTypes.length === 0) {
      AllTypes = await Type.findAll({ attributes: ["id", "name"] });
    }
    return res.status(200).json({ ok: true, types: AllTypes });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};
