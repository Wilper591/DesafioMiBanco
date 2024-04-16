import { pool } from "../db.js";
import moment from "moment";
const fecha = moment().format("DD-M-YYYY H:mm:ss");

/* Genera nueva transferencia  */
const newTransaction = async (balanceDisc, idDisc, balanceAccre, idAccre) => {
  try {
    const discount =
      "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *";
    const valuesDisc = [balanceDisc, idDisc];
    const clientDiscount = await pool.query(discount, valuesDisc);

    const accredit =
      "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 RETURNING *";
    const valuesAccre = [balanceAccre, idAccre];
    const clientAccredit = await pool.query(accredit, valuesAccre);

    console.log({
      status: "Success",
      message: "Transacción realizada con éxito.",
      code: 200,
      emisor: clientDiscount.rows[0],
      receptor: clientAccredit.rows[0],
    });
    return {
      status: "Success",
      message: "Transacción realizada con éxito.",
      code: 200,
      emisor: clientDiscount.rows[0],
      receptor: clientAccredit.rows[0],
    };
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};
/* newTransaction(10000, 2, 10000, 3); */

/* Genera registro de transacción */
const newVoucher = async (comentario, saldo, origen, destino) => {
  try {
    const transaction = `INSERT INTO transferencias
      (descripcion, fecha, monto, cuenta_origen, cuenta_destino) 
      VALUES($1, '${fecha}', $2, $3, $4) RETURNING *`;
    const values = [comentario, saldo, origen, destino];
    const transactionSuccess = await pool.query(transaction, values);

    console.log({
      status: "Success",
      message: "Registro realizado con éxito.",
      code: 200,
      emisor: transactionSuccess.rows[0],
    });
    return {
      status: "Success",
      message: "Registro realizado con éxito.",
      code: 200,
      emisor: transactionSuccess.rows[0],
    };
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Registro fallida",
    });
  }
};
/* newVoucher("Compras", 1000, 1, 3); */

/* Genera nueva transferencia y actualiza saldo de cuentas */
const newTransactionVoucher = async (balance, idOut, idIn, comentario) => {
  try {
    /* Inica la transacción */
    console.log("BEGIN START");
    await pool.query("BEGIN");
    const transaction = await newTransaction(balance, idOut, balance, idIn);
    const voucher = await newVoucher(comentario, balance, idOut, idIn);
    if (!transaction || !voucher) {
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "La operación ha sido anulada",
        code: 500,
      });
    } else {
      /* Finaliza transcción */
      console.log({
        status: "Success",
        message: "Operación realizada con éxito.",
        code: 200,
      });
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Operación realizada con éxito.",
        code: 200,
      };
    }
  } catch (error) {
    await pool.end();
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};
/* newTransactionVoucher(1000, 1, 1000, 2, "compras", 1000, 1, 2); */
/* Consulta de saldo de un ID */
const getBalanceAccount = async (id) => {
  try {
    /* Inica la transacción */
    console.log("BEGIN START");
    await pool.query("BEGIN");

    const selectAccount = "SELECT saldo FROM cuentas WHERE id = $1";
    const values = [id];
    const consultaSaldo = await pool.query(selectAccount, values);

    if (!consultaSaldo.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo realizar la consulta",
        code: 500,
      });
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Consulta realizada con éxito.",
        code: 200,
        emisor: consultaSaldo.rows[0],
      });
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Consulta realizada con éxito.",
        code: 200,
        emisor: consultaSaldo.rows[0],
      };
    }
  } catch (error) {
    await pool.end();
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};
/* getBalanceAccount(1) */

/* Consulta las ultimas 10 transacciones */
const getTransactionRegister = async (cuentaOrigen) => {
  try {
    /* Inica la transacción */
    console.log("BEGIN START");
    await pool.query("BEGIN");

    const queryTransaction =
      "SELECT * FROM transferencias WHERE cuenta_origen = $1 LIMIT 10";
    const values = [cuentaOrigen];
    const getRegister = await pool.query(queryTransaction, values);

    if (!getRegister.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo realizar la consulta",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo realizar la consulta",
        code: 500,
      };
    } else {
      /* Seccess */
      console.log({
        status: "Success",
        message: "Consulta realizada con éxito.",
        code: 200,
        emisor: getRegister.rows,
      });
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Consulta realizada con éxito.",
        code: 200,
        emisor: getRegister.rows,
      };
    }
  } catch (error) {
    await pool.end();
    console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Consulta fallida",
    });
    return {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Consulta fallida",
    };
  }
};
/* getTransactionRegister(5); */

export { getBalanceAccount, getTransactionRegister, newTransactionVoucher };
