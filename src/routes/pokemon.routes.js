import { Router } from "express";
import { getAllPokemons } from "../controllers/pokemon.controller";

const router = Router();

router.get("/", getAllPokemons);

export default router;
