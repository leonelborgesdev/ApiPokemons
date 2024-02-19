import { Router } from "express";
import PokemonRoute from "./pokemon.routes.js";

const router = Router();

router.use("/pokemon", PokemonRoute);

export default router;
