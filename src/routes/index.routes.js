import { Router } from "express";
import PokemonRoute from "./pokemon.routes.js";
import TypeRoute from "./type.routes.js";

const router = Router();

router.use("/pokemons", PokemonRoute);
router.use("/types", TypeRoute);

export default router;
