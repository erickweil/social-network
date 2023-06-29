import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.static("public"));

// Habilita o CORS para todas as origens
app.use(cors());

// habilitando o uso de json pelo express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passando para o arquivo de rotas o app, que envia junto uma instância do express
routes(app);

export default app;
