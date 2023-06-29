import express from "express";
import cors from "cors";

// TEM QUE SER O PRIMEIRO IMPORT PARA FAZER O DOTENV FUNCIONAR
import db from "./config/dbConnect.js";

import routes from "./routes/index.js";

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
