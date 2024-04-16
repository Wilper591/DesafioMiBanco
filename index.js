import rutas from "./src/routes/index.routes.js";
import express from "express";
const app = express();
const PORT = 3000;

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rutas
app.use("/apiV1", rutas);

//Ruta Genérica
app.get("*", (req, res) => {
  res.send(`<h1>Esta página No Existe</h1>`);
});

export { app, PORT };