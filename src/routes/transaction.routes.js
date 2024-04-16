import { Router } from "express";
const router = Router();
import {
  newTransactionVoucher,
  getBalanceAccount,
  getTransactionRegister,
} from "../controllers/transaction.controller.js";

//Ruta getBalanceAccount
router.get("/balance", async (req, res) => {
  try {
    const { id } = req.body;
    const getBalance = await getBalanceAccount(id);
    res.send(getBalance);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

// Ruta getTransactionRegister
router.get("/register", async (req, res) => {
  try {
    const { account } = req.body;
    const getRegister = await getTransactionRegister(account);
    res.send(getRegister);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

// Ruta newTransactionVoucher
router.post("/voucher", async (req, res) => {
  try {
    const {
      balanceDisc,
      idDisc,
      balanceAccre,
      idAccre,
      comentario,
      saldo,
      origen,
      destino,
    } = req.body;
    const newRegister = await newTransactionVoucher(
      balanceDisc,
      idDisc,
      balanceAccre,
      idAccre,
      comentario,
      saldo,
      origen,
      destino
    );
    res.send(newRegister);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

export default router;
