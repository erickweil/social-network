import express from "express";
import cors from "cors";

// TEM QUE SER O PRIMEIRO IMPORT PARA FAZER O DOTENV FUNCIONAR
import db from "./config/dbConnect.js";

import routes from "./routes/index.js";

const app = express();

// Problema no Proxy do Code Server... Precisa decodificar 2 vezes
//app.set("query parser", (queryString) => {
//    //return new URLSearchParams(queryString);
//    console.log(queryString);
//    return queryparser.decode(queryString);
//});

app.use(express.static("public"));

// habilitando o uso de json pelo express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Habilita o CORS para todas as origens
app.use(cors());

// Passando para o arquivo de rotas o app, que envia junto uma instância do express
routes(app);

export default app;
