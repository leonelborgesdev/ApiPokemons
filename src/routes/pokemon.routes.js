import { Router } from "express";
import {
  getAllPokemons,
  getPokemonById,
} from "../controllers/pokemon.controller.js";

const router = Router();

router.get("/", getAllPokemons);
router.get("/:idPoke", getPokemonById);

export default router;
