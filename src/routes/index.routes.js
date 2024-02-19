import { Router } from "express";
import { getAllPokemons } from "../controllers/pokemon.comtroller";

const router = Router();

router.use("/ping", getAllPokemons);

export default router;
