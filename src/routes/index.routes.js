import { Router } from "express";
import PokemonRoute from "./pokemon.routes.js";
import TypeRoute from "./type.routes.js";

const router = Router();

router.use("/pokemon", PokemonRoute);
router.use("/type", TypeRoute);

export default router;
