import { Router } from "express";
import {
  createPokemon,
  getAllPokemons,
  getPokemonById,
} from "../controllers/pokemon.controller.js";

const router = Router();

router.get("/", getAllPokemons);
router.get("/:idPoke", getPokemonById);
router.post("/", createPokemon);

export default router;
