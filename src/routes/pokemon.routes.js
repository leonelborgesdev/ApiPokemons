import { Router } from "express";
import {
  createPokemon,
  deletePokemon,
  getAllPokemons,
  getPokemonById,
  updatePokemon,
} from "../controllers/pokemon.controller.js";

const router = Router();

router.get("/", getAllPokemons);
router.get("/:idPoke", getPokemonById);
router.post("/", createPokemon);

router.put("/:idPoke", updatePokemon);
router.delete("/:idPoke", deletePokemon);

export default router;
