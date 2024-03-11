import axios from "axios";
import { Pokemon } from "../models/Pokemon.js";
import { Type } from "../models/Type.js";

export const charge_all_pokemons = async () => {
  // let pokemonsbdlength = await Pokemon.count();
  let count = 0;
  while (count < 1154) {
    console.log(count);
    const { data } = await axios(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${count}`
    );
    const apiPokemons = await data.results.map((obj) => axios.get(obj.url));
    const UrlPokemons = await axios.all(apiPokemons);
    UrlPokemons.map(async (pokemons) => {
      const pokemon = pokemons.data;
      const obj = pokemon.sprites.other["official-artwork"];
      let type = pokemon.types[0].type.url;
      let valor = type.split("/"); //6
      let type2 = "";
      let valor2 = "";
      if (pokemon.types.length === 2) {
        type2 = pokemon.types[1].type.url;
        valor2 = type2.split("/"); //6
      }
      const typesPokemon =
        pokemon.types.length < 2
          ? [valor[6].toString()]
          : [valor[6].toString(), valor2[6].toString()];
      const objetoPokemon = {
        id: pokemon.id.toString(),
        name: pokemon.name,
        life: parseInt(pokemon.stats[0].base_stat, 10),
        strength: parseInt(pokemon.stats[1].base_stat, 10),
        defending: parseInt(pokemon.stats[2].base_stat, 10),
        speed: parseInt(pokemon.stats[5].base_stat, 10),
        height: pokemon.height,
        weight: pokemon.weight,
        sprite: pokemon.sprites.other.dream_world.front_default
          ? pokemon.sprites.other.dream_world.front_default
          : "",
        sprite2: obj.front_default ? obj.front_default : "",
      };
      1;
      const Poke = await Pokemon.create(objetoPokemon);
      await Poke.setTypes(typesPokemon);
      return {
        id: pokemon.id.toString(),
        name: pokemon.name,
        life: parseInt(pokemon.stats[0].base_stat, 10),
        strength: parseInt(pokemon.stats[1].base_stat, 10),
        defending: parseInt(pokemon.stats[2].base_stat, 10),
        speed: parseInt(pokemon.stats[5].base_stat, 10),
        height: pokemon.height,
        weight: pokemon.weight,
        sprite: pokemon.sprites.other.dream_world.front_default,
        sprite2: obj.front_default,
        types:
          pokemon.types.length < 2
            ? [{ id: valor[6].toString(), name: pokemon.types[0].type.name }]
            : [
                { id: valor[6].toString(), name: pokemon.types[0].type.name },
                { id: valor2[6].toString(), name: pokemon.types[1].type.name },
              ],
      };
    });
    count = count + 20;
  }
};

export const cargar_pokemons = async (api) => {
  const { data } = await axios(api);
  const apiPokemons = await data.results.map((obj) => axios.get(obj.url));
  const UrlPokemons = await axios.all(apiPokemons);
  // let pokemonsCreate = [];
  await UrlPokemons.map(async (pokemons) => {
    const pokemon = pokemons.data;
    const obj = pokemon.sprites.other["official-artwork"];
    let type = pokemon.types[0].type.url;
    let valor = type.split("/"); //6
    let type2 = "";
    let valor2 = "";
    if (pokemon.types.length === 2) {
      type2 = pokemon.types[1].type.url;
      valor2 = type2.split("/"); //6
    }
    const typesPokemon =
      pokemon.types.length < 2
        ? [valor[6].toString()]
        : [valor[6].toString(), valor2[6].toString()];
    const objetoPokemon = {
      id: pokemon.id.toString(),
      name: pokemon.name,
      life: pokemon.stats[0].base_stat,
      strength: pokemon.stats[1].base_stat,
      defending: pokemon.stats[2].base_stat,
      speed: pokemon.stats[5].base_stat,
      height: pokemon.height,
      weight: pokemon.weight,
      sprite: pokemon.sprites.other.dream_world.front_default,
      sprite2: obj.front_default,
    };
    const Poke = await Pokemon.create(objetoPokemon);
    await Poke.setTypes(typesPokemon);
    return {
      id: pokemon.id.toString(),
      name: pokemon.name,
      life: pokemon.stats[0].base_stat,
      strength: pokemon.stats[1].base_stat,
      defending: pokemon.stats[2].base_stat,
      speed: pokemon.stats[5].base_stat,
      height: pokemon.height,
      weight: pokemon.weight,
      sprite: pokemon.sprites.other.dream_world.front_default,
      sprite2: obj.front_default,
      types:
        pokemon.types.length < 2
          ? [{ id: valor[6].toString(), name: pokemon.types[0].type.name }]
          : [
              { id: valor[6].toString(), name: pokemon.types[0].type.name },
              { id: valor2[6].toString(), name: pokemon.types[1].type.name },
            ],
    };
  });
};

export const paginadoPokemons = async (ultPokemon, res) => {
  const AllPokemons = await Pokemon.findAll({
    attributes: [
      "id",
      "name",
      "strength",
      "defending",
      "life",
      "speed",
      "sprite",
      "sprite2",
    ],
    include: {
      model: Type,
      attributes: ["name", "id"],
    },
    offset: ultPokemon,
    limit: 12,
  });
  return AllPokemons.map((pokemon) => pokemon.dataValues);
};
