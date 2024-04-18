import { app, PORT } from "../index.js";

/* Se levanta el servidor */
app.listen(PORT, () => {
  console.log(`Servidor conectado al puerto ${PORT} - PID ${process.pid}`);
});
