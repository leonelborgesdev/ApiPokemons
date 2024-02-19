import { Router } from "express";

const router = Router();

router.use("/ping", (req, res) => {
  return res.send("pong");
});

export default router;
