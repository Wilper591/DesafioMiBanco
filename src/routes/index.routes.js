import { Router } from "express";
import rutasTransaction from "./transaction.routes.js"
const router = Router();

//Rutas Principal
router.get("/", (req, res) => {
  try {
    res.send("Bienvenido a la página principal del Banco");
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

router.use("/transaction", rutasTransaction)

export default router;