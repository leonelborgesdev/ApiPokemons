import { Type } from "../models/Type.js";
import { Pokemon } from "../models/Pokemon.js";
import { charge_all_pokemons } from "../services/pokemonService.js";

export const getAllPokemons = async (req, res) => {
  const { name, ultPokemon } = req.query;
  try {
    let AllPokemons = [];
    const Lineas = await Pokemon.count();
    if (Lineas === 0) {
      await charge_all_pokemons();
    }
    if (ultPokemon) {
      // const pokemonUlt = await Pokemon.findByPk(ultPokemon);
      const filterpokemons = await paginadoPokemons(ultPokemon, res);
      return res.status(200).json({ ok: true, pokemons: filterpokemons });
    }
    if (name) {
      const pokemonNombre = await Pokemon.findAll({
        attributes: ["id", "name", "sprite", "sprite2"],
        include: {
          model: Type,
          attributes: ["name", "id"],
        },
        where: { name: { [Op.iLike]: `%${name}%` } },
      });
      return res.status(200).json({ ok: true, pokemons: pokemonNombre });
    }
    AllPokemons = await Pokemon.findAll({
      attributes: ["id", "name", "sprite", "sprite2"],
      include: {
        model: Type,
        attributes: ["name", "id"],
      },
      limit: 12,
    });
    return res.status(202).json({ ok: true, pokemons: AllPokemons });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: error });
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
  const {
    id,
    name,
    life,
    strength,
    defending,
    speed,
    height,
    weight,
    sprite,
    sprite2,
    types,
  } = req.body;
  try {
    //buscar si existe el tipo de pokemon
    let typePokemon = [];
    for (let i = 0; i < types.length; i++) {
      const tipo = types[i];
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
      sprite2,
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
        sprite2: pokeAdd.sprite2,
        types: typePokemon,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error });
  }
};
