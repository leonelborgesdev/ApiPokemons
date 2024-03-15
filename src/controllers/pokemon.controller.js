import { Type } from "../models/Type.js";
import { Op } from "sequelize";
import { Pokemon } from "../models/Pokemon.js";
import { charge_all_pokemons } from "../services/pokemonService.js";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

export const getAllPokemons = async (req, res) => {
  const { name, ultPokemon, ord_segun, ord_desc, typename } = req.query;
  const attributes = [
    "id",
    "name",
    "strength",
    "defending",
    "life",
    "speed",
    "sprite",
    "sprite2",
  ];
  try {
    let AllPokemons = [];
    const Lineas = await Pokemon.count();
    if (Lineas === 0) {
      await charge_all_pokemons();
    }
    console.log(name, ord_desc, ord_segun);
    if (typename) {
      const countPokemonsByType = await Type.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: Pokemon,
            attributes,
            include: [
              {
                model: Type,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        where: { name: typename },
      });
      const PokemonsByType = await Pokemon.findAll({
        attributes,
        include: [
          {
            model: Type,
            attributes: ["id", "name"],
            where: {
              name: typename,
            },
          },
        ],
        offset: ultPokemon,
        limit: 12,
      });
      return res.status(200).json({
        ok: true,
        countPok: countPokemonsByType[0].pokemons.length,
        pokemons: PokemonsByType,
      });
    }
    if (name && ord_segun && ord_desc) {
      const countPok = await Pokemon.count({
        where: { name: { [Op.iLike]: `%${name}%` } },
      });
      if (ord_segun === "name" || ord_segun === "strength") {
        if (ord_desc === "ASC" || ord_desc === "DESC") {
          AllPokemons = await Pokemon.findAll({
            attributes,
            include: {
              model: Type,
              attributes: ["name", "id"],
            },
            offset: ultPokemon,
            where: { name: { [Op.iLike]: `%${name}%` } },
            limit: 12,
            order: [[ord_segun, ord_desc]],
          });
          return res
            .status(200)
            .json({ ok: true, pokemons: AllPokemons, countPok });
        } else {
          AllPokemons = await Pokemon.findAll({
            attributes,
            include: {
              model: Type,
              attributes: ["name", "id"],
            },
            offset: ultPokemon,
            where: { name: { [Op.iLike]: `%${name}%` } },
            limit: 12,
            order: [[ord_segun, "ASC"]],
          });
          return res
            .status(200)
            .json({ ok: true, pokemons: AllPokemons, countPok });
        }
      }
    }
    if (name) {
      const countPok = await Pokemon.count({
        where: { name: { [Op.iLike]: `%${name}%` } },
      });
      // const AllPokes= await Pokemon.
      const pokemonNombre = await Pokemon.findAll({
        attributes,
        include: {
          model: Type,
          attributes: ["name", "id"],
        },
        offset: ultPokemon,
        where: { name: { [Op.iLike]: `%${name}%` } },
        limit: 12,
      });
      console.log("countPoke", countPok);
      return res
        .status(200)
        .json({ ok: true, pokemons: pokemonNombre, countPok });
    }
    if (ord_segun === "name" || ord_segun === "strength") {
      if (ord_desc === "ASC" || ord_desc === "DESC") {
        AllPokemons = await Pokemon.findAll({
          attributes,
          include: {
            model: Type,
            attributes: ["name", "id"],
          },
          offset: ultPokemon,
          limit: 12,
          order: [[ord_segun, ord_desc]],
        });
        return res
          .status(200)
          .json({ ok: true, pokemons: AllPokemons, countPok: Lineas });
      } else {
        AllPokemons = await Pokemon.findAll({
          attributes,
          include: {
            model: Type,
            attributes: ["name", "id"],
          },
          offset: ultPokemon,
          limit: 12,
          order: [[ord_segun, "ASC"]],
        });
        return res
          .status(200)
          .json({ ok: true, pokemons: AllPokemons, countPok: Lineas });
      }
    }

    if (ultPokemon) {
      const countPok = await Pokemon.count();
      const pokemonNombre = await Pokemon.findAll({
        attributes,
        include: {
          model: Type,
          attributes: ["name", "id"],
        },
        offset: ultPokemon,
        limit: 12,
      });
      return res
        .status(200)
        .json({ ok: true, pokemons: pokemonNombre, countPok });
    }
    AllPokemons = await Pokemon.findAll({
      attributes,
      include: {
        model: Type,
        attributes: ["name", "id"],
      },
      limit: 12,
    });
    return res
      .status(200)
      .json({ ok: true, pokemons: AllPokemons, countPok: Lineas });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const getPokemonById = async (req, res) => {
  const { idPoke } = req.params;
  try {
    const pokemonObj = await Pokemon.findByPk(idPoke, {
      attributes: [
        "id",
        "name",
        "life",
        "strength",
        "defending",
        "speed",
        "height",
        "weight",
        "sprite",
        "sprite2",
      ],
      include: {
        model: Type,
        attributes: ["name", "id"],
      },
    });
    return res.status(200).json({ okey: true, pokemonObj });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error });
  }
};

export const createPokemon = async (req, res) => {
  const { id, name, life, strength, defending, speed, height, weight, types } =
    req.body;
  try {
    // buscar si existe el tipo de pokemon
    console.log(types);
    let typePokemon = [];
    const vectype = types.split(",");
    for (let i = 0; i < vectype.length; i++) {
      const tipo = vectype[i];
      if (tipo != 0) {
        const val = await Type.findOne({
          where: {
            name: tipo,
          },
        });
        if (!val) {
          return res
            .status(400)
            .json({ ok: false, msg: `No existe el type ${types[i]}` });
        }
        typePokemon.push(val.id);
      }
    }
    console.log("typePokemon", typePokemon);
    //verificar que el nombre ya exista en la bd
    const validateName = await Pokemon.findOne({
      where: {
        name: name,
      },
    });
    if (validateName) {
      return res
        .status(400)
        .json({ ok: false, msg: `El pokemon ${name} ya existe` });
    }
    if (req.files?.sprite) {
      const result = await uploadImage(req.files.sprite.tempFilePath);
      const { public_id, secure_url } = result;
      await fs.unlink(req.files.sprite.tempFilePath);
      const sprite = secure_url;
      const pokeAdd = await Pokemon.create({
        id,
        name,
        life,
        strength,
        defending,
        speed,
        height,
        weight,
        sprite,
      });
      await pokeAdd.setTypes(typePokemon);
      return res.status(200).json({
        ok: true,
        pokemon: {
          id: pokeAdd.id,
          name: pokeAdd.name,
          life: pokeAdd.life,
          strength: pokeAdd.strength,
          defending: pokeAdd.defending,
          speed: pokeAdd.speed,
          height: pokeAdd.height,
          weight: pokeAdd.weight,
          sprite: pokeAdd.sprite,
          types: typePokemon,
        },
      });
    }
    return res
      .status(400)
      .json({ ok: false, msg: "consulte a su administrador" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error });
  }
};
export const updatePokemon = async (req, res) => {
  const { idPoke } = req.params;
  const { id, ...pokemon } = req.body;
  try {
    console.log("pokemon", pokemon);
    if (pokemon) {
      if (pokemon.name) {
        const verify_name = await Pokemon.findOne({
          where: {
            name: pokemon.name,
          },
        });
        if (verify_name) {
          return res.status(400).json({
            ok: false,
            msg: `El pokemon ${pokemon.name} ya existe`,
          });
        }
      }
      if (req.files?.sprite) {
        const result = await uploadImage(req.files.sprite.tempFilePath);
        const { public_id, secure_url } = result;
        await fs.unlink(req.files.sprite.tempFilePath);
        pokemon["sprite"] = secure_url;
      }
      await Pokemon.update(pokemon, {
        //modificando
        include: Type,
        where: {
          id: idPoke,
        },
      });
      const pokeUpdate = await Pokemon.findOne({
        include: Type,
        where: {
          id: idPoke,
        },
      });
      if (pokemon.types) {
        await pokeUpdate.setTypes(pokemon.types);
      }
      return res.status(200).json({
        ok: true,
        msg: `El pokemon ${pokemon.name}, ha sido modificado`,
      });
    } else {
      return res
        .status(400)
        .json({ ok: false, msg: "Error consulte con el administrador" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: error });
  }
};

export const deletePokemon = async (req, res) => {
  const { idPoke } = req.params;
  try {
    if (idPoke.length > 0) {
      const cont = await Pokemon.destroy({ where: { id: `${idPoke}` } });
      return res
        .status(200)
        .json({ ok: true, msg: `${cont} registro eliminado` });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: error });
  }
};
