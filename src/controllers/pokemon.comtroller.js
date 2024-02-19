import { Type } from "../models/Type";
import { Pokemon } from "../models/pokemon";

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
